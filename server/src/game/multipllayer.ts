import { Client } from './types';
import player from './player';

class Multipllayer {
  players: Client[];

  constructor(players: Client[]) {
    this.players = [...players];
    this.players.forEach(client => client.socket.send(JSON.stringify({ action: 'START_MULTIPLAYER_GAME', data: player.length.toString() })));
    this.sendMessage('HELLO!');
  }

  sendMessage(message: string): void {
    this.players.forEach(client => client.socket.send(JSON.stringify({ action: 'MESSAGE', data: message })));
  }
}

export default Multipllayer;
