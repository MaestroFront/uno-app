/* Accepts input and converts it to commands for the model or view. */

import { createElement } from './components/helpers/helpers';

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
    function createSimpleCard(id: number, color: string, value: number) {
      const div = createElement('div', 'simple-card');
      div.style.width = '25px';
      div.style.height = '50px';
      div.style.backgroundColor = color;
      div.style.color = 'white';
      div.innerText = value.toString();
      div.id = id.toString();
      div.addEventListener('click', evt => {
        const user: string = ((evt.target as HTMLDivElement).parentElement as HTMLElement).className;
        const dataForSent = JSON.stringify({ userName: user, cardId: (evt.target as HTMLDivElement).id });
        Controller.webSocket.send(JSON.stringify({ action: 'MOVE_BY_USER', data: dataForSent }));
      });
      return div;
    }
    function showColorSelectWindow():void {
      function sentChosenColor(color: string): void {
        Controller.webSocket.send(JSON.stringify({ action: 'USERS_SELECTED_COLOR', data: color }));
      }
      const div = document.createElement('div');
      div.id = 'popup_choose_color';
      div.style.display = 'flex';
      div.style.margin = '0 auto';
      div.style.width = '400px';
      div.style.top = '25%';
      div.style.left = '25%';
      div.style.height = '300px';
      div.style.zIndex = '999';
      div.style.position = 'fixed';
      let button = document.createElement('button');
      button.innerText = 'green';
      button.style.backgroundColor = 'green';
      button.onclick = () => {
        (document.querySelector('#popup_choose_color') as HTMLDivElement).remove();
        sentChosenColor('green');
      };
      div.append(button);
      button = document.createElement('button');
      button.innerText = 'blue';
      button.style.backgroundColor = 'blue';
      button.onclick = () => {
        (document.querySelector('#popup_choose_color') as HTMLDivElement).remove();
        sentChosenColor('blue');
      };
      div.append(button);
      button = document.createElement('button');
      button.innerText = 'red';
      button.style.backgroundColor = 'red';
      button.onclick = () => {
        (document.querySelector('#popup_choose_color') as HTMLDivElement).remove();
        sentChosenColor('red');
      };
      div.append(button);
      button = document.createElement('button');
      button.innerText = 'yellow';
      button.style.backgroundColor = 'yellow';
      button.onclick = () => {
        (document.querySelector('#popup_choose_color') as HTMLDivElement).remove();
        sentChosenColor('yellow');
      };
      div.append(button);
      document.body.append(div);
    }
    Controller.webSocket.addEventListener('message', (message: MessageEvent<string>) => {
      const msg: WebSocketMessage = JSON.parse(message.data) as WebSocketMessage;
      switch (msg.action) {
        case 'YOUR_NAME': {
          this.myName = msg.data;
          break;
        }
        case 'GET_CARD': {
          const data: { player: string, card: CardInfo } = JSON.parse(msg.data) as { player: string, card: CardInfo };
          (document.querySelector(`.${data.player}`) as HTMLElement).append(createSimpleCard(data.card.id, data.card.color, data.card.value));
          break;
        }
        case 'MESSAGE': {
          // eslint-disable-next-line no-alert
          alert(msg.data);
          break;
        }
        case 'MOVE': {
          const dataMove: { topCard: CardInfo, currentColor: string } = JSON.parse(msg.data) as { topCard: CardInfo, currentColor: string };
          (document.querySelector('.current-card') as HTMLElement).innerHTML = '';
          (document.getElementById(`${dataMove.topCard.id}`) as HTMLElement).remove();
          (document.querySelector('.current-card') as HTMLElement).append(createSimpleCard(dataMove.topCard.id, dataMove.topCard.color, dataMove.topCard.value));
          (document.querySelector('.rhomb') as SVGElement).style.fill = dataMove.currentColor;
          break;
        }
        case 'UPDATE_CARD': {
          (document.querySelector(`.${msg.data}`) as HTMLElement).innerHTML = '';
          break;
        }
        case 'SET_USERS_LIST': {
          const usersName: string[] = JSON.parse(msg.data) as string[];
          for (let i = 0; i < usersName.length; i++) {
            (document.querySelector(`#name-player-${i + 1}`) as HTMLParagraphElement).innerText = usersName[i];
          }
          break;
        }
        case 'USER_MUST_CHOOSE_COLOR': {
          showColorSelectWindow();
          break;
        }
        case 'PUSH_UNO_BUTTON': {
          (document.querySelector('.uno') as HTMLImageElement).click();
          break;
        }
        case 'RESULTS_OF_ROUND': {
          const results: { players: string, points: number }[] = JSON.parse(msg.data) as { players: string, points: number }[];
          console.log(results);
          break;
        }

      }
    });
  }

  static createNewGameWithComputer(numberOfPlayers: number): void {
    Controller.webSocket.send(JSON.stringify({ action: Controller.messages[0], data: JSON.stringify({ players: numberOfPlayers, online: false }) }));
    Controller.webSocket.send(JSON.stringify({ action: 'GET_USERS_LIST', data: '' }));
  }
}

export default Controller;
