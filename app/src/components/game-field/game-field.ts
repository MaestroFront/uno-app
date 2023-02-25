import {
  createButton,
  createElement,
  createImage,
  createParagraph,
} from '../helpers/helpers';
import Controller from '../../controller';
import { renderBackSide, renderCardWithNumber, yellowColor } from '../cards/cards';
import { getCardFromDeck } from './game-animation';
import { renderChat } from '../chat/chat';
import {
  changeDirection,
  renderBlockMessage,
  renderDiamond,
  renderReverseMessage,
} from '../animated-items/animated-items';
import { createRulesWindow, openRulesWindow } from '../rules-page/rules-page';
import { getCardsSound } from '../sounds';

const playerField = (playerClassName: string, playerName: string) => {
  const block = createElement('div', playerClassName) as HTMLDivElement;
  block.id = playerClassName;
  const cardsBlock = createElement('div', 'cards');
  const title = createParagraph('player-name', playerName);
  title.id = `name-${playerClassName}`;
  block.append(cardsBlock, title);

  return block;
};

const randomInteger = (min: number, max: number) => {
  // получить случайное число от (min-0.5) до (max+0.5)
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};

interface IPlayer {
  first_name: string,
  height_feet: null,
  height_inches: null,
  id: number,
  last_name: string,
  position: string,
  team: {
    abbreviation: string,
    city: string,
    conference: string,
    division: string,
    full_name: string,
    id: number,
    name: string,
  },
  weight_pounds: null,
}

interface IMeta {
  current_page: number,
  next_page: number,
  per_page: number,
  total_count: number,
  total_pages: number,
}

interface INBAPlayers {
  data: IPlayer[],
  met: IMeta,
}

export const searchCompName = () => {
  const index = randomInteger(0, 100);
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'f08c55ce57mshc3c9f532922130dp1f003bjsne89605faeaff',
      'X-RapidAPI-Host': 'free-nba.p.rapidapi.com',
    },
  };

  fetch('https://free-nba.p.rapidapi.com/players?page=0&per_page=100', options)
    .then((response) => response.json())
    .then((response: INBAPlayers) => localStorage.setItem('player', `${response.data[index].first_name + ' ' + response.data[index].last_name}`))
    .catch((err) => console.error(err));

  return localStorage.getItem('player');
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

const renderOneCard = (element: Element) => {
  const card = createElement('div', 'get-card') as HTMLDivElement;
  card.id = 'get-card';

  card.style.display = 'flex';
  card.style.position = 'relative';
  card.style.transformStyle = 'preserve-3d';
  card.style.transition = 'transform 1s';
  card.style.right = '-18px';


  const front = createElement('div', 'front') as HTMLDivElement;
  const back = createElement('div', 'back') as HTMLDivElement;
  back.append(renderBackSide(0.25));
  front.append(element);
  card.append(back, front);
  return card;
};

const renderDeck = (): HTMLDivElement => {
  const deck = createElement('div', 'deck') as HTMLDivElement;
  const fullDeck = createElement('div', 'full-deck') as HTMLDivElement;
  for (let i = 0; i < 5;) {
    const card = createElement('div', 'card') as HTMLDivElement;
    card.append(renderBackSide(0.25));
    card.style.right = `${i * 5}px`;
    fullDeck.append(card);
    i++;
  }

  //TODO тут отрисовывается карта, которая должна лететь на руку игроку
  const lastCard = renderOneCard(renderCardWithNumber('8', yellowColor, 0.25));
  // lastCard.classList.add('last-card');

  fullDeck.append(lastCard);
  deck.append(fullDeck);
  return deck;
};

export const createGameField = (quantity: number, lang: string) => {
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
  const deck = renderDeck();
  const currentCard = createElement('div', 'current-card');
  const uno = createImage('uno', '../assets/img/logo-UNO.png', 'uno');

  uno.addEventListener('click', () => {
    changeDirection(true);
  });
  field.append(deck, currentCard, createRhomb(), uno);
  container.append(field);

  const btnRules = createButton('btn-small-rules', 'button', '?');
  btnRules.addEventListener('click', () => {
    document.querySelector('.opacity')?.classList.add('show');
    openRulesWindow();
  });

  main.append(container, renderChat(), renderDiamond(), renderReverseMessage(), renderBlockMessage(), createRulesWindow(lang), btnRules);
  /* мои подключени */
  deck.addEventListener('click', (e) => {
    getCardFromDeck(e, 'bottom');//TODO..анимация карты в зависимости от позиции игрока: top, bottom, left, right
    Controller.webSocket.send(JSON.stringify({ action: 'GET_CARD_BY_USER', data: '' }));
  });
};

export const showDistributionCardsForPlayers = (quantityOfPlayers: number): void => {

  const deck = document.querySelector('.deck') as HTMLDivElement;
  const container = createElement('div', 'cards-container') as HTMLDivElement;

  for (let i = 0; i < quantityOfPlayers * 7; i++) {
    const card = createElement('div', 'card-distribution') as HTMLDivElement;
    card.append(renderBackSide(0.25));
    container.append(card);
  }

  deck.append(container);

};

function sliceIntoChunks(arr: NodeListOf<HTMLDivElement>, chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = Array.from(arr).slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

const hideDistributionCards = () => {
  const cards = document.querySelectorAll('.card-distribution');
  cards.forEach((card) => card.classList.add('hide-card'));
  setTimeout(() => document.querySelector('.cards-container')?.remove(), 3000);
};

const showCards = () => {
  const cards = document.querySelectorAll('.cards');
  cards?.forEach((card) => card.classList.add('show'));
};

const showPlayersNames = (): void => {
  const names = document.querySelectorAll('.player-name');
  names.forEach((name) => name.classList.add('show'));
};

export const moveCardToPlayer = (): void => {

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const cards = document.querySelectorAll('.card-distribution') as NodeListOf<HTMLDivElement>;
  const newCards = sliceIntoChunks(cards, 7);
  void getCardsSound.play();

  newCards[0].reverse().forEach((card, index) => {
    setTimeout(() => {
      card.style.transform = `translate(${index * 70 - 90}%, 165%) rotateZ(720deg)`;
    }, index * 300);
  });

  newCards[1].reverse().forEach((card, index) => {
    setTimeout(() => {
      card.style.transform = `translate(-345%, ${index * 38 - 115}%) rotateZ(720deg) rotate(270deg)`;
    }, index * 300);
  });

  if (newCards[2]) {
    newCards[2].reverse().forEach((card, index) => {
      setTimeout(() => {
        card.style.transform = `translate(${index * 70 - 90}%, -142%) rotateZ(720deg)`;
      }, index * 300);
    });
  }

  if (newCards[3]) {
    newCards[3].reverse().forEach((card, index) => {
      setTimeout(() => {
        card.style.transform = `translate(558%, ${index * 38 - 115}%) rotateZ(720deg) rotate(90deg)`;
      }, index * 300);
    });
  }

  setTimeout(() => {
    hideDistributionCards();
    showCards();
    showPlayersNames();
  }, 5000);

};
