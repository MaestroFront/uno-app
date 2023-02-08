import CardDeck from './сard_deck';
import ComputerPlayer from './computer-player';
import { CardInfo, Client, Players, WebSocketMessage } from './types';
import Player from './player';
class UnoGame {
  deck: CardDeck;

  players: Players[] = [];

  user: Client;

  topCard = 999;

  currentColor = '';

  currentPlayerId = 0;

  movesCount: number; // счетчик ходов

  weNotHaveAWinner: boolean; // флаг наличия победителя

  constructor(numberOfPlayers: number, client: Client) {
    this.deck = new CardDeck();
    this.user = client;
    this.players.push({ player: new Player(client.userName) });
    for (let i = 1; i < numberOfPlayers; i++) {
      this.players.push({ player: new ComputerPlayer(`Computer-${i}`) });
    }
    this.movesCount = 0;
    this.weNotHaveAWinner = true;
  }

  computersMove(id: number) {
    let move = (this.players[id].player as ComputerPlayer).getMove(this.deck, this.topCard, this.currentColor);
    if (move === 999 && this.deck.isNoMoreCards()) {
      this.sendMessage('Computer take card');
      (this.players[id].player as ComputerPlayer).takeCards(this.deck.getCards());
      this.user.socket.send(JSON.stringify({ action: 'UPDATE_CARD', data: `player-${this.currentPlayerId + 1}` }));
      (this.players[this.currentPlayerId].player as ComputerPlayer).getYourCards().forEach(value => {
        const dataForSend: string = JSON.stringify({ player: `player-${this.currentPlayerId + 1}`, card: CardDeck.getColorAndValue(value) });
        this.user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
      });
      move = (this.players[id].player as ComputerPlayer).getMove(this.deck, this.topCard, this.currentColor);
    }
    if (move !== 999) {
      const cardInfo: CardInfo = CardDeck.getColorAndValue(move);
      this.topCard = move;
      if (cardInfo.color === CardDeck.colors[4]) {
        this.wildCardActions();
      } else {
        this.currentColor = cardInfo.color;
        this.user.socket.send(JSON.stringify({ action: 'MOVE', data: JSON.stringify({ topCard: cardInfo, currentColor: this.currentColor }) }));
      }
      if (cardInfo.value > 9 && cardInfo.value < 13) {
        this.funCardsActions();
      }
      this.deck.discardCard(move);
    } else {
      this.sendMessage(`${(this.players[id].player as ComputerPlayer).playersName} cant move and skip the turn!`);
    }
    this.movesCount++;
    if (this.currentPlayerId + 1 >= this.players.length) {
      this.currentPlayerId = 0;
    } else {
      this.currentPlayerId++;
    }
  }

  sendMessage(message: string): void {
    setTimeout(()=> this.user.socket.send(JSON.stringify({ action: 'MESSAGE', data: message })), 500);
  }

  checkUsersMove(cardId: number): boolean {
    const cardInfo: CardInfo = CardDeck.getColorAndValue(cardId);
    const topCardInfo: CardInfo = CardDeck.getColorAndValue(this.topCard);
    if (this.topCard === 999) {
      return !(cardInfo.color === CardDeck.colors[4] || cardInfo.value > 9);
    } else {
      return topCardInfo.color === CardDeck.colors[4]
        ? cardInfo.color === this.currentColor || cardInfo.color === CardDeck.colors[4]
        : cardInfo.color === topCardInfo.color
          || cardInfo.value === topCardInfo.value
          || cardInfo.color === CardDeck.colors[4];
    }
  }

  dealCardToUser(quantity: number):void {
    (this.players[0].player as Player).takeCards(this.deck.getCards(quantity));
    (this.players[0].player as Player).getYourCards().forEach(value => {
      const dataForSend: string = JSON.stringify({ player: `player-${1}`, card: CardDeck.getColorAndValue(value) });
      this.user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
    });
  }

  dealCardToComputer(quantity: number): void {
    for (let i = 1; i < this.players.length; i++) {
      (this.players[i].player as ComputerPlayer).takeCards(this.deck.getCards(quantity));
      (this.players[i].player as ComputerPlayer).getYourCards().forEach(value => {
        const dataForSend: string = JSON.stringify({ player: `player-${i + 1}`, card: CardDeck.getColorAndValue(value) });
        this.user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
      });
    }
  }

  startComputersMoves(): void {
    if (this.weNotHaveAWinner) {
      do {
        this.sendMessage(`Next move by ${this.players[this.currentPlayerId].player?.playersName as string}`);
        this.computersMove(this.currentPlayerId);
        this.checkOneCard();
        this.checkWinner();
        if (!this.weNotHaveAWinner) {
          break;
        }
      } while (this.currentPlayerId !== 0);
      this.sendMessage('Move by User!');
    }
  }

  funCardsActions() {
    const topCardInfo: CardInfo = CardDeck.getColorAndValue(this.topCard);
    if (topCardInfo.value === 11) {
      this.sendMessage('Lets reverse');
      this.players.reverse();
    } else if (topCardInfo.value === 12 || topCardInfo.value === 10) {
      if (this.currentPlayerId + 1 >= this.players.length) {
        this.currentPlayerId = 0;
      } else {
        this.currentPlayerId++;
      }
      if (topCardInfo.value === 10) {
        this.sendMessage(`${this.players[this.currentPlayerId].player?.playersName as string} takes 2 card and skips a turn!`);
        if (this.currentPlayerId === 0) {
          (this.players[this.currentPlayerId].player as Player).takeCards(this.deck.getCards(2));
          this.user.socket.send(JSON.stringify({ action: 'UPDATE_CARD', data: `player-${this.currentPlayerId + 1}` }));
          (this.players[this.currentPlayerId].player as Player).getYourCards().forEach(value => {
            const dataForSend: string = JSON.stringify({ player: `player-${this.currentPlayerId + 1}`, card: CardDeck.getColorAndValue(value) });
            this.user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
          });
        } else {
          (this.players[this.currentPlayerId].player as ComputerPlayer).takeCards(this.deck.getCards(2));
          this.user.socket.send(JSON.stringify({ action: 'UPDATE_CARD', data: `player-${this.currentPlayerId + 1}` }));
          (this.players[this.currentPlayerId].player as ComputerPlayer).getYourCards().forEach(value => {
            const dataForSend: string = JSON.stringify({ player: `player-${this.currentPlayerId + 1}`, card: CardDeck.getColorAndValue(value) });
            this.user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
          });
        }
      } else {
        this.sendMessage(`${this.players[this.currentPlayerId].player?.playersName as string} skips a turn!`);
      }
    }

  }

  wildCardActions() {
    const topCardInfo: CardInfo = CardDeck.getColorAndValue(this.topCard);
    if (this.currentPlayerId === 0) {
      this.sendMessage('Choose color!');
      this.user.socket.send(JSON.stringify({ action: 'USER_MUST_CHOOSE_COLOR', data: '' }));
    } else {
      this.currentColor = (this.players[this.currentPlayerId].player as ComputerPlayer).chooseColor();
      this.sendMessage(`${(this.players[this.currentPlayerId].player as ComputerPlayer).playersName} choose ${this.currentColor} color!`);
      this.user.socket.send(JSON.stringify({ action: 'MOVE', data: JSON.stringify({ topCard: topCardInfo, currentColor: this.currentColor }) }));
      if (topCardInfo.value === 14) {
        if (this.currentPlayerId + 1 >= this.players.length) {
          this.currentPlayerId = 0;
        } else {
          this.currentPlayerId++;
        }
        this.sendMessage(`${this.players[this.currentPlayerId].player?.playersName as string} takes 4 card and skips a turn!`);
        if (this.currentPlayerId === 0) {
          (this.players[this.currentPlayerId].player as Player).takeCards(this.deck.getCards(4));
          this.user.socket.send(JSON.stringify({ action: 'UPDATE_CARD', data: `player-${this.currentPlayerId + 1}` }));
          (this.players[this.currentPlayerId].player as Player).getYourCards().forEach(value => {
            const dataForSend: string = JSON.stringify({ player: `player-${this.currentPlayerId + 1}`, card: CardDeck.getColorAndValue(value) });
            this.user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
          });
        } else {
          (this.players[this.currentPlayerId].player as ComputerPlayer).takeCards(this.deck.getCards(4));
          this.user.socket.send(JSON.stringify({ action: 'UPDATE_CARD', data: `player-${this.currentPlayerId + 1}` }));
          (this.players[this.currentPlayerId].player as ComputerPlayer).getYourCards().forEach(value => {
            const dataForSend: string = JSON.stringify({ player: `player-${this.currentPlayerId + 1}`, card: CardDeck.getColorAndValue(value) });
            this.user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
          });
        }
      }
    }
  }

  stopGame() {
    this.calculatePoints();
  }

  calculatePoints() {
    const results: { players: string, points: number }[] = [];
    for (let i = 0; i < this.players.length; i++) {
      const userResult: { players: string, points: number } = { players: this.players[i].player?.playersName as string, points: 0 };
      this.players[i].player?.getYourCards().forEach(value => {
        const cardInfo: CardInfo = CardDeck.getColorAndValue(value);
        switch (cardInfo.value) {
          case 13 || 14: {
            userResult.points += 50;
            break;
          }
          case 10 || 11 || 12: {
            userResult.points += 20;
            break;
          }
          default: {
            userResult.points += cardInfo.value;
            break;
          }
        }
      });
      results.push(userResult);
    }
    this.user.socket.send(JSON.stringify({ action: 'RESULTS_OF_ROUND', data: JSON.stringify(results) }));
  }

  checkWinner(): void {
    if (this.players.filter(value => { return value.player?.getNumberOfCardsInHand() === 0;}).length === 1) {
      this.sendMessage(`${this.players.filter(value => { return value.player?.getNumberOfCardsInHand() === 0;})[0].player?.playersName as string} is win this round!`);
      this.stopGame();
      this.weNotHaveAWinner = false;
    }
  }

  pushUnoButton() {
    for (let i = 1; i < this.players.length; i++) {
      setTimeout(() => this.user.socket.send(JSON.stringify({ action: 'PUSH_UNO_BUTTON', data: '' })), Math.floor(Math.random() * (7000 - 1000 + 1) + 1000));
    }
  }

  checkOneCard() {
    if (this.players[this.currentPlayerId].player?.getNumberOfCardsInHand() === 1) {
      this.pushUnoButton();
    }
  }

  startGame(): void {
    this.dealCardToUser(7);
    this.dealCardToComputer(7);
    this.sendMessage('1st move by User!');
    this.user.socket.on('message', message => {
      const mes = JSON.parse(message.toString()) as WebSocketMessage;
      switch (mes.action) {
        case 'MOVE_BY_USER': {
          if (this.weNotHaveAWinner) {
            const move = JSON.parse(mes.data) as { userName: string, cardId: string };
            if (this.checkUsersMove(parseInt(move.cardId))) {
              this.movesCount++;
              this.topCard = (this.players[0].player as Player).getMove(parseInt(move.cardId));
              const cardInfo: CardInfo = CardDeck.getColorAndValue(this.topCard);
              if (cardInfo.color === CardDeck.colors[4]) {
                this.wildCardActions();
              } else {
                this.currentColor = cardInfo.color;
                this.user.socket.send(JSON.stringify({ action: 'MOVE', data: JSON.stringify({ topCard: cardInfo, currentColor: this.currentColor }) }));
                this.currentPlayerId++;
                this.checkWinner();
                if (cardInfo.value > 9 && cardInfo.value < 13) {
                  this.funCardsActions();
                }
                this.startComputersMoves();
              }
              this.deck.discardCard(this.topCard);

            } else {
              this.sendMessage('Wrong move!');
            }
          }
          break;
        }
        case 'GET_CARD_BY_USER': {
          if ((this.players[0].player as Player).selectPossibleOptionsForMove(this.topCard, this.currentColor) || this.topCard === 999) {
            this.sendMessage('You have options for move!');
          } else {
            this.user.socket.send(JSON.stringify({ action: 'UPDATE_CARD', data: `player-${1}` }));
            this.dealCardToUser(1);
            if (!(this.players[0].player as Player).selectPossibleOptionsForMove(this.topCard, this.currentColor)) {
              this.currentPlayerId++;
              this.sendMessage('You cant options for move! You skip the turn!');
              this.startComputersMoves();
            }
          }
          break;
        }
        case 'GET_USERS_LIST': {
          const usersName: string[] = [];
          this.players.forEach(players => usersName.push(players.player?.playersName as string));
          this.user.socket.send(JSON.stringify({ action: 'SET_USERS_LIST', data: JSON.stringify(usersName) }));
          break;
        }
        case 'USERS_SELECTED_COLOR': {
          this.currentColor = mes.data;
          const cardInfo: CardInfo = CardDeck.getColorAndValue(this.topCard);
          this.user.socket.send(JSON.stringify({ action: 'MOVE', data: JSON.stringify({ topCard: cardInfo, currentColor: this.currentColor }) }));
          if (cardInfo.value === 14) {
            this.currentPlayerId++;
            this.sendMessage(`${(this.players[this.currentPlayerId].player as ComputerPlayer).playersName} take 2 cards and skip turn!`);
            (this.players[this.currentPlayerId].player as ComputerPlayer).takeCards(this.deck.getCards(2));
            this.user.socket.send(JSON.stringify({ action: 'UPDATE_CARD', data: `player-${this.currentPlayerId + 1}` }));
            (this.players[this.currentPlayerId].player as ComputerPlayer).getYourCards().forEach(value => {
              const dataForSend: string = JSON.stringify({ player: `player-${this.currentPlayerId + 1}`, card: CardDeck.getColorAndValue(value) });
              this.user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
            });
          }
          if (this.currentPlayerId + 1 >= this.players.length) {
            this.currentPlayerId = 0;
          } else {
            this.currentPlayerId++;
            this.checkWinner();
            this.startComputersMoves();
          }
          break;
        }
      }
    });
  }
}
export default UnoGame;
