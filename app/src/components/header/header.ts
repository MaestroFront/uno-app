// import { body } from '../global-compomemts/constants';
import { createElement, createImage, createButton } from '../helpers/helpers';
import { musicPlay, musicStop } from './sounds';

const changeLanguage = (): void => {
  const btnLang = document.querySelector('.btn-lang') as HTMLButtonElement;
  if (btnLang.classList.contains('off')) {
    btnLang.classList.remove('off'); btnLang.textContent = 'en';
  } else {
    btnLang.classList.add('off'); btnLang.textContent = 'ru';
  } 
};

const toggleMusic = () => {
  const btnMusicVolume = document.querySelector('.btn-music') as HTMLButtonElement;
  btnMusicVolume.classList.toggle('off');
  if (btnMusicVolume.classList.contains('off')) {
    btnMusicVolume.textContent = 'music OFF';
    btnMusicVolume.value = 'off';
    void musicStop();
  } else {
    btnMusicVolume.textContent = 'music ON';
    btnMusicVolume.value = 'on';
   
    void musicPlay();
  }
};

const toggleSounds = (): void => {
  const btnSoundsVolume = document.querySelector('.btn-sounds') as HTMLButtonElement;
  btnSoundsVolume.classList.toggle('off');
  if (btnSoundsVolume.classList.contains('off')) {
    btnSoundsVolume.textContent = 'sound OFF';
    btnSoundsVolume.value = 'off';
  } else {
    btnSoundsVolume.textContent = 'sound ON';
    btnSoundsVolume.value = 'on';
  }
};

const createBtnsHeaderContainer = () => {
  const container = createElement('div', 'btns-container');
  const btnLang = createButton('btn-lang', 'button', 'en');
  btnLang.addEventListener('click', changeLanguage);

  const btnMusicVolume = createButton('btn-music', 'button', 'music ON');
  btnMusicVolume.addEventListener('click', () => {
    toggleMusic();
  });

  const btnSoundsVolume = createButton('btn-sounds', 'button', 'sound ON');
  btnSoundsVolume.addEventListener('click', () => {
    toggleSounds();
  });

  container.append(btnLang, btnMusicVolume, btnSoundsVolume);
  return container;
};

export const createButtonResults = () => {
  const mainPageButton = document.querySelector('.btn-main-page') as HTMLButtonElement;
  const results = createButton('btn-results', 'button', 'table results');
  mainPageButton.after(results);  
};

export const createHeader = (): HTMLDivElement => {
  const header = document.querySelector('.header') as HTMLDivElement;
  const returnBlock = createElement('div', 'return-block') as HTMLDivElement;
  const settings = createImage(
    'settings',
    '../assets/img/settings.png',
    'settings',
  );

  header.append(returnBlock, createBtnsHeaderContainer(), settings);
  return header;
};
