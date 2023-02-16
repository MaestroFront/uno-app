/* Accepts input and converts it to commands for the model or view. */

import { createElement } from './components/helpers/helpers';
import { CardInfo, WebSocketMessage } from './types';
// import CardDeck, { cardDeck } from '../../server/src/game/сard_deck';
import { blueColor, greenColor, redColor, renderBlockedCard, renderCardWithNumber, renderMultiCard, renderPlusFourCard, renderPlusTwoCard, renderReverseCard, yellowColor } from './components/cards/cards';
import { clickSoundPlay, getCardSoundPlay, getChooseSound } from './components/sounds';
import { moveCurrCard } from './components/game-field/game-animation';
import { chooseColorAnimation } from './components/animated-items/animated-items';

class Controller {
  static webSocket: WebSocket;

  private static myName: string;

  /* Controller launch */
  static start(port: number): void {
    this.webSocket = new WebSocket(`ws://localhost:${port}`);
    setTimeout(() => Controller.webSocket.send(JSON.stringify({ action: 'WHATS_MY_NAME', data: '' })), 1000);
    
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
        const clickedEl = (evt.target as HTMLDivElement).closest('.cardCenter') as Element;
      
        if (clickedEl) {
          clickedEl.id = id.toString();
          //console.log(clickedEl.id);
        }
        
        const user: string = ((evt.target as HTMLDivElement).parentElement as HTMLElement).className;
        const dataForSent = JSON.stringify({ userName: user, cardId: (evt.target as HTMLDivElement).id });
        Controller.webSocket.send(JSON.stringify({ action: 'MOVE_BY_USER', data: dataForSent }));
      });
      return div;
    }

    
    //TODO: Remove this feature after switching to a pretty window with popup messages
    function showColorSelectWindow():void {
      function sentChosenColor(color: string): void {
        Controller.webSocket.send(JSON.stringify({ action: 'USERS_SELECTED_COLOR', data: color }));
      }

      let chosenColor = '';
      const diamond = document.querySelector('.diamond-container') as HTMLDivElement;
      diamond.classList.add('choose-color');
      diamond.addEventListener('click', (e: Event) => {
        chosenColor = chooseColorAnimation(e);
        void getChooseSound.play();
      });
      console.log('ann - chosen color', chosenColor); //---------------ПУСТО???
      sentChosenColor(chosenColor);
      

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
          (document.querySelector('#last-card') as HTMLDivElement).classList.remove('move');
          const dataMove: { topCard: CardInfo, currentColor: string } = JSON.parse(msg.data) as { topCard: CardInfo, currentColor: string };
          (document.querySelector('.current-card') as HTMLElement).innerHTML = '';
          (document.getElementById(`${dataMove.topCard.id}`) as HTMLElement).remove();
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
      }
    });
  }

  /* Sending commands to the server to create a new game */
  static createNewGameWithComputer(numberOfPlayers: number): void {
    Controller.webSocket.send(JSON.stringify({ action: 'CREATE_GAME', data: JSON.stringify({ players: numberOfPlayers, online: false }) }));
    Controller.webSocket.send(JSON.stringify({ action: 'GET_USERS_LIST', data: '' }));
  }
}

export default Controller;
