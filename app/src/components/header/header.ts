import { createElement, createImage, createButton } from '../helpers/helpers';

const changeLanguage = (): void => {
  const btnLang = document.querySelector('.btn-lang') as HTMLButtonElement;
  if (btnLang.classList.contains('off')) {
    btnLang.classList.remove('off'); btnLang.textContent = 'en';
  } else {
    btnLang.classList.add('off'); btnLang.textContent = 'ru';
  } 
};

const toggleMusic = (): void => {
  const btnMusicVolume = document.querySelector('.btn-music') as HTMLButtonElement;
  btnMusicVolume.classList.toggle('off');
  btnMusicVolume.classList.contains('off') ? btnMusicVolume.textContent = 'music OFF' : btnMusicVolume.textContent = 'music ON';
};

const toggleSounds = (): void => {
  const btnSoundsVolume = document.querySelector('.btn-sounds') as HTMLButtonElement;
  btnSoundsVolume.classList.toggle('off');
  btnSoundsVolume.classList.contains('off') ? btnSoundsVolume.textContent = 'sound OFF' : btnSoundsVolume.textContent = 'sound ON';
};

const createHeader = (): HTMLDivElement => {
  const header = createElement('header', 'header') as HTMLDivElement;
  const settings = createImage(
    'settings',
    '../assets/img/settings.png',
    'settings',
  );

  header.append(createBtnsHeaderContainer(), settings);
  return header;
};

const createBtnsHeaderContainer = () => {
    const container = createElement('div', 'btns-container');
    const btnLang = createButton('btn-lang', 'button', 'en');
    btnLang.onclick = () => {
        changeLanguage();
    };

    const btnMusicVolume = createButton('btn-music', 'button', 'music ON');
    btnMusicVolume.onclick = () => {
        toggleMusic();
    };

    const btnSoundsVolume = createButton('btn-sounds', 'button', 'sound ON');
    btnSoundsVolume.onclick = () => {
        toggleSounds();
    };

    container.append(btnLang, btnMusicVolume, btnSoundsVolume);
    return container;
  };

  