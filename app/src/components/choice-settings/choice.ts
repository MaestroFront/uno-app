import { createGameField, moveCardToPlayer, showDistributionCardsForPlayers } from '../game-field/game-field';
import { createButtonResults } from '../header/header';
import { addButtonBackToMainPage, createButton, createElement, createImage, createParagraph } from '../helpers/helpers';
import Controller from '../../controller';
import { removeRegistrationContainer } from '../registration/registration';
import { language } from '../local-storage';
import { langData } from '../data';

export const createChoiceContainer = (lang: string) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  const container = createElement('div', 'choice-container') as HTMLDivElement;
  const quantityPlayersBlock = createElement('div', 'choice-quantity') as HTMLDivElement;
  const quantutyTitle = createParagraph('quantity-title', langData[lang]['choose-quantity']);
  const twoPlayers = createImage('two', '../assets/img/two.png', langData[lang]['choose-2-players']);
  const threePlayers = createImage('three', '../assets/img/three.png', langData[lang]['choose-3-players']);
  const fourPlayers = createImage('four', '../assets/img/four.png', langData[lang]['choose-4-players']);

  quantityPlayersBlock.append(twoPlayers, threePlayers, fourPlayers);

  const difficultyTitle = createParagraph('difficulty-title', langData[lang]['choose-difficulty']);
  const difficultyBlock = createElement('div', 'choice-difficulty') as HTMLDivElement;
  const easyDifficulty = createButton('btn-easy', 'button', langData[lang]['choose-easy']);
  const hardDifficulty = createButton('btn-hard', 'button', langData[lang]['choose-hard']);

  const cross = createButton('btn-cross', 'button', 'x');
  const btnStartGame = createButton('btn-start', 'button', langData[lang]['choose-start']);

  difficultyBlock.append(easyDifficulty, hardDifficulty);
  if (history.state !== 'multiplayer') {
    container.append(quantutyTitle, quantityPlayersBlock, difficultyTitle, difficultyBlock, btnStartGame, cross);
  } else {
    container.append(quantutyTitle, quantityPlayersBlock, btnStartGame, cross);
  }

  main.append(container);
};

const addMark = (element: HTMLElement) => {
  document.querySelectorAll('.choice-quantity .img').forEach((item) => item.classList.remove('mark'));
  element.classList.toggle('mark');
};

const choiceDifficulty = (element: HTMLElement, opponentClassName: string) => {
  element.classList.add('off');
  document.querySelector(opponentClassName)?.classList.remove('off');
};

const showStartGameBtn = () => {
  const quantityPlayers = document.querySelectorAll('.choice-quantity .img');
  const difficultiesBtns = document.querySelectorAll('.choice-difficulty .button');
  const startGameBtn = document.querySelector('.btn-start');
  let x = 0;
  quantityPlayers.forEach(item => {
    if (item.classList.contains('mark')) x += 1;
  });
  difficultiesBtns.forEach(item => {
    if (item.classList.contains('off')) x += 1;
  });
  if (x === 2 || (x === 1 && history.state === 'multiplayer')) startGameBtn?.classList.add('show');
};

export const fillGameField = (quantity: number, lang: string) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  (document.querySelector('.opacity') as HTMLDivElement).classList.remove(
    'show',
  );
  main.innerHTML = '';
  createGameField(quantity, lang);
};

export const goToGameField = (lang: string) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  let x = 0;
  (document.querySelector('.opacity') as HTMLDivElement).classList.remove(
    'show',
  );
  if ((document.querySelector('.two') as HTMLImageElement).classList.contains('mark')) x += 2;
  if ((document.querySelector('.three') as HTMLImageElement).classList.contains('mark')) x += 3;
  if ((document.querySelector('.four') as HTMLImageElement).classList.contains('mark')) x += 4;

  main.innerHTML = '';
  fillGameField(x, lang);
  addButtonBackToMainPage(lang);
  createButtonResults(lang);
  if (history.state === 'single-player') {
    Controller.createNewGameWithComputer(x);
  // }
  } else if (history.state === 'multiplayer') {
    Controller.createNewMultiplayerGame(x);
  }

};

document.addEventListener('click', (e) => {
  const element = e.target as HTMLElement;
  if (element.closest('.choice-quantity .two')) {
    addMark(element);
    showStartGameBtn();
    localStorage.setItem('players', '2');
  } else if (element.closest('.choice-quantity .three')) {
    addMark(element);
    showStartGameBtn();
    localStorage.setItem('players', '3');
  } else if (element.closest('.choice-quantity .four')) {
    addMark(element);
    showStartGameBtn();
    localStorage.setItem('players', '4');
  } else if (element.closest('.btn-easy')) {
    choiceDifficulty(element, '.btn-hard');
    showStartGameBtn();
  } else if (element.closest('.btn-hard')) {
    choiceDifficulty(element, '.btn-easy');
    showStartGameBtn();
  } else if (element.closest('.btn-start')) {
    if (history.state !== 'multiplayer') {
      goToGameField(language.chosen);
      removeRegistrationContainer();
      showDistributionCardsForPlayers(+(localStorage.getItem('players') as string));
      moveCardToPlayer();
    } else {
      // let x = 0;
      // if ((document.querySelector('.two') as HTMLImageElement).classList.contains('mark')) x += 2;
      // if ((document.querySelector('.three') as HTMLImageElement).classList.contains('mark')) x += 3;
      // if ((document.querySelector('.four') as HTMLImageElement).classList.contains('mark')) x += 4;
      goToGameField(language.chosen);
      removeRegistrationContainer();
      showDistributionCardsForPlayers(+(localStorage.getItem('players') as string));
      const div = createElement('div', 'finding-game');
      div.innerHTML = `
        <div class="yellow-circle"></div>
        <div class="red-circle"></div>
        <div class="blue-circle"></div>
        <div class="green-circle"></div>`;
      document.body.append(div);
      // Controller.createNewMultiplayerGame(x);
    }
  }
});
