/* Accepts input and converts it to commands for the model or view. */

import { createElement, createParagraph } from './components/helpers/helpers';
import { CardInfo, WebSocketMessage } from './types';
// import CardDeck, { cardDeck } from '../../server/src/game/сard_deck';
import { blueColor, greenColor, redColor, renderBlockedCard, renderCardWithNumber, renderMultiCard, renderPlusFourCard, renderPlusTwoCard, renderReverseCard, yellowColor } from './components/cards/cards';
import { clickSoundPlay, getCardSoundPlay, getChooseSound } from './components/sounds';
import { moveCurrCard } from './components/game-field/game-animation';
import { chooseColorAnimation } from './components/animated-items/animated-items';
import Router from './components/router';

class Controller {
  static webSocket: WebSocket;

  private static myName: string;

  /* Controller launch */
  static async start(port: number): Promise<void> {
    const url = '194.158.205.78'; // 'localhost'
    this.webSocket = new WebSocket(`ws://${url}:${port}`);
    function WSWhenConnect() {
      if (document.cookie.includes('user=')) {
        const cookie = document.cookie.split(';').filter(value => {return value.includes('user=');});
        Controller.webSocket.send(JSON.stringify({ action: 'UPDATE_NAME', data: cookie[0].replace('user=', '') }));
      } else {
        Controller.webSocket.send(JSON.stringify({ action: 'WHATS_MY_NAME', data: '' }));
      }
    }
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    while (this.webSocket.readyState) {
      await sleep(500).then(() => WSWhenConnect());
    }
    //TODO: Remove this feature after switching to normal maps
    function createSimpleCard(id: number, color: string, value: number) {
      const div = createElement('div', 'simple-card');

      switch (color) {
        case 'blue': {color = blueColor;} break;
        case 'red': {color = redColor;} break;
        case 'green': {color = greenColor;} break;
        default: {color = yellowColor;} break;
      }

      if (id < 100) {
        const idNum  = id % 25;
        if (idNum < 19) {
          div.append(renderCardWithNumber(value.toString(), color, 0.25));
        } else if (idNum < 21) {
          div.append(renderPlusTwoCard(color, 0.25));
        } else if (idNum < 23) {
          div.append(renderReverseCard(color, 0.25));
        } else {
          div.append(renderBlockedCard(color, 0.25));
        }
      } else if (id > 104) {
        div.append(renderPlusFourCard(0.25));
      } else {
        div.append(renderMultiCard(0.25));
      }

      div.id = id.toString();
      div.addEventListener('click', evt => {
        clickSoundPlay();
        moveCurrCard(evt);
        setTimeout(() => {
          const clickedEl = (evt.target as HTMLDivElement).closest('.cardCenter') as Element;

          if (clickedEl) {
            clickedEl.id = id.toString();
          }

          const user: string = ((evt.target as HTMLDivElement).parentElement as HTMLElement).className;
          const dataForSent = JSON.stringify({ userName: user, cardId: (evt.target as HTMLDivElement).id });
          Controller.webSocket.send(JSON.stringify({ action: 'MOVE_BY_USER', data: dataForSent }));
        }, 1500);
      });
      return div;
    }


    //TODO: Remove this feature after switching to a pretty window with popup messages
    function showColorSelectWindow():void {
      function sentChosenColor(color: string): void {
        Controller.webSocket.send(JSON.stringify({ action: 'USERS_SELECTED_COLOR', data: color }));
      }

      const diamond = document.querySelector('.diamond-container') as HTMLDivElement;
      diamond.classList.add('choose-color');
      diamond.addEventListener('click', (e: Event) => {
        void getChooseSound.play();
        sentChosenColor(chooseColorAnimation(e));
      });


      // const div = document.createElement('div');
      // div.id = 'popup_choose_color';
      // div.style.display = 'flex';
      // div.style.margin = '0 auto';
      // div.style.width = '400px';
      // div.style.top = '25%';
      // div.style.left = '25%';
      // div.style.height = '300px';
      // div.style.zIndex = '999';
      // div.style.position = 'fixed';
      // let button = document.createElement('button');
      // button.innerText = 'green';
      // button.style.backgroundColor = 'green';
      // button.onclick = () => {
      //   (document.querySelector('#popup_choose_color') as HTMLDivElement).remove();
      //   sentChosenColor('green');
      // };
      // div.append(button);
      // button = document.createElement('button');
      // button.innerText = 'blue';
      // button.style.backgroundColor = 'blue';
      // button.onclick = () => {
      //   (document.querySelector('#popup_choose_color') as HTMLDivElement).remove();
      //   sentChosenColor('blue');
      // };
      // div.append(button);
      // button = document.createElement('button');
      // button.innerText = 'red';
      // button.style.backgroundColor = 'red';
      // button.onclick = () => {
      //   (document.querySelector('#popup_choose_color') as HTMLDivElement).remove();
      //   sentChosenColor('red');
      // };
      // div.append(button);
      // button = document.createElement('button');
      // button.innerText = 'yellow';
      // button.style.backgroundColor = 'yellow';
      // button.onclick = () => {
      //   (document.querySelector('#popup_choose_color') as HTMLDivElement).remove();
      //   sentChosenColor('yellow');
      // };
      // div.append(button);
      // document.body.append(div);
    }
    Controller.webSocket.addEventListener('message', (message: MessageEvent<string>) => {
      const msg: WebSocketMessage = JSON.parse(message.data) as WebSocketMessage;
      switch (msg.action) {
        /* Getting the username assigned on the server */
        case 'YOUR_NAME': {
          this.myName = msg.data;
          break;
        }
        /* Получение карты с сервера */
        case 'GET_CARD': {
          void getCardSoundPlay();
          const data: { player: string, card: CardInfo } = JSON.parse(msg.data) as { player: string, card: CardInfo };
          const cardsOnHand = (document.querySelector(`.${data.player}`) as HTMLElement).firstChild as HTMLElement;
          cardsOnHand.append(createSimpleCard(data.card.id, data.card.color, data.card.value));
          break;
        }
        /* Receiving a message from the server */
        case 'MESSAGE': {
          if (msg.data.includes('Move by ')) {
            document.querySelectorAll('.current-player-move').forEach(value => value.classList.remove('current-player-move'));
            switch (msg.data.replace('Move by ', '')) {
              case 'Computer-1': {
                (document.querySelector('#name-player-2') as HTMLDivElement).classList.add('current-player-move');
                break;
              }
              case 'Computer-2': {
                (document.querySelector('#name-player-3') as HTMLDivElement).classList.add('current-player-move');
                break;
              }
              case 'Computer-3': {
                (document.querySelector('#name-player-4') as HTMLDivElement).classList.add('current-player-move');
                break;
              }
              default : {
                (document.querySelector('#name-player-1') as HTMLDivElement).classList.add('current-player-move');
              }
            }
          }
          console.log(msg.data);
          break;
        }
        /* Processing a move */
        case 'MOVE': {
          clickSoundPlay();
          const cardsOnHand = (document.getElementById('player-1') as HTMLDivElement).getElementsByClassName('simple-card');
          Array.from(cardsOnHand).forEach(card => {
            card.addEventListener('click', (e) => {
              moveCurrCard(e);
            });
          });
          const dataMove: { topCard: CardInfo, currentColor: string } = JSON.parse(msg.data) as { topCard: CardInfo, currentColor: string };
          (document.querySelector('.current-card') as HTMLElement).innerHTML = '';
          (document.getElementById(`${dataMove.topCard.id}`) as HTMLElement)?.remove();
          (document.querySelector('.current-card') as HTMLElement).append(createSimpleCard(dataMove.topCard.id, dataMove.topCard.color, dataMove.topCard.value));
          (document.querySelector('.rhomb') as SVGElement).style.fill = dataMove.currentColor;
          break;
        }
        /* Clears the user field with cards */
        case 'UPDATE_CARD': {
          ((document.querySelector(`.${msg.data}`) as HTMLElement).firstChild as HTMLElement).innerHTML = '';
          break;
        }
        /* Set the names of players and computers on the playing field */
        case 'SET_USERS_LIST': {
          const usersName: string[] = JSON.parse(msg.data) as string[];
          for (let i = 0; i < usersName.length; i++) {
            (document.querySelector(`#name-player-${i + 1}`) as HTMLParagraphElement).innerText = usersName[i];
          }
          break;
        }
        /* User choice of color */
        case 'USER_MUST_CHOOSE_COLOR': {
          showColorSelectWindow();
          break;
        }
        /* Pressing the UNO button */
        case 'PUSH_UNO_BUTTON': {
          (document.querySelector('.uno') as HTMLImageElement).click();
          break;
        }
        /* Get round results */
        case 'RESULTS_OF_ROUND': {
          const results: { players: string, points: number }[] = JSON.parse(msg.data) as { players: string, points: number }[];
          console.log(results);
          break;
        }
        case 'CLEAR_FIELD': {
          document.querySelectorAll('.cards').forEach(value => value.innerHTML = '') ;
          (document.querySelector('.current-card') as HTMLElement).innerHTML = '';
          (document.querySelector('.deck') as HTMLElement).innerHTML = '';
          break;
        }
        case 'INCOME_CHAT_MESSAGE': {
          const data = JSON.parse(msg.data) as { user: string, userMessage: string, time: string };
          const li = createElement('li', 'chat-message');
          const userSettingsContainer = createElement('div', 'chat-message-info') as HTMLDivElement;
          const messageContainer = createElement('div', 'message-container');
          const userMessage = createParagraph('chat-message-message', data.userMessage);
          const userNick = createParagraph('chat-message-nickname', data.user);
          const userTime = createParagraph('chat-message-time', data.time);
          messageContainer.append(userMessage);
          userSettingsContainer.append(userNick, userTime);
          li.append(messageContainer, userSettingsContainer);
          (document.querySelector('.chat-window') as HTMLElement).append(li);
          break;
        }
        case 'LOGIN': {
          const messageLogin = JSON.parse(msg.data) as { status: boolean, data: string };
          document.cookie = messageLogin.data;
          if (messageLogin.status) {
            const cookie = document.cookie.split(';').filter(value => {return value.includes('user=');});
            Controller.webSocket.send(JSON.stringify({ action: 'UPDATE_NAME', data: cookie[0].replace('user=', '') }));
            Router.setState('home');
            Router.checkPage();
            // eslint-disable-next-line no-alert
            alert(`You signed in as ${cookie[0].replace('user=', '')}`);
          } else {
          // eslint-disable-next-line no-alert
            alert('Wrong name or password');
          }
          break;
        }
        case 'REGISTRATION': {
          const messageRegistration = JSON.parse(msg.data) as { status: boolean };
          if (messageRegistration.status) {
            // eslint-disable-next-line no-alert
            alert('registered!');
            Router.setState('home');
            Router.checkPage();
          } else {
            // eslint-disable-next-line no-alert
            alert('user with this nickname already exist!');
          }
          break;
        }
      }
    });
  }

  /* Sending commands to the server to create a new game */
  static createNewGameWithComputer(numberOfPlayers: number): void {
    Controller.webSocket.send(JSON.stringify({ action: 'CREATE_GAME', data: JSON.stringify({ players: numberOfPlayers, online: false }) }));
    Controller.webSocket.send(JSON.stringify({ action: 'GET_USERS_LIST', data: '' }));
  }

  static createNewMultiplayerGame(numberOfPlayers: number): void {
    console.log(`multigame ${numberOfPlayers}`);
  }
}

export default Controller;
