import CardDeck from './сard_deck';
import ComputerPlayer from './computer-player';
import { CardInfo } from './types';

class UnoGame {
  deck: CardDeck;

  players: ComputerPlayer[] = [];

  topCard = 999;

  currentColor = '';

  previousMoveSkip = false; //

  movesCount: number; // счетчик ходов

  weNotHaveAWinner:boolean; // флаг наличия победителя

  constructor(/* numberOfPlayers:number */) {
    this.deck = new CardDeck();
    this.players.push(new ComputerPlayer('Vasya'));
    this.players.push(new ComputerPlayer('Petya'));
    this.players.push(new ComputerPlayer('Kirill'));
    this.players.push(new ComputerPlayer('Petrovich'));
    this.movesCount = 0;
    this.weNotHaveAWinner = true;
  }

  startGame() {
    this.players.forEach(player => player.takeCards(this.deck.getCards(7)));
    this.players.forEach(player => {
      console.log(`${player.playersName} has ${player.getNumberOfCardsInHand()} cards`);
      player.getYourCards().forEach(cardId => console.log(CardDeck.getColorAndValue(cardId)));
    });
  }
  // let currentPlayer = this.players[0];
  // let move = 999;
  // let topCardInfo:CardInfo = { color: '', value: 999 };
  // while (this.weNotHaveAWinner) {
  //   console.log(`Move ${this.movesCount + 1}`);
  //   /* первый ход */
  //   if (this.movesCount === 0) {
  //     console.log(`First move of ${currentPlayer.playersName}`);
  //     move = currentPlayer.getFirstMove();
  //     this.topCard = move;
  //     topCardInfo = CardDeck.getColorAndValue(this.topCard);
  //     this.deck.discardCard(move);
  //     console.log(CardDeck.getColorAndValue(move));
  //     if (topCardInfo.value === 13 || topCardInfo.value === 14) {
  //       this.currentColor = currentPlayer.chooseColor();
  //       console.log(`${currentPlayer.playersName} choose ${this.currentColor} color`);
  //     }
  //   } else {
  //     /* второй и последующие ходы */
  //     console.log(`Move of ${currentPlayer.playersName}`);
  //     if (topCardInfo.color === CardDeck.colors[4]) {
  //       move = currentPlayer.getMove(this.deck, this.topCard, this.currentColor);
  //     } else {
  //       move = currentPlayer.getMove(this.deck, this.topCard);
  //     }
  //     if (move === 999) {
  //       console.log(`${currentPlayer.playersName} can't move!`);
  //     } else {
  //       this.topCard = move;
  //       this.deck.discardCard(move);
  //       if (topCardInfo.value === 13 || topCardInfo.value === 14) {
  //         this.currentColor = currentPlayer.chooseColor();
  //         console.log(`${currentPlayer.playersName} choose ${this.currentColor} color`);
  //       }
  //       console.log(CardDeck.getColorAndValue(move));
  //     }
  //   }
  //   if (currentPlayer.getNumberOfCardsInHand() === 0) {
  //     this.weNotHaveAWinner = false;
  //   } else {
  //     this.movesCount++
  //     if (this.players.indexOf(currentPlayer) === 3) {
  //       currentPlayer = this.players[0];
  //     } else {
  //       currentPlayer = this.players[this.players.indexOf(currentPlayer) + 1];
  //     }
  //     /* обработка необычных карт */
  //     if (topCardInfo.value > 9 && !this.previousMoveSkip) {
  //       switch (topCardInfo.value) {
  //         case 10:
  //           currentPlayer.takeCards(this.deck.getCards(2));
  //           this.previousMoveSkip = true;
  //           console.log(`${currentPlayer.playersName} takes two cards and skips a turn!`);
  //           break;
  //         case 11:
  //           console.log('Let\'s change direction!');
  //           this.players.reverse();
  //           break;
  //         case 12:
  //           console.log(`${currentPlayer.playersName} skips a turn!`);
  //           break;
  //         case 14:
  //           currentPlayer.takeCards(this.deck.getCards(4));
  //           console.log(`${currentPlayer.playersName} takes four cards and skips a turn!`);
  //           break;
  //       }
  //       if (this.players.indexOf(currentPlayer) === 3) {
  //         currentPlayer = this.players[0];
  //       } else {
  //         currentPlayer = this.players[this.players.indexOf(currentPlayer) + 1];
  //       }
  //     }
  //   }
  // }
  // console.log(`Player ${currentPlayer.playersName} is win! Long live the machines!`);
  // }

  //       if (topCardInfo.value === 13 || topCardInfo.value === 14) {
  //         this.currentColor = currentPlayer.chooseColor();
  //         console.log(`${currentPlayer.playersName} choose ${this.currentColor} color`);
  //       }
  //       this.movesCount++;
  //     } else {
  //       console.log(`Move of ${currentPlayer.playersName}`);

  //         this.previousMoveSkip = false;
  //         if (topCardInfo.color === CardDeck.colors[4]) {
  //           move = currentPlayer.getMove(this.deck, this.topCard, this.currentColor);
  //         } else {
  //           move = currentPlayer.getMove(this.deck, this.topCard);
  //         }
  //         if (topCardInfo.value === 13 || topCardInfo.value === 14) {
  //           this.currentColor = currentPlayer.chooseColor();
  //           console.log(`${currentPlayer.playersName} choose ${this.currentColor} color`);
  //         }
  //         if (move === 999) {
  //           console.log(`${currentPlayer.playersName} can't move!`);
  //         } else {
  //           this.topCard = move;
  //           this.deck.discardCard(move);
  //           console.log(CardDeck.getColorAndValue(move));
  //         }
  //       }
  //     }
  //     if (currentPlayer.getNumberOfCardsInHand() === 0) {
  //       win = false;
  //     } else {
  //       this.movesCount++;
  //       if (this.players.indexOf(currentPlayer) === 3) {
  //         currentPlayer = this.players[0];
  //       } else {
  //         currentPlayer = this.players[this.players.indexOf(currentPlayer) + 1];
  //       }
  //     }
  //   }
}

export default UnoGame;
