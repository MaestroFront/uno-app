import WebSocket from 'ws';
import * as http from 'http';
import { Client, CreateGameMessage, DBUsers, Game, UserInfo, WebSocketMessage } from './game/types';
import UnoGame from './game/uno-game';
import chalk from 'chalk';
import DBUno from './database';
import { hashPassword } from './express';

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
      console.log(chalk.bgCyan(`Listen port ${port}`));
    });
  }

  connectionOnClose(connection: WebSocket) {
    connection.on('close', () => {
      const client: Client = this.clients.filter(value => {
        return value.socket === connection;
      })[0];
      console.log(chalk.bgRedBright(`${client.userName} is disconnected!`));
      this.clients = this.clients.filter(value => {
        return value.socket !== connection;
      });
    });
  }

  findClient(connection: WebSocket): Client {
    return this.clients.filter(value => {
      return value.socket === connection;
    })[0];
  }

  connectionOnMessage(connection: WebSocket) {
    connection.on('message', (message) => {
      const msg = JSON.parse(message.toString()) as WebSocketMessage;
      switch (msg.action) {
        case 'CREATE_GAME': {
          const settings: CreateGameMessage = JSON.parse(msg.data) as CreateGameMessage;
          const newGame: Game = {
            id: this.games.length + 1,
            game: new UnoGame(settings.players, this.findClient(connection)),
          };
          this.games.push(newGame);
          newGame.game.startGame();
          break;
        }
        case 'WHATS_MY_NAME': {
          connection.send(JSON.stringify({ action: 'YOUR_NAME', data: this.findClient(connection).userName }));
          break;
        }
        case 'UPDATE_NAME': {
          this.clients.forEach(value => {
            if (value.socket === connection) {
              console.log(chalk.bgBlue(`User ${value.userName} update nickname on ${msg.data}`));
              value.userName = msg.data;
            }
          });
          break;
        }
        case 'CHAT_MESSAGE': {
          const date = new Date();
          const userSay = this.clients.filter(value => {
            return value.socket === connection;
          })[0].userName;
          this.clients.forEach(value => {
            value.socket.send(JSON.stringify(
              {
                action: 'INCOME_CHAT_MESSAGE',
                data: JSON.stringify(
                  {
                    user: userSay,
                    userMessage: msg.data,
                    time: `${date.getHours() < 10 ? '0'.concat(date.getHours().toString()) : date.getHours()}:${date.getMinutes() < 10 ? '0'.concat(date.getMinutes().toString()) : date.getMinutes()}:${date.getSeconds() < 10 ? '0'.concat(date.getSeconds().toString()) : date.getSeconds()}`,
                  }),
              }));
          });
          break;
        }
        case 'REGISTRATION': {
          const user = JSON.parse(msg.data) as UserInfo;
          const userWS = this.clients.filter(value => {return value.socket === connection;})[0].socket;
          void DBUno.openDB('write').then(() => {
            DBUno.db.get('SELECT * FROM Users where UserName = ?', [user.userName], (err, data: DBUsers) => {
              if (data?.UserId !== undefined) {
                console.log(chalk.yellow(`New user with nickname: '${user.userName}' try registered, but this nickname already exist...`));
                userWS.send(JSON.stringify({ action: 'REGISTRATION', data: JSON.stringify({ status: false }) }));
              } else {
                user.password = hashPassword(user.password);
                DBUno.db.run('INSERT INTO Users(UserName, UserPassword, Email) VALUES(?, ?, ?)',
                  [user.userName, user.password, user.email],
                  (er) => {if (err) console.log(er);});
                console.log(chalk.green(`New user with nickname: '${user.userName}' successful registered!`));
                userWS.send(JSON.stringify({ action: 'REGISTRATION', data: JSON.stringify({ status: true }) }));
              }
            });
          }).then(()=> DBUno.closeDB()).catch();
          break;
        }
        case 'LOGIN': {
          const user = JSON.parse(msg.data) as { userName: string, password: string };
          const userWS = this.clients.filter(value => {return value.socket === connection;})[0].socket;
          void DBUno.openDB().then(()=> {
            DBUno.db.get('SELECT * FROM Users where UserName = ?', [user.userName], (err, data: DBUsers) => {
              if (data?.UserId !== undefined && data.UserPassword === hashPassword(user.password)) {
                const d = new Date();
                d.setTime(d.getTime() + (10 * 24 * 60 * 60 * 1000));
                console.log(chalk.green(`A user with a nickname '${user.userName}' is logged into the site!`));
                userWS.send(JSON.stringify({ action: 'LOGIN', data: JSON.stringify({ status: true, data: `user=${user.userName};expires=${d.toString()}` }) }));
              } else {
                console.log(chalk.red(`Try user with a nickname '${user.userName}' logged`));
                userWS.send(JSON.stringify({ action: 'LOGIN', data: JSON.stringify({ status: false, data: '' }) }));
              }
            });
          }).then(()=> DBUno.closeDB()).catch();
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
      console.log(chalk.bgYellow(`New user ${client.userName} is connected!`));
      this.connectionOnClose(connection);
      this.connectionOnMessage(connection);
    });
  }
}

export default WebsocketServer;
