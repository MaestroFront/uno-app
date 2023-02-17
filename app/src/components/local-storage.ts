import { langData } from './data';

export const setBtnText = (el: HTMLButtonElement, name: string, defaultName: string): void => {
  if (localStorage.getItem(name)) {
    el.textContent = localStorage.getItem(name);
  } else {
    el.textContent = defaultName;
    localStorage.setItem(name, el.textContent);
  }
};

export const language = {
  chosen: 'en',
};

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('language')) {
    language.chosen = localStorage.getItem('language') as string;
  } else language.chosen = 'en';
});

export const setSoundBtnSettings = () => {
  const musicBtn = document.querySelector('.btn-music') as HTMLButtonElement;
  if (musicBtn.textContent?.includes('ВКЛ') || musicBtn.textContent?.includes('ON')) {
    musicBtn.textContent = langData[language.chosen]['btn-music-on'];
  } else {
    musicBtn.textContent = langData[language.chosen]['btn-music-off'] ;
  }
  localStorage.setItem('music', musicBtn.textContent);

  const soundBtn = document.querySelector('.btn-sounds') as HTMLButtonElement;
  if (soundBtn.textContent?.includes('ВКЛ') || soundBtn.textContent?.includes('ON')) {
    soundBtn.textContent = langData[language.chosen]['btn-sound-on'];
  } else {
    soundBtn.textContent = langData[language.chosen]['btn-sound-off'];
  } 
  localStorage.setItem('sounds', soundBtn.textContent);
};