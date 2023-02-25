import { CardInfo, Client, WebSocketMessage } from './types';
import CardDeck from './сard_deck';
import Player from './player';

class Multiplayer {

  users: Client[];

  private deck: CardDeck;

  private gameWinner: string;

  private topCard: number;

  private currentColor: string;

  private reverse: boolean;

  private currentPlayerId: number;

  private movesCount: number;

  private weNotHaveAWinner: boolean;

  private numberOfPlayers: number;

  private players: Player[] = [];

  private gameResults: { player: string, total: number }[];


  constructor(players: Client[], numberOfPlayers: number) {
    this.users = [...players];
    this.deck = new CardDeck();
    this.gameWinner = '';
    this.topCard = 999;
    this.currentColor = '';
    this.reverse = false;
    this.currentPlayerId = 0;
    this.movesCount = 0;
    this.weNotHaveAWinner = true;
    this.gameResults = [];
    this.numberOfPlayers = numberOfPlayers;
    for (let i = 0; i < numberOfPlayers; i++) {
      this.players.push(new Player(this.users[i].userName));
      this.gameResults.push({ player: this.users[i].userName, total: 0 });
    }
    this.users.forEach(user => user.socket.send(JSON.stringify({ action: 'START_MULTIPLAYER_GAME', data: '' })));
    this.startGame();
  }

  setNextPlayerID(): void {
    if (this.reverse) {
      if (this.currentPlayerId - 1 < 0) {
        this.currentPlayerId = this.players.length - 1;
      } else {
        this.currentPlayerId--;
      }
    } else {
      if (this.currentPlayerId + 1 === this.players.length) {
        this.currentPlayerId = 0;
      } else {
        this.currentPlayerId++;
      }
    }
  }

  /* Checking the correctness of the player's move */
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

