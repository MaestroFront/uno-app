import { createButton, createElement, createImage, createParagraph } from '../helpers/helpers';

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

  difficultyBlock.append(easyDifficulty, hardDifficulty);
  container.append(quantutyTitle, quantityPlayersBlock, difficultyTitle, difficultyBlock, cross);
  main.append(container);
};