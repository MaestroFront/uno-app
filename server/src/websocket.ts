import WebSocket from 'ws';
import * as http from 'http';
import { Client, CreateGameMessage, Game, WebSocketMessage } from './game/types';
import UnoGame from './game/uno-game';

class WebsocketServer {
  private readonly ws: WebSocket.Server<WebSocket>;

  unregisteredUsersCounter: number;

  private clients: Client[] = [];

  private games: Game[] = [];

  constructor(port: number) {
    this.unregisteredUsersCounter = 0;
    const server = http.createServer((req, res) => {
      res.writeHead(200);
      res.end('index.html');
    });
    this.ws = new WebSocket.Server({ server });
    server.listen(port, () => {
      console.log(`Listen port ${port}`);
    });
  }

  connectionOnClose(connection: WebSocket) {
    connection.on('close', () => {
      const client: Client = this.clients.filter(value => {return value.socket === connection;})[0];
      console.log(`${client.userName} is disconnected!`);
      this.clients = this.clients.filter(value => {return value.socket !== connection;});
    });
  }

  findClient(connection: WebSocket): Client {
    return this.clients.filter(value => {return value.socket === connection;})[0];
  }

  connectionOnMessage(connection: WebSocket) {
    connection.on('message', (message) => {
      const msg = JSON.parse(message.toString()) as WebSocketMessage;
      switch (msg.action) {
        case 'CREATE_GAME': {
          const settings: CreateGameMessage = JSON.parse(msg.data) as CreateGameMessage;
          const newGame: Game = { id: this.games.length + 1, game: new UnoGame(settings.players, this.findClient(connection)) };
          this.games.push(newGame);
          newGame.game.startGame();
          break;
        }
        case 'WHATS_MY_NAME': {
          connection.send(JSON.stringify({ action: 'YOUR_NAME', data: this.findClient(connection).userName }));
          break;
        }
      }
    });
  }

  start() {
    this.ws.on('connection', (connection) => {
      this.unregisteredUsersCounter++;
      const client: Client = { socket: connection, userName: `User-${this.unregisteredUsersCounter}` };
      this.clients.push(client);
      console.log(`New user ${client.userName} is connected!`);
      this.connectionOnClose(connection);
      this.connectionOnMessage(connection);
    });
  }
}

export default WebsocketServer;
