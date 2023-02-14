import { createElement, createButton, createImage } from '../helpers/helpers';
import { createChoiceContainer } from '../choice-settings/choice';
import Router from '../router';

const createChoiceGameContainer = () => {
  const container = createElement('div', 'choice-game');
  const btnPlayWithComp = createButton(
    'btn-computer',
    'button',
    'play against computer',
  );
  const btnMultiplayer = createButton(
    'btn-multiplayer',
    'button',
    'multiplayer',
  );
  const btnRules = createButton('btn-rules', 'button', 'learn, how to play');
  container.append(btnPlayWithComp, btnMultiplayer, btnRules);

  btnRules.addEventListener('click', () => {
    Router.setState('rules');
    Router.checkPage();
  });

  return container;
};

export const createMainPage = () => {
  const main = document.querySelector('.main') as HTMLDivElement;
  const logo = createImage('logo', '../assets/img/logo-UNO.png', 'logo');
  main?.append(logo, createChoiceGameContainer());

  return main;
};

const showDevelopedByBlock = () => {
  (document.querySelector('.opacity') as HTMLDivElement).classList.add(
    'show',
  );
  (document.querySelector('.developed-by') as HTMLDivElement).classList.add(
    'show',
  );
};

const hideSettings = (element: HTMLButtonElement) => {
  (
    document.querySelector('.header .btns-container') as HTMLDivElement
  ).classList.remove('show');
  element.style.transform = 'scale(1)';
};

const showSettings = (element: HTMLButtonElement) => {
  element.style.transform = 'scale(0)';
  (
    document.querySelector('.header .btns-container') as HTMLDivElement
  ).classList.add('show');
  setTimeout(() => hideSettings(element), 5000);
};

const removeChoiceContainer = () => {
  const choiceContainer = document.querySelector('.choice-container');
  choiceContainer?.remove();
  (document.querySelector('.opacity') as HTMLDivElement).classList.remove(
    'show',
  );
};

export const showChoiceContainer = () => {
  (document.querySelector('.opacity') as HTMLDivElement).classList.add(
    'show',
  );
  createChoiceContainer();
};

const goToMainPage = (main: HTMLDivElement, element: HTMLButtonElement) => {
  const resultsBtn = document.querySelector('.btn-results') as HTMLButtonElement;
  if (resultsBtn) resultsBtn.remove();
  main.innerHTML = '';
  element.remove();
  createMainPage();
};

document.addEventListener('click', (e) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  const element = e.target as HTMLButtonElement;
  if (element.closest('.btn-developed')) showDevelopedByBlock();
  if (element.closest('.settings')) showSettings(element);
  if (element.closest('.btn-computer')) {
    Router.setState('single-player');
    Router.checkPage();
  }
  if (element.closest('.choice-container .btn-cross')) {
    removeChoiceContainer();
    Router.url.searchParams.delete('difficult');
    Router.url.searchParams.delete('numberOfPlayers');
    Router.setState('home');
  }
  if (element.closest('.btn-main-page')) goToMainPage(main, element);
});
