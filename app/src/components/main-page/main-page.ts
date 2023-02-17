import { createElement, createButton, createImage } from '../helpers/helpers';
import { createChoiceContainer } from '../choice-settings/choice';
import { renderChat } from '../chat/chat';
import { createRegistrationContainer } from '../registration/registration';
import Router from '../router';
import { createExitWindow } from '../exit-window/exit-window';
import { createErrorPage } from '../error-page/error-page';
import { langData } from '../data';
import { language } from '../local-storage';

const createChoiceGameContainer = (lang: string) => {
  const container = createElement('div', 'choice-game');
  const btnPlayWithComp = createButton(
    'btn-computer',
    'button',
    langData[lang]['btn-play-comp'],
  );
  const btnMultiplayer = createButton(
    'btn-multiplayer',
    'button',
    langData[lang]['btn-play-online'],
  );
  const btnRules = createButton('btn-rules', 'button', langData[lang]['btn-rules']);
  container.append(btnPlayWithComp, btnMultiplayer, btnRules);

  btnRules.addEventListener('click', () => {
    Router.setState('rules');
    Router.checkPage();
    document.querySelector('.registration-container')?.remove();
  });

  return container;
};

export const createMainPage = (lang: string) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  const logo = createImage('logo', '../assets/img/logo-UNO.png', 'logo');
  if ('404' !== window.history.state) {
    main?.append(logo, createChoiceGameContainer(lang), renderChat());
  } else createErrorPage();

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

export const showChoiceContainer = (lang: string) => {
  (document.querySelector('.opacity') as HTMLDivElement).classList.add(
    'show',
  );
  createChoiceContainer(lang);
};

const goToMainPage = (main: HTMLDivElement, element: HTMLButtonElement, lang: string) => {
  const resultsBtn = document.querySelector('.btn-results') as HTMLButtonElement;
  if (resultsBtn) resultsBtn.remove();
  if (!window.location.href.includes('404')) main.innerHTML = '';
  element.remove();
  createMainPage(lang);
  Router.setState('home');
  Router.checkPage();
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
  if (element.closest('.btn-main-page')) {
    if (document.querySelector('.game-field')) {
      (document.querySelector('.opacity') as HTMLDivElement).classList.add(
        'show',
      );
      createExitWindow(language.chosen);
    } else {
      goToMainPage(main, element, language.chosen);
      if (!document.querySelector('.registration-container')) createRegistrationContainer(language.chosen);
    }
  }
  if (element.closest('.btn-yes')) {
    (document.querySelector('.opacity') as HTMLDivElement).classList.remove(
      'show',
    );
    goToMainPage(main, element, language.chosen);
    if (!document.querySelector('.registration-container')) createRegistrationContainer(language.chosen);
  }
  if (element.closest('.btn-no')) {
    (document.querySelector('.opacity') as HTMLDivElement).classList.remove(
      'show',
    );
    element.parentElement?.parentElement?.remove();
  }
});
