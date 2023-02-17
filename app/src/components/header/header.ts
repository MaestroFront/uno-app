// import { body } from '../global-compomemts/constants';
import { createElement, createImage, createButton } from '../helpers/helpers';
import { createRegistrationContainer } from '../registration/registration';
import { setBtnText } from '../local-storage';
import { musicPlay, musicStop, offSounds, onSounds, setMusic, setSounds } from '../sounds';
import { language } from '../local-storage';
import { langData } from '../data';
import Router from '../router';

const changeLanguage = (): void => {
  const btnLang = document.querySelector('.btn-lang') as HTMLButtonElement;
  if (btnLang.classList.contains('off')) {
    btnLang.classList.remove('off'); btnLang.textContent = 'en';
  } else {
    btnLang.classList.add('off'); btnLang.textContent = 'ru';
  }
  language.chosen = btnLang.textContent;
  localStorage.setItem('language', language.chosen);
 
  setTimeout(() => {
    Router.checkPage();
  }, 1000);
  
};

const toggleMusic = (lang: string) => {
  const btnMusicVolume = document.querySelector('.btn-music') as HTMLButtonElement;
  btnMusicVolume.classList.toggle('off');

  if (btnMusicVolume.classList.contains('off')) {
    btnMusicVolume.textContent = langData[lang]['btn-music-off'];
    btnMusicVolume.value = 'off';
    void musicStop();
  } else {
    btnMusicVolume.textContent = langData[lang]['btn-music-on'];
    btnMusicVolume.value = 'on';
    void musicPlay();
  }

  localStorage.setItem('music', btnMusicVolume.value);
};

const toggleSounds = (lang: string): void => {
  const btnSoundsVolume = document.querySelector('.btn-sounds') as HTMLButtonElement;
  btnSoundsVolume.classList.toggle('off');
  if (btnSoundsVolume.classList.contains('off')) {
    btnSoundsVolume.textContent = langData[lang]['btn-sound-off'];
    btnSoundsVolume.value = 'off';
    offSounds();
  } else {
    btnSoundsVolume.textContent = langData[lang]['btn-sound-on'];
    btnSoundsVolume.value = 'on';
    onSounds();
  }

  localStorage.setItem('sounds', btnSoundsVolume.value);
};

const createBtnsHeaderContainer = (lang: string) => {
  const container = createElement('div', 'btns-container');
  const btnLang = createButton('btn-lang', 'button', 'en');
  btnLang.addEventListener('click', changeLanguage);
  setBtnText(btnLang, 'language', 'en');

  const btnMusicVolume = createButton('btn-music', 'button', '');
  setBtnText(btnMusicVolume, 'music', langData[lang]['btn-music-on']);
  setMusic(btnMusicVolume);

  btnMusicVolume.addEventListener('click', () => {
    toggleMusic(lang);
  });

  const btnSoundsVolume = createButton('btn-sounds', 'button', '');
  setBtnText(btnSoundsVolume, 'sounds', langData[lang]['btn-sound-on']);
  setSounds(btnSoundsVolume);

  btnSoundsVolume.addEventListener('click', () => {
    toggleSounds(language.chosen);
  });

  container.append(btnLang, btnMusicVolume, btnSoundsVolume);
  return container;
};

export const createButtonResults = (lang: string) => {
  const mainPageButton = document.querySelector('.btn-main-page') as HTMLButtonElement;
  const results = createButton('btn-results', 'button', langData[lang]['btn-winners-page']);
  mainPageButton.after(results);
};

export const createHeader = (lang: string): HTMLDivElement => {
  const header = document.querySelector('.header') as HTMLDivElement;
  const returnBlock = createElement('div', 'return-block') as HTMLDivElement;
  const settings = createImage(
    'settings',
    '../assets/img/settings.png',
    'settings',
  );

  header.append(returnBlock, createBtnsHeaderContainer(lang), settings);
  if (!location.hash.includes('rules')) createRegistrationContainer(lang);
  return header;
};
