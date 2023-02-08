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

  previousMoveSkip = false; //

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
    let move = 999;
    while (move === 999 || !this.deck.isNoMoreCards()) {
      move = (this.players[id].player as ComputerPlayer).getMove(this.deck, this.topCard, this.currentColor);
      if (move === 999) {
        this.sendMessage('Computer take card');
        (this.players[id].player as ComputerPlayer).takeCards(this.deck.getCards());
        this.user.socket.send(JSON.stringify({ action: 'UPDATE_CARD', data: `player-${this.currentPlayerId + 1}` }));
        (this.players[this.currentPlayerId].player as ComputerPlayer).getYourCards().forEach(value => {
          const dataForSend: string = JSON.stringify({ player: `player-${this.currentPlayerId + 1}`, card: CardDeck.getColorAndValue(value) });
          this.user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
        });
      }
    }
    if (move !== 999) {
      const cardInfo: CardInfo = CardDeck.getColorAndValue(move);
      this.topCard = move;
      if (cardInfo.color === CardDeck.colors[4]) {
        this.currentColor = (this.players[id].player as ComputerPlayer).chooseColor();
        this.user.socket.send(JSON.stringify({ action: 'MOVE', data: JSON.stringify({ topCard: cardInfo, currentColor: this.currentColor }) }))
      } else {
        this.user.socket.send(JSON.stringify({ action: 'MOVE', data: JSON.stringify({ topCard: cardInfo, currentColor: this.currentColor }) }));
      }
      this.deck.discardCard(move);
      this.currentColor = cardInfo.color;
      this.movesCount++
    }
    if (this.currentPlayerId + 1 >= this.players.length) {
      this.currentPlayerId = 0;
    } else {
      this.currentPlayerId++;
    }
  }

  sendMessage(message: string): void {
    setTimeout(()=> this.user.socket.send(JSON.stringify({ action: 'MESSAGE', data: message })), 500);
  }

  startGame(): void {
    (this.players[0].player as Player).takeCards(this.deck.getCards(7));
    (this.players[0].player as Player).getYourCards().forEach(value => {
      const dataForSend: string = JSON.stringify({ player: `player-${1}`, card: CardDeck.getColorAndValue(value) });
      this.user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
    });
    for (let i = 1; i < this.players.length; i++) {
      (this.players[i].player as ComputerPlayer).takeCards(this.deck.getCards(7));
      (this.players[i].player as ComputerPlayer).getYourCards().forEach(value => {
        const dataForSend: string = JSON.stringify({ player: `player-${i + 1}`, card: CardDeck.getColorAndValue(value) });
        this.user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
      });
    }
    this.sendMessage('1st move by User!');
    this.user.socket.on('message', message => {
      const mes = JSON.parse(message.toString()) as WebSocketMessage;
      switch (mes.action) {
        case 'MOVE_BY_USER': {
          const move: { userName: string, cardId: string } = JSON.parse(mes.data);
          this.topCard = (this.players[0].player as Player).getFirstMove(parseInt(move.cardId));
          const cardInfo: CardInfo = CardDeck.getColorAndValue(this.topCard);
          this.currentColor = cardInfo.color;
          this.user.socket.send(JSON.stringify({ action: 'MOVE', data: JSON.stringify({ topCard: cardInfo, currentColor: this.currentColor }) }));
          this.deck.discardCard(this.topCard);
          this.movesCount++;
          this.currentPlayerId++;
          this.sendMessage(`Next move by ${this.players[this.currentPlayerId].player?.playersName}`);
          do {this.computersMove(this.currentPlayerId);}
          while (this.currentPlayerId !== 0);
          this.sendMessage('Move by User!');
          break;
        }
        case 'GET_CARD_BY_USER': {
          (this.players[0].player as Player).takeCards(this.deck.getCards());
          this.user.socket.send(JSON.stringify({ action: 'UPDATE_CARD', data: `player-${1}` }));
          (this.players[0].player as Player).getYourCards().forEach(value => {
            const dataForSend: string = JSON.stringify({ player: `player-${1}`, card: CardDeck.getColorAndValue(value) });
            this.user.socket.send(JSON.stringify({ action: 'GET_CARD', data: dataForSend }));
          });
        }
      }
    });
  }
}
export default UnoGame;
