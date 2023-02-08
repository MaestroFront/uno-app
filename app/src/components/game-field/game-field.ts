import {
  createElement,
  createImage,
  createParagraph,
} from '../helpers/helpers';
import Controller, { CardInfo, WebSocketMessage } from '../../controller';

const playerField = (playerClassName: string, playerName: string) => {
  const block = createElement('div', playerClassName) as HTMLDivElement;
  const cardsBlock = createElement('div', 'cards');
  const title = createParagraph('player-name', playerName);
  block.append(cardsBlock, title);

  return block;
};

const createRhomb = () => {
  const xmlns = 'http://www.w3.org/2000/svg';
  const rhomb = document.createElementNS(xmlns, 'svg');
  rhomb.classList.add('rhomb');
  rhomb.setAttributeNS(null, 'viewBox', '0 0 512 512');
  const path = document.createElementNS(xmlns, 'path');
  path.setAttribute('fill-rule', 'evenodd');
  path.setAttribute(
    'd',
    'M113.289264,70.6225973 L368.951995,70.6225973 C392.516145,70.6225973 411.618662,89.7251147 411.618662,113.289264 L411.618662,368.951995 C411.618662,392.516145 392.516145,411.618662 368.951995,411.618662 L113.289264,411.618662 C89.7251147,411.618662 70.6225973,392.516145 70.6225973,368.951995 L70.6225973,113.289264 C70.6225973,89.7251147 89.7251147,70.6225973 113.289264,70.6225973 Z',
  );
  path.setAttribute('transform', 'rotate(45 230.6 266.521)');
  rhomb.append(path);

  return rhomb;
};

export const createGameField = async (quantity: number) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  const container = createElement('div', 'game-field') as HTMLDivElement;
  if (quantity === 2) {
    container.append(
      playerField('player-1', 'player 1'),
      playerField('player-2', 'player 2'),
    );
    Controller.createNewGameWithComputer(2);
  }
  if (quantity === 3) {
    container.append(
      playerField('player-1', 'player 1'),
      playerField('player-2', 'player 2'),
      playerField('player-3', 'player 3'),
    );
    Controller.createNewGameWithComputer(3);
  }
  if (quantity === 4) {
    container.append(
      playerField('player-1', 'player 1'),
      playerField('player-2', 'player 2'),
      playerField('player-3', 'player 3'),
      playerField('player-4', 'player 4'),
    );
    Controller.createNewGameWithComputer(4);
  }
  const field = createElement('div', 'field');
  const deck = createElement('div', 'deck');
  const currentCard = createElement('div', 'current-card');
  const uno = createImage('uno', '../assets/img/logo-UNO.png', 'uno');

  field.append(deck, currentCard, createRhomb(), uno);
  container.append(field);

  main.append(container);
  /* мои подключени */
  deck.addEventListener('click', () => {
    Controller.webSocket.send(JSON.stringify({ action: 'GET_CARD_BY_USER', data: '' }));
  });
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

  Controller.webSocket.addEventListener('message', (message: MessageEvent<string>) => {
    const msg: WebSocketMessage = JSON.parse(message.data) as WebSocketMessage;
    switch (msg.action) {
      case 'GET_CARD': {
        const data: { player: string, card: CardInfo } = JSON.parse(msg.data) as { player: string, card: CardInfo };
        console.log(data.player);
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
    }
  });
};
