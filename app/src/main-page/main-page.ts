import { createElement, createButton, createImage } from '../helpers/helpers';
import { createDevelopedByContainer } from '../developed-by/developed-by';

const body = document.querySelector('.body') as HTMLDivElement;
const header = createElement('header', 'header') as HTMLDivElement;
const main = createElement('main', 'main') as HTMLDivElement;
const footer = createElement('footer', 'footer') as HTMLDivElement;
body.append(header, main, footer);

const createBtnsHeaderContainer = () => {
  const container = createElement('div', 'btns-container');
  const btnLang = createButton('btn-lang', 'button', 'en');
  btnLang.onclick = () => {
    if (btnLang.classList.contains('off')) {
      btnLang.classList.remove('off');
      btnLang.textContent = 'en';
    } else {
      btnLang.classList.add('off');
      btnLang.textContent = 'ru';
    }
  };
  const btnMusicVolume = createButton('btn-music', 'button', 'music ON');
  btnMusicVolume.onclick = () => {
    btnMusicVolume.classList.toggle('off');
    if (btnMusicVolume.classList.contains('off')) {
      btnMusicVolume.textContent = 'music OFF';
    } else {
      btnMusicVolume.textContent = 'music ON';
    }
  };
  const btnSoundsVolume = createButton('btn-sounds', 'button', 'sound ON');
  btnSoundsVolume.onclick = () => {
    btnSoundsVolume.classList.toggle('off');
    if (btnSoundsVolume.classList.contains('off')) {
      btnSoundsVolume.textContent = 'sound OFF';
    } else {
      btnSoundsVolume.textContent = 'sound ON';
    }
  };
  const btnDevelopedBy = createButton(
    'btn-developed',
    'button',
    'developed by',
  );
  const btnShare = createButton('btn-share', 'button', 'share');
  btnShare.onclick = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Игра UNO',
        text: 'Тебе давно уже пора заняться чем-то по истинне крутым.',
        url: window.location.href,
      })
        .then(() => console.log('Удалось поделиться'))
        .catch((error) => console.log('Не удалось поделиться', error));
    }
  };
  container.append(btnLang, btnDevelopedBy, btnMusicVolume, btnSoundsVolume, btnShare);
  return container;
};

const logo = createImage('logo', '../assets/img/logo-UNO.png', 'logo');
const settings = createImage(
  'settings',
  '../assets/img/settings.png',
  'settings',
);
header.append(createBtnsHeaderContainer(), settings);
main.append(logo);

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
  return container;
};
main.append(createChoiceGameContainer());

document.querySelector('.body')?.append(createDevelopedByContainer());

document.addEventListener('click', (e) => {
  const element = e.target as HTMLButtonElement;
  if (element.closest('.btn-developed')) {
    (document.querySelector('.opacity') as HTMLDivElement).classList.add(
      'show',
    );
    (document.querySelector('.developed-by') as HTMLDivElement).classList.add(
      'show',
    );
  }
  if (element.closest('.btn-cross')) {
    (document.querySelector('.opacity') as HTMLDivElement).classList.remove(
      'show',
    );
    (
      document.querySelector('.developed-by') as HTMLDivElement
    ).classList.remove('show');
  }
  if (element.closest('.settings')) {
    element.style.transform = 'scale(0)';
    (
      document.querySelector('.header .btns-container') as HTMLDivElement
    ).classList.add('show');
    setTimeout(() => {
      (
        document.querySelector('.header .btns-container') as HTMLDivElement
      ).classList.remove('show');
      element.style.transform = 'scale(1)';
    }, 5000);
  }
});
