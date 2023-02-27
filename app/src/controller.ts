/* Accepts input and converts it to commands for the model or view. */

import { createButton, createElement, createParagraph } from './components/helpers/helpers';
import { CardInfo, WebSocketMessage } from './types';
import { blueColor, greenColor, redColor, renderBackSide, renderBlockedCard, renderCardWithNumber, renderMultiCard, renderPlusFourCard, renderPlusTwoCard, renderReverseCard, yellowColor } from './components/cards/cards';
import { clickSoundPlay, getCardSoundPlay, getChooseSound } from './components/sounds';
import { moveCurrCard } from './components/game-field/game-animation';
import { chooseColorAnimation, showBlockAnimation, showRandomColor, showReverseAnimation } from './components/animated-items/animated-items';
import Router from './components/router';
import { moveCardToPlayers, renderDeck, renderOneCard } from './components/game-field/game-field';
import { createLoader } from './index';
import { showWinnerMessage } from './components/winner-message/winner-message';
import { language } from './components/local-storage';

let myId = 0;

class Controller {
  static webSocket: WebSocket;

  private static myName: string;

  public static topCard: CardInfo = { id: 50, value: 1, color: 'yellow' };

  /* Controller launch */
  private static usersList: { name: string, id: number }[];

  static createSimpleCard(id: number, color: string, value: number) {
    const div = createElement('div', 'simple-card');
    div.append(renderBackSide(0.25));
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
        if (history.state === 'multiplayer') {
          const dataForSent = JSON.stringify({ userId: myId, cardId: (evt.target as HTMLDivElement).id });
          Controller.webSocket.send(JSON.stringify({ action: 'MOVE_BY_USER', data: dataForSent }));
        } else {
          const user: string = ((evt.target as HTMLDivElement).parentElement as HTMLElement).className;
          const dataForSent = JSON.stringify({ userName: user, cardId: (evt.target as HTMLDivElement).id });
          Controller.webSocket.send(JSON.stringify({ action: 'MOVE_BY_USER', data: dataForSent }));
        }
      }, 1500);
    });
    return div;
  }

  static createModal(title: string, text: string, tagName: string) {
    const div = createElement('div', 'modalView');
    div.id = 'modalView';
    const btn = createButton('btn-cross', 'button', 'x');
    btn.addEventListener('click', () => {
      document.getElementById('modalView')?.remove();
    });
    div.append(btn);
    const div1 = document.createElement('div');
    div1.classList.add('modalView__content', 'centered');
    const h = document.createElement('h2');
    h.innerText = title;
    const p = document.createElement('p');
    p.innerText = text;
    div1.append(h, p);
    div.append(div1);
    if (document.querySelector('.modalView')) {
      document.querySelector('.modalView')?.remove();
      document.body.append(div);
    } else {
      (document.querySelector(`${tagName}`) as HTMLDivElement).append(div);
    }
    setTimeout(() => document.querySelectorAll('.modalView').forEach((item) => item.remove()), 2000);
  }

  static async start(port: number): Promise<void> {
    const url = 'localhost'; // 'localhost' 194.158.205.78
    this.webSocket = new WebSocket(`ws://${url}:${port}`);
    function WSWhenConnect() {
      if (document.cookie.includes('user=')) {
        const cookie = document.cookie.split(';').filter(value => {return value.includes('user=');});
        Controller.webSocket.send(JSON.stringify({ action: 'UPDATE_NAME', data: cookie[0].replace('user=', '') }));
      }
      Controller.webSocket.send(JSON.stringify({ action: 'WHATS_MY_NAME', data: '' }));
    }
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    while (this.webSocket.readyState === 0) {
      await sleep(1000).then(() => {
        if (this.webSocket.readyState === 1) {
          WSWhenConnect();
        }
      });
    }
    if (this.webSocket.readyState > 1) {
      document.body.innerHTML = '';
      createLoader();
      // eslint-disable-next-line no-alert
      if (confirm('NO CONNECTION! PAGE WILL BE RELOAD!')) {
        setTimeout(() => window.location.reload(), 2000);
      }
    }

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
          if (history.state === 'multiplayer') {
            const data: { playerName: string, playerId: number, card: CardInfo } =
                JSON.parse(msg.data) as { playerName: string, playerId: number, card: CardInfo };
            if (data.playerName === this.myName) {
              const cardsOnHand = (document.querySelector('.player-1') as HTMLElement).firstChild as HTMLElement;
              cardsOnHand.append(Controller.createSimpleCard(data.card.id, data.card.color, data.card.value));
            } else {
              const cardsOnHand = (document.querySelector(`#player-${data.playerId + 1}`) as HTMLElement).firstChild as HTMLElement;
              cardsOnHand.append(Controller.createSimpleCard(data.card.id, data.card.color, data.card.value));
            }
          } else {
            const data: { player: string, card: CardInfo } = JSON.parse(msg.data) as { player: string, card: CardInfo };
            const cardsOnHand = (document.querySelector(`.${data.player}`) as HTMLElement).firstChild as HTMLElement;
            cardsOnHand.append(Controller.createSimpleCard(data.card.id, data.card.color, data.card.value));
          }
          break;
        }
        /* Receiving a message from the server */
        case 'MESSAGE': {
          if (msg.data.includes('Move by ')) {
            document.querySelectorAll('.current-player-move')
              .forEach(value => value.classList.remove('current-player-move'));
            if (history.state === 'multiplayer') {
              const name = msg.data.replace('Move by ', '');
              this.usersList.forEach(value => {
                if (value.name === name) {
                  (document.querySelector(`#name-player-${value.id + 1}`) as HTMLDivElement).classList.add('current-player-move');
                }
              });
            } else {
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
          } else {
            Controller.createModal('HELP', `${msg.data}`, '.game-field');
          }
          break;
        }
        case 'UPDATE_TOP_CARD': {
          Controller.topCard = JSON.parse(msg.data) as CardInfo;
          document.querySelector('.get-card')?.remove();
          const lastCard = renderOneCard(
            Controller.createSimpleCard(
              Controller.topCard.id, Controller.topCard.color, Controller.topCard.value));
          document.querySelector('.full-deck')?.append(lastCard);
          break;
        }
        /* Processing a move */
        case 'MOVE': {
          clickSoundPlay();
          let dataMove: { topCard: CardInfo, userID: number, currentColor: string } | { topCard: CardInfo, currentColor: string };
          if (history.state === 'multiplayer') {
            dataMove = JSON.parse(msg.data) as { topCard: CardInfo, userID: number, currentColor: string };
            const cardsOnHand = (document.getElementById(`player-${(dataMove as  { topCard: CardInfo, userID: number, currentColor: string }).userID + 1}`) as HTMLDivElement).getElementsByClassName('simple-card');
            Array.from(cardsOnHand ).forEach(card => {
              card.addEventListener('click', (e) => {
                moveCurrCard(e);
              });
            });
          } else {
            const cardsOnHand = (document.getElementById('player-1') as HTMLDivElement).getElementsByClassName('simple-card');
            Array.from(cardsOnHand).forEach(card => {
              card.addEventListener('click', (e) => {
                moveCurrCard(e);
              });
            });
            dataMove = JSON.parse(msg.data) as { topCard: CardInfo, currentColor: string };
          }
          (document.querySelector('.current-card') as HTMLElement).innerHTML = '';
          (document.getElementById(`${dataMove.topCard.id}`) as HTMLElement)?.remove();
          (document.querySelector('.current-card') as HTMLElement).append(Controller.createSimpleCard(dataMove.topCard.id, dataMove.topCard.color, dataMove.topCard.value));
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
          let usersName: string[] | { name: string, id: number }[];
          if (history.state === 'multiplayer') {
            usersName = JSON.parse(msg.data) as { name: string, id: number }[];
            this.usersList = [...usersName];
            myId = 0;
            const players: HTMLElement[] = [];
            usersName.forEach(value => {if (value.name === this.myName) {myId = value.id;}});
            for (let i = 0; i < usersName.length; i++) {
              (document.querySelector(`#name-player-${i + 1}`) as HTMLParagraphElement).innerText = usersName[i].name;
              players.push((document.querySelector(`.player-${i + 1}`)) as HTMLElement);
            }
            switch (myId) {
              case 1: {
                players[0].className = `player-${players.length}`;
                for (let i = 1; i < players.length; i++) {
                  players[i].className = `player-${i}`;
                }
                break;
              }
              case 2: {
                if (players.length === 4) {
                  players[0].className = 'player-3';
                  players[1].className = 'player-4';
                  players[2].className = 'player-1';
                  players[3].className = 'player-2';
                } else {
                  players[0].className = 'player-2';
                  players[1].className = 'player-3';
                  players[2].className = 'player-1';
                }
                break;
              }
              case 3: {
                players[3].className = 'player-1';
                for (let i = 0; i < 3; i++) {
                  players[i].className = `player-${i + 2}`;
                }
                break;
              }
            }
          } else {
            usersName = JSON.parse(msg.data) as string[];
            for (let i = 0; i < usersName.length; i++) {
              (document.querySelector(`#name-player-${i + 1}`) as HTMLParagraphElement).innerText = usersName[i];
            }
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
          //TODO проверить что выводит резудьтат
          showWinnerMessage(language.chosen, results[0].players, results[0].points);
          break;
        }
        case 'RESULTS_OF_GAME': {
          // TODO выводит результат за всю игру
          const results: { players: string, points: number }[] = JSON.parse(msg.data) as { players: string, points: number }[];
          console.log(results);
          // showWinnerMessage(language.chosen, results[0].players, results[0].points);
          break;
        }
        case 'WINNER': {
          // TODO выводит победителя (имя и баллы)
          const winner: { players: string, total: number } = JSON.parse(msg.data) as { players: string, total: number };
          console.log(winner);
          // showWinnerMessage(language.chosen, results[0].players, results[0].points);
          break;
        }
        case 'CLEAR_FIELD': {
          document.querySelectorAll('.cards').forEach(value => value.innerHTML = '') ;
          (document.querySelector('.current-card') as HTMLElement).remove();
          (document.querySelector('.deck') as HTMLElement).remove();
          (document.querySelector('.field') as HTMLElement).append(renderDeck(), createElement('div', 'current-card'));
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
          (document.querySelector('.message-list') as HTMLElement).append(li);
          break;
        }
        case 'LOGIN': {
          const messageLogin = JSON.parse(msg.data) as { status: boolean, data: string };
          document.cookie = messageLogin.data;
          if (messageLogin.status) {
            Controller.signAs();
          } else {
            Controller.createModal('ERROR', 'Wrong name or password', '.reg-window');
          }
          break;
        }
        case 'REGISTRATION': {
          const messageRegistration = JSON.parse(msg.data) as { status: boolean };
          if (messageRegistration.status) {
            Controller.createModal('DONE', 'Successfully registered! Please log-in!', '.reg-window');
            Router.setState('home');
            Router.checkPage();
          } else {
            Controller.createModal('ERROR', 'User with this nickname already exist!', '.reg-window');
          }
          break;
        }
        case 'START_MULTIPLAYER_GAME': {
          (document.querySelector('.finding-game') as HTMLDivElement)?.remove();
          moveCardToPlayers(true, false, false, localStorage.getItem('reverse') as string);
          break;
        }
        case 'REVERSE': {
          const direction = !(JSON.parse(msg.data) as { direction: boolean }).direction;
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          localStorage.setItem('reverse', `${direction}`);
          showReverseAnimation(direction);
          break;
        }
        case 'SKIP_TURN': {
          // анимация пропуска хода
          showBlockAnimation();
          break;
        }
        case 'COMPUTER_CHOOSE_COLOR': {
          let color = msg.data;
          switch (color) {
            case 'blue': {color = blueColor;} break;
            case 'red': {color = redColor;} break;
            case 'green': {color = greenColor;} break;
            default: {color = yellowColor;} break;
          }
          (document.querySelector('.rhomb') as HTMLElement).style.fill = color;
          showRandomColor(color);
          break;
        }
      }
    });
  }

  static signAs() {
    const cookie = document.cookie.split(';').filter(value => {return value.includes('user=');});
    Controller.webSocket.send(JSON.stringify({ action: 'UPDATE_NAME', data: cookie[0].replace('user=', '') }));
    Router.setState('home');
    Router.checkPage();
    Controller.createModal('DONE', `You signed in as ${cookie[0].replace('user=', '')}`, '.reg-window');
  }

  /* Sending commands to the server to create a new game */
  static createNewGameWithComputer(numberOfPlayers: number): void {
    Controller.webSocket.send(JSON.stringify({ action: 'CREATE_GAME', data: JSON.stringify({ players: numberOfPlayers, online: false }) }));
    Controller.webSocket.send(JSON.stringify({ action: 'GET_USERS_LIST', data: '' }));
  }

  static createNewMultiplayerGame(numberOfPlayers: number): void {
    Controller.webSocket.send(JSON.stringify({ action: 'CREATE_GAME', data: JSON.stringify({ players: numberOfPlayers, online: true }) }));
  }
}

export default Controller;
