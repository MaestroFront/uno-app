import { createGameField, moveCardToPlayer, showDistributionCardsForPlayers } from '../game-field/game-field';
import { createButtonResults } from '../header/header';
import { addButtonBackToMainPage, createButton, createElement, createImage, createParagraph } from '../helpers/helpers';
import Controller from '../../controller';
import { removeRegistrationContainer } from '../registration/registration';

export const createChoiceContainer = () => {
  const main = document.querySelector('.main') as HTMLDivElement;
  const container = createElement('div', 'choice-container') as HTMLDivElement;
  const quantityPlayersBlock = createElement('div', 'choice-quantity') as HTMLDivElement;
  const quantutyTitle = createParagraph('quantity-title', 'Choose quantity of players');
  const twoPlayers = createImage('two', '../assets/img/two.png', 'two players');
  const threePlayers = createImage('three', '../assets/img/three.png', 'three players');
  const fourPlayers = createImage('four', '../assets/img/four.png', 'four players');

  quantityPlayersBlock.append(twoPlayers, threePlayers, fourPlayers);

  const difficultyTitle = createParagraph('difficulty-title', 'Choose difficulty');
  const difficultyBlock = createElement('div', 'choice-difficulty') as HTMLDivElement;
  const easyDifficulty = createButton('btn-easy', 'button', 'easy');
  const hardDifficulty = createButton('btn-hard', 'button', 'hard');

  const cross = createButton('btn-cross', 'button', 'x');
  const btnStartGame = createButton('btn-start', 'button', 'start');

  difficultyBlock.append(easyDifficulty, hardDifficulty);
  container.append(quantutyTitle, quantityPlayersBlock, difficultyTitle, difficultyBlock, btnStartGame, cross);
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
  if (x === 2) startGameBtn?.classList.add('show');
};

const fillGameField = (quantity: number) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  (document.querySelector('.opacity') as HTMLDivElement).classList.remove(
    'show',
  );
  main.innerHTML = '';
  createGameField(quantity);
};

const goToGameField = () => {
  const main = document.querySelector('.main') as HTMLDivElement;
  let x = 0;
  (document.querySelector('.opacity') as HTMLDivElement).classList.remove(
    'show',
  );
  if ((document.querySelector('.two') as HTMLImageElement).classList.contains('mark')) x += 2;
  if ((document.querySelector('.three') as HTMLImageElement).classList.contains('mark')) x += 3;
  if ((document.querySelector('.four') as HTMLImageElement).classList.contains('mark')) x += 4;

  main.innerHTML = '';
  fillGameField(x);
  addButtonBackToMainPage();
  createButtonResults();
  Controller.createNewGameWithComputer(x);
};

document.addEventListener('click', (e) => {
  const element = e.target as HTMLElement;
  if (element.closest('.choice-quantity .two')) {
    addMark(element);
    showStartGameBtn();
    localStorage.setItem('players', '2');
  }
  if (element.closest('.choice-quantity .three')) {
    addMark(element);
    showStartGameBtn();
    localStorage.setItem('players', '3');
  }
  if (element.closest('.choice-quantity .four')) {
    addMark(element);
    showStartGameBtn();
    localStorage.setItem('players', '4');
  }
  if (element.closest('.btn-easy')) {
    choiceDifficulty(element, '.btn-hard');
    showStartGameBtn();
  }
  if (element.closest('.btn-hard')) {
    choiceDifficulty(element, '.btn-easy');
    showStartGameBtn();
  }
  if (element.closest('.btn-start')) {
    goToGameField();
    removeRegistrationContainer();
    showDistributionCardsForPlayers(+(localStorage.getItem('players') as string));
    moveCardToPlayer();
  }
});
