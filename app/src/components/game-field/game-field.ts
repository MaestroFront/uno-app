import {
  createElement,
  createImage,
  createParagraph,
} from '../helpers/helpers';
import Controller from '../../controller';

const playerField = (playerClassName: string, playerName: string) => {
  const block = createElement('div', playerClassName) as HTMLDivElement;
  const cardsBlock = createElement('div', 'cards');
  const title = createParagraph('player-name', playerName);
  title.id = `name-${playerClassName}`;
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

export const createGameField = (quantity: number) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  const container = createElement('div', 'game-field') as HTMLDivElement;
  if (quantity === 2) {
    container.append(
      playerField('player-1', 'player 1'),
      playerField('player-2', 'player 2'),
    );
  }
  if (quantity === 3) {
    container.append(
      playerField('player-1', 'player 1'),
      playerField('player-2', 'player 2'),
      playerField('player-3', 'player 3'),
    );
  }
  if (quantity === 4) {
    container.append(
      playerField('player-1', 'player 1'),
      playerField('player-2', 'player 2'),
      playerField('player-3', 'player 3'),
      playerField('player-4', 'player 4'),
    );
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
};
