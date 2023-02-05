import CardDeck from './сard_deck';
import ComputerPlayer from './computer-player';
import { CardInfo, Players } from './types';
import WebSocket from 'ws';
import * as http from 'http';
import Player from './player';
class UnoGame {
  deck: CardDeck;

  players: Players[];

  topCard = 999;

  currentColor = '';

  currentPlayerId = 0;

  previousMoveSkip = false; //

  movesCount: number; // счетчик ходов

  weNotHaveAWinner: boolean; // флаг наличия победителя

  constructor(/* numberOfPlayers:number */) {
    this.deck = new CardDeck();
    this.players = [];
    this.players.push({ player: new Player('User') });
    this.players.push({ player: new ComputerPlayer('Petya') });
    this.players.push({ player: new ComputerPlayer('Kirill') });
    this.players.push({ player: new ComputerPlayer('Petrovich') });
    this.movesCount = 0;
    this.weNotHaveAWinner = true;
  }

  createCardHTML(value: CardInfo, cardId: number): string {
    return `<div id="${cardId}" class="card num-${value.value} ${value.color}">
            <span class="inner">
            <span class="mark">${value.value}</span>
            </span>
            </div>`;
  }

  sleep(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  async startGame() {
    this.players.forEach(pl => pl.player!.takeCards(this.deck.getCards(7)));
    const server = http.createServer((req, res) => {
      res.writeHead(200);
      res.end('index.html');
    });

    server.listen(9001, () => {
      console.log('Listen port 9001');
    });
    const ws = new WebSocket.Server({ server });
    ws.on('connection', (connection) => {
      connection.send('Hello user! Let\'s play!');
      for (let i = 0; i < 4; i++) {
        let str1 = '';
        this.players[i]!.player!.getYourCards().forEach(value => str1 += this.createCardHTML(CardDeck.getColorAndValue(value), value));
        connection.send(`users_cards:pl${i}`.concat(str1));
        str1 = '';
      }
      connection.send(`<br>${this.players[0].player!.playersName} it your turn!`);
      connection.on('message', (message) => {
        if (message.toString().includes('carddd')) {
          this.players[0].player?.takeCards(this.deck.getCards());
          let str1 = '';
          this.players[0]!.player!.getYourCards().forEach(value => str1 += this.createCardHTML(CardDeck.getColorAndValue(value), value));
          connection.send(`users_cards:pl${0}`.concat(str1));
          str1 = '';
        } else if (this.currentPlayerId === 0) {
          let move = (this.players[0].player as Player).getMove(parseInt(message.toString().replace('user0_turn: ', '')));
          if (CardDeck.getColorAndValue(move).color === CardDeck.colors[4]) {
            this.currentColor = ['blue', 'green', 'red', 'yellow'][Math.floor(Math.random() * 4)];
            connection.send(this.currentColor);
          }
          if (move !== 999) {
            connection.send(`top_card: ${this.createCardHTML(CardDeck.getColorAndValue(move), move)}`);
            this.topCard = move;
            this.deck.discardCard(move);
            let str1 = '';
            this.players[0]!.player!.getYourCards().forEach(value => str1 += this.createCardHTML(CardDeck.getColorAndValue(value), value));
            connection.send('users_cards:pl0'.concat(str1));
            this.currentPlayerId++;
            while (this.currentPlayerId != 0) {
              this.sleep(1000);
              connection.send(`<br> ${this.players[this.currentPlayerId].player?.playersName as string} now is moving!`, { binary: false });
              move = (this.players[this.currentPlayerId].player as ComputerPlayer).getMove(this.deck, this.topCard, this.currentColor) ;
              if (move !== 999) {
                this.topCard = move;
                this.deck.discardCard(move);
                connection.send(`top_card: ${this.createCardHTML(CardDeck.getColorAndValue(move), move)}`);
                if (CardDeck.getColorAndValue(move).color === CardDeck.colors[4]) {
                  this.currentColor = ['blue', 'green', 'red', 'yellow'][Math.floor(Math.random() * 4)];
                  connection.send(this.currentColor);
                }
                str1 = '';
                this.players[this.currentPlayerId]!.player!.getYourCards().forEach(value => str1 += this.createCardHTML(CardDeck.getColorAndValue(value), value));
                connection.send(`users_cards:pl${this.currentPlayerId}`.concat(str1));
              }
              if (this.currentPlayerId + 1 === this.players.length) {
                this.currentPlayerId = 0;
              } else {
                this.currentPlayerId++;
              }
            }
          }
        }
      },
      );

    });
  }
}
// ws.on('connection', (connection, req) => {
//   const ip = req.socket.remoteAddress;
//   console.log(`Connected ${ip as string}`);
//   connection.send('hello!')
//   connection.on('message', (message) => {
//     for (const client of ws.clients) {
//       if (client.readyState !== WebSocket.OPEN) continue;
//       this.players.forEach(player => player.takeCards(this.deck.getCards(7)));
//       this.players.forEach(player => {
//         client.send(`${player.playersName} has ${player.getNumberOfCardsInHand()} cards`, { binary: false });
//         player.getYourCards().forEach(cardId =>
//             client.send(JSON.stringify(CardDeck.getColorAndValue(cardId)), { binary: false }));
//       });
//     }
//   });
//
// });
// this.movesCount++
// console.log(`Move ${this.movesCount}`)
// console.log('=============')
// console.log(`First move is a ${this.players[this.currentPlayerId].playersName}`)
// console.log('=============')
// this.topCard = this.players[this.currentPlayerId].getFirstMove()
// this.deck.discardCard(this.topCard)
// let topCardInfo: CardInfo = CardDeck.getColorAndValue(this.topCard)
// console.log(topCardInfo);
// this.currentColor = topCardInfo.color;
// this.currentPlayerId++
// while (this.weNotHaveAWinner) {
//   await this.sleep(2000)
//   if (!this.previousMoveSkip && (topCardInfo.color === CardDeck.colors[4] || topCardInfo.value > 9) && topCardInfo.value !== 13) {
//     switch (topCardInfo.value) {
//       case 10:
//         this.players[this.currentPlayerId].takeCards(this.deck.getCards(2));
//         console.log(`${this.players[this.currentPlayerId].playersName} takes two cards and skips a turn!`);
//         break;
//       case 11:
//         console.log('Let\'s change direction!');
//         this.players.reverse();
//         break;
//       case 12:
//         console.log(`${this.players[this.currentPlayerId].playersName} skips a turn!`);
//         break;
//       case 14:
//         this.players[this.currentPlayerId].takeCards(this.deck.getCards(4));
//         console.log(`${this.players[this.currentPlayerId].playersName} takes four cards and skips a turn!`);
//         break;
//     }
//     this.previousMoveSkip = true
//   } else {
//     this.movesCount++
//     this.previousMoveSkip = false
//     console.log(`Move ${this.movesCount}`)
//     console.log('=============')
//     console.log(`Move of ${this.players[this.currentPlayerId].playersName}`)
//     console.log('=============');
//     let move = this.players[this.currentPlayerId].getMove(this.deck, this.topCard, this.currentColor)
//     if (this.players[this.currentPlayerId].getNumberOfCardsInHand() === 0) {
//       this.weNotHaveAWinner = false
//       console.log(`${this.players[this.currentPlayerId].playersName} is win!`)
//     }
//     if (move !== 999) {
//       this.topCard = move
//       this.deck.discardCard(this.topCard)
//       topCardInfo = CardDeck.getColorAndValue(this.topCard)
//       console.log(topCardInfo);
//       this.currentColor = topCardInfo.value === 13 || topCardInfo.value === 14 ? this.players[this.currentPlayerId].chooseColor() : topCardInfo.color;
//       if (topCardInfo.value === 13 || topCardInfo.value === 14) {
//         console.log(`${this.players[this.currentPlayerId].playersName} choose ${this.currentColor} color`)
//       }
//     } else {
//       console.log(`${this.players[this.currentPlayerId].playersName} can't move!`)
//       if (!this.deck.isNoMoreCards()) {
//         if (this.players[0].selectPossibleOptionsForMove(this.topCard, this.currentColor).length === 0 &&
//             this.players[1].selectPossibleOptionsForMove(this.topCard, this.currentColor).length === 0 &&
//             this.players[2].selectPossibleOptionsForMove(this.topCard, this.currentColor).length === 0 &&
//             this.players[3].selectPossibleOptionsForMove(this.topCard, this.currentColor).length === 0) {
//           console.log('No more moves! No winner!')
//           console.log('====================')
//           console.log(this.deck)
//           console.log('====================')
//           console.log(CardDeck.getColorAndValue(this.topCard))
//           console.log('====================')
//           this.players.forEach(player => {
//             console.log(player.playersName)
//             player.getYourCards().forEach(value => console.log(CardDeck.getColorAndValue(value))})
//           })
//           break;
//         }
//       }
//     }
//   if (this.currentPlayerId + 1 >= this.players.length) {
//     this.currentPlayerId = 0
//   } else {
//     this.currentPlayerId += 1
//   }
//   }

// }
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
// }

export default UnoGame;
