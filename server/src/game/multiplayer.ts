import { CardInfo, Client } from './types';
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
    for (let i = 1; i < numberOfPlayers; i++) {
      this.players.push(new Player(this.users[i].userName));
      this.gameResults.push({ player: this.users[i].userName, total: 0 });
    }
    this.users.forEach(user => user.socket.send(JSON.stringify({ action: 'START_MULTIPLAYER_GAME', data: '' })));

    this.sendMessage('HELLO!');
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
  dealCardToUser(quantity: number, playerID: number):void {
    this.players[playerID].takeCards(this.deck.getCards(quantity));
    this.players[playerID].getYourCards().forEach(value => {
      const dataForSend: string = JSON.stringify({ player: `player-${1}`, card: CardDeck.getColorAndValue(value) });
      this.users[playerID].socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
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
  // funCardsActions() {
  //   const topCardInfo: CardInfo = CardDeck.getColorAndValue(this.topCard);
  //   if (topCardInfo.value === 11) {
  //     this.reverse = !this.reverse;
  //     this.users.socket.send(
  //       JSON.stringify({ action: 'REVERSE', data: JSON.stringify({ direction: this.reverse }) }));
  //     this.sleep(5000);
  //   } else if (topCardInfo.value === 12 || topCardInfo.value === 10) {
  //     this.setNextPlayerID();
  //     if (topCardInfo.value === 10) {
  //       this.takeCards(2);
  //     } else {
  //       this.user.socket.send(JSON.stringify({ action: 'SKIP_TURN', data: '' }));
  //       this.sleep(5000);
  //       this.sendMessage(`${this.players[this.currentPlayerId].player?.playersName as string} skips a turn!`);
  //     }
  //   }
  // }

  // takeCards(quantity: number) {
  //   switch (quantity) {
  //     case 1:
  //       this.sendMessage(`${this.players[this.currentPlayerId].player?.playersName as string} takes ${quantity} card!`);
  //       break;
  //     default:
  //       this.sendMessage(`${this.players[this.currentPlayerId].player?.playersName as string} takes ${quantity} card and skips a turn!`);
  //   }
  //   this.users.socket.send(JSON.stringify({ action: 'UPDATE_CARD', data: `player-${this.currentPlayerId + 1}` }));
  //   if (this.currentPlayerId === 0) {
  //     this.dealCardToUser(quantity);
  //   } else {
  //     this.players[this.currentPlayerId].player?.takeCards(this.deck.getCards(quantity));
  //     this.players[this.currentPlayerId].player?.getYourCards().forEach(value => {
  //       const dataForSend: string = JSON.stringify({ player: `player-${this.currentPlayerId + 1}`, card: CardDeck.getColorAndValue(value) });
  //       this.user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
  //     });
  //   }
  // }

  /* Handling the action of wild cards */
  // wildCardActions() {
  //   const topCardInfo: CardInfo = CardDeck.getColorAndValue(this.topCard);
  //   if (this.currentPlayerId === 0) {
  //     this.sendMessage('Choose color!');
  //     this.user.socket.send(JSON.stringify({ action: 'USER_MUST_CHOOSE_COLOR', data: '' }));
  //   } else {
  //     this.currentColor = (this.players[this.currentPlayerId].player as ComputerPlayer).chooseColor();
  //     this.sendMessage(`${(this.players[this.currentPlayerId].player as ComputerPlayer).playersName} choose ${this.currentColor} color!`);
  //     this.user.socket.send(JSON.stringify({ action: 'COMPUTER_CHOOSE_COLOR', data: this.currentColor }));
  //     this.sleep(5000);
  //     this.user.socket.send(JSON.stringify({ action: 'MOVE', data: JSON.stringify({ topCard: topCardInfo, currentColor: this.currentColor }) }));
  //     if (topCardInfo.value === 14) {
  //       this.setNextPlayerID();
  //       this.takeCards(4);
  //     }
  //   }
  // }

  /* Handling game end actions */
  // stopGame(): void {
  //   const roundResult: { player: string, total: number } = this.calculatePoints();
  //   this.gameResults.forEach(value => {
  //     if (roundResult.player === value.player) {
  //       value.total += roundResult.total;
  //       if (value.total >= 250) {
  //         this.gameWinner = value.player;
  //       }
  //     }
  //   });
  //   if (this.gameWinner !== '') {
  //     this.sendMessage(`${this.gameWinner} win the game!`);
  //   } else {
  //     this.deck = new CardDeck();
  //     this.topCard = 999;
  //     this.currentColor = '';
  //     this.reverse = false;
  //     this.currentPlayerId = 0;
  //     this.movesCount = 0;
  //     this.weNotHaveAWinner = true;
  //     this.players.forEach(player => player.clearDeck());
  //     this.sleep(5000);
  //     this.users.forEach(player => player.socket.send(JSON.stringify({ action: 'CLEAR_FIELD', data: '' })));
  //     this.startGame();
  //   }
  // }

  /* Scoring at the end of the round */
  // calculatePoints(): { player: string, total: number } {
  //   const results: { player: string, points: number }[] = [];
  //   const total: { player: string, total: number } = { player: '', total: 0 };
  //   for (let i = 0; i < this.players.length; i++) {
  //     const userResult: { player: string, points: number } = { player: this.players[i].player?.playersName as string, points: 0 };
  //     this.players[i].player?.getYourCards().forEach(value => {
  //       const cardInfo: CardInfo = CardDeck.getColorAndValue(value);
  //       switch (cardInfo.value) {
  //         case 13 || 14: {
  //           userResult.points += 50;
  //           break;
  //         }
  //         case 10 || 11 || 12: {
  //           userResult.points += 20;
  //           break;
  //         }
  //         default: {
  //           userResult.points += cardInfo.value;
  //           break;
  //         }
  //       }
  //     });
  //     results.push(userResult);
  //   }
  //   for (const us of results) {
  //     if (us.points === 0) {
  //       total.player = us.player;
  //     } else {
  //       total.total += us.points;
  //     }
  //   }
  //   this.user.socket.send(JSON.stringify({ action: 'RESULTS_OF_ROUND', data: JSON.stringify(results) }));
  //   return total;
  // }

  /* Checking if there is a winner */
  // checkWinner(): boolean {
  //   if (this.players.filter(value => { return value.player?.getNumberOfCardsInHand() === 0;}).length === 1) {
  //     this.sendMessage(`${this.players.filter(value => { return value.player?.getNumberOfCardsInHand() === 0;})[0].player?.playersName as string} is win this round!`);
  //     this.stopGame();
  //     return false;
  //   }
  //   return true;
  // }

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

  /* Launching the start of the game */
  startGame(): void {
    for (let i = 0; i < this.players.length; i++) {
      this.dealCardToUser(7, i);
    }
    // this.sendMessage(`Move by ${this.players[this.currentPlayerId].playersName}`);
    // this.user.socket.on('message', message => {
    //   const mes = JSON.parse(message.toString()) as WebSocketMessage;
    //   switch (mes.action) {
    //     case 'MOVE_BY_USER': {
    //       if (this.weNotHaveAWinner) {
    //         const move = JSON.parse(mes.data) as { userName: string, cardId: string };
    //         if (this.checkUsersMove(parseInt(move.cardId))) {
    //           this.topCard = (this.players[0].player as Player).getMove(parseInt(move.cardId));
    //           const cardInfo: CardInfo = CardDeck.getColorAndValue(this.topCard);
    //           if (cardInfo.color === CardDeck.colors[4]) {
    //             this.wildCardActions();
    //           } else {
    //             this.currentColor = cardInfo.color;
    //             this.user.socket.send(JSON.stringify({ action: 'MOVE', data: JSON.stringify({ topCard: cardInfo, currentColor: this.currentColor }) }));
    //             this.deck.discardCard(this.topCard);
    //             this.movesCount++;
    //             if (this.checkWinner()) {
    //               if (cardInfo.value > 9 && cardInfo.value < 13) {
    //                 this.funCardsActions();
    //               }
    //               this.setNextPlayerID();
    //               this.startComputersMoves();
    //             }
    //           }
    //         } else {
    //           this.sendMessage('Wrong move!');
    //         }
    //       }
    //       break;
    //     }
    //     case 'GET_CARD_BY_USER': {
    //       if ((this.players[0].player as Player).selectPossibleOptionsForMove(this.topCard, this.currentColor) || this.topCard === 999) {
    //         this.sendMessage('You have options for move!');
    //       } else {
    //         this.user.socket.send(JSON.stringify({ action: 'UPDATE_CARD', data: `player-${1}` }));
    //         this.dealCardToUser(1);
    //         if (!(this.players[0].player as Player).selectPossibleOptionsForMove(this.topCard, this.currentColor)) {
    //           this.setNextPlayerID();
    //           this.sendMessage('You cant options for move! You skip the turn!');
    //           this.startComputersMoves();
    //         }
    //       }
    //       break;
    //     }
    //     case 'GET_USERS_LIST': {
    //       const usersName: string[] = [];
    //       this.players.forEach(players => usersName.push(players.player?.playersName as string));
    //       this.user.socket.send(JSON.stringify({ action: 'SET_USERS_LIST', data: JSON.stringify(usersName) }));
    //       break;
    //     }
    //     case 'USERS_SELECTED_COLOR': {
    //       this.currentColor = mes.data;
    //       const cardInfo: CardInfo = CardDeck.getColorAndValue(this.topCard);
    //       this.user.socket.send(JSON.stringify({ action: 'MOVE', data: JSON.stringify({ topCard: cardInfo, currentColor: this.currentColor }) }));
    //       if (cardInfo.value === 14) {
    //         this.setNextPlayerID();
    //         this.takeCards(4);
    //       }
    //       if (this.currentPlayerId + 1 >= this.players.length) {
    //         this.currentPlayerId = 0;
    //       } else {
    //         this.setNextPlayerID();
    //         if (this.checkWinner()) {
    //           if (this.currentPlayerId !== 0) {
    //             this.startComputersMoves();
    //           }
    //         }
    //       }
    //       break;
    //     }
    //   }
    // });
  }
}

export default Multiplayer;
