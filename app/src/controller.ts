/* Accepts input and converts it to commands for the model or view. */

export interface WebSocketMessage {
  action: string,
  data: string
}

export interface CardInfo {
  id: number,
  color: string,
  value: number
}

class Controller {
  static webSocket: WebSocket;

  private static messages: string[] = ['CREATE_GAME', 'WHATS_MY_NAME'];

  private static myName: string;

  static start(port: number): void {
    this.webSocket = new WebSocket(`ws://localhost:${port}`);
    setTimeout(() => Controller.webSocket.send(JSON.stringify({ action: Controller.messages[1], data: '' })), 1000);
    Controller.webSocket.addEventListener('message', (message: MessageEvent<string>) => {
      const msg: WebSocketMessage = JSON.parse(message.data) as WebSocketMessage;
      switch (msg.action) {
        case 'YOUR_NAME':
          this.myName = msg.data;
          break;
      }
    });
  }

  static createNewGameWithComputer(numberOfPlayers: number): void {
    Controller.webSocket.send(JSON.stringify({ action: Controller.messages[0], data: JSON.stringify({ players: numberOfPlayers, online: false }) }));
  }
}

export default Controller;