  /* Distribution of cards to the player */
  dealCardToUser(quantity: number, playerID: number): void {
    this.players[playerID].takeCards(this.deck.getCards(quantity));
    this.players[playerID].getYourCards().forEach(value => {
      const dataForSend: string = JSON.stringify(
        { playerName: this.players[playerID].playersName,
          playerId: playerID,
          card: CardDeck.getColorAndValue(value) });
      this.users.forEach(user => user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend })));
      // this.users[playerID].socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
    });
  }

  /* Pause in milliseconds */
  sleep(millis: number) {
    const t = (new Date()).getTime();
    let i = 0;
    while (((new Date()).getTime() - t) < millis) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      i++;
    }
  }

  /* Handling card action change direction, take +2, skip turn */
  funCardsActions() {
    const topCardInfo: CardInfo = CardDeck.getColorAndValue(this.topCard);
    if (topCardInfo.value === 11) {
      this.reverse = !this.reverse;
      this.users.forEach(user => {
        user.socket.send(
          JSON.stringify({ action: 'REVERSE', data: JSON.stringify({ direction: this.reverse }) }));
      });

      this.sleep(5000);
    } else if (topCardInfo.value === 12 || topCardInfo.value === 10) {
      this.setNextPlayerID();
      if (topCardInfo.value === 10) {
        this.takeCards(2);
      } else {
        this.users.forEach(user => {
          user.socket.send(JSON.stringify({ action: 'SKIP_TURN', data: '' }));
        },
        );
        this.sleep(5000);
        this.sendMessage(`${this.players[this.currentPlayerId].playersName} skips a turn!`);
      }
    }
  }

  takeCards(quantity: number) {
    switch (quantity) {
      case 1:
        this.sendMessage(`${this.players[this.currentPlayerId].playersName } takes ${quantity} card!`);
        break;
      default:
        this.sendMessage(`${this.players[this.currentPlayerId].playersName } takes ${quantity} card and skips a turn!`);
    }
    this.users.forEach(user => {
      user.socket.send(JSON.stringify({ action: 'UPDATE_CARD', data: `player-${this.currentPlayerId + 1}` }));
    });
    this.dealCardToUser(quantity, this.currentPlayerId);
  }

  /* Handling the action of wild cards */
  wildCardActions(userId: number) {
    this.sendMessage('Choose color!');
    this.users[userId].socket.send(JSON.stringify({ action: 'USER_MUST_CHOOSE_COLOR', data: '' }));
  }

  /* Scoring at the end of the round */
  calculatePoints(): { player: string, total: number } {
    const results: { player: string, points: number }[] = [];
    const total: { player: string, total: number } = { player: '', total: 0 };
    for (let i = 0; i < this.players.length; i++) {
      const userResult: { player: string, points: number } = { player: this.players[i].playersName, points: 0 };
      this.players[i].getYourCards().forEach(value => {
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
    for (const us of results) {
      if (us.points === 0) {
        total.player = us.player;
      } else {
        total.total += us.points;
      }
    }
    this.users.forEach(user => {
      user.socket.send(JSON.stringify({ action: 'RESULTS_OF_ROUND', data: JSON.stringify(results) }));
    });
    return total;
  }

  /* Checking if there is a winner */
  checkWinner(): boolean {
    if (this.players.filter(value => { return value.getNumberOfCardsInHand() === 0;}).length === 1) {
      this.sendMessage(`${this.players.filter(value => { return value.getNumberOfCardsInHand() === 0;})[0].playersName} is win this round!`);
      this.stopGame();
      return false;
    }
    return true;
  }

  /* Handling game end actions */
  stopGame(): void {
    const roundResult: { player: string, total: number } = this.calculatePoints();
    this.gameResults.forEach(value => {
      if (roundResult.player === value.player) {
        value.total += roundResult.total;
        if (value.total >= 250) {
          this.gameWinner = value.player;
        }
      }
    });
    if (this.gameWinner !== '') {
      this.sendMessage(`${this.gameWinner} win the game!`);
    } else {
      this.deck = new CardDeck();
      this.topCard = 999;
      this.currentColor = '';
      this.reverse = false;
      this.currentPlayerId = 0;
      this.movesCount = 0;
      this.weNotHaveAWinner = true;
      this.players.forEach(value => value.clearDeck());
      this.sleep(5000);
      this.users.forEach(user => {
        user.socket.send(JSON.stringify({ action: 'CLEAR_FIELD', data: '' }));
      });
      this.startGame();
    }
  }

  /* Pressing the Uno Button */
  // pushUnoButton() {
  //   for (let i = 1; i < this.players.length; i++) {
  //     setTimeout(() => this.user.socket.send(JSON.stringify({ action: 'PUSH_UNO_BUTTON', data: '' })), Math.floor(Math.random() * (7000 - 1000 + 1) + 1000));
  //   }
  // }

  /* Checking if one card is in hand */
  // checkOneCard() {
  //   if (this.players[this.currentPlayerId].player?.getNumberOfCardsInHand() === 1) {
  //     this.pushUnoButton();
  //   }
  // }

  sendMessage(message: string): void {
    this.users.forEach(user => user.socket.send(JSON.stringify({ action: 'MESSAGE', data: message })));
  }

  sendMessageById(userID: number, message: string): void {
    this.users[userID].socket.send(JSON.stringify({ action: 'MESSAGE', data: message }));
  }

  /* Launching the start of the game */
  startGame(): void {
    const names: { name: string, id: number }[] = [];
    this.users.forEach((value, index) => {
      names.push({ name: value.userName, id: index });
    });
    this.users.forEach(value => value.socket.send(
      JSON.stringify({ action: 'SET_USERS_LIST', data: JSON.stringify(names) }),
    ));
    for (let i = 0; i < this.numberOfPlayers; i++) {
      this.dealCardToUser(7, i);
    }
    this.currentPlayerId = 0;
    this.sendMessage(`Move by ${this.players[this.currentPlayerId].playersName}`);
    this.users.forEach(user => {
      user.socket.on('message', message => {
        const mes = JSON.parse(message.toString()) as WebSocketMessage;
        switch (mes.action) {
          case 'MOVE_BY_USER': {
            const data = JSON.parse(mes.data) as { userId: number, cardId: string };
            if (this.currentPlayerId === data.userId) {
              if (this.checkUsersMove(parseInt(data.cardId))) {
                this.topCard = this.players[data.userId].getMove(parseInt(data.cardId));
                const cardInfo: CardInfo = CardDeck.getColorAndValue(this.topCard);
                if (cardInfo.color === CardDeck.colors[4]) {
                  this.wildCardActions(data.userId);
                } else {
                  this.currentColor = cardInfo.color;
                  this.users.forEach(user1 => {
                    user1.socket.send(JSON.stringify({
                      action: 'MOVE',
                      data: JSON.stringify({
                        topCard: cardInfo,
                        userID: data.userId,
                        currentColor: this.currentColor,
                      }),
                    }));
                  });
                }
                this.deck.discardCard(this.topCard);
                this.movesCount++;
                if (this.checkWinner()) {
                  if (cardInfo.value > 9 && cardInfo.value < 13) {
                    this.funCardsActions();
                  }
                  this.setNextPlayerID();
                }
              } else  {
                this.sendMessageById(data.userId, 'Wrong move!');
              }
            } else {
              this.sendMessageById(data.userId, 'It\'s not your turn!');
            }
            break;
          }
          case 'USERS_SELECTED_COLOR': {
            console.log('select color');
          }
        }
      });
    });
  }
}
export default Multiplayer;
