import { createElement, createButton, createImage } from '../helpers/helpers';
import { createChoiceContainer } from '../choice-quantity-players/choice';
import { createGameField } from '../game-field/game-field';
import { createRulesPage } from '../rules-page/rules-page';

// export const createHeader = () => {
//   const header = document.querySelector('.header') as HTMLDivElement;
//   const container = createElement('div', 'btns-container');
//   const btnLang = createButton('btn-lang', 'button', 'en');
//   btnLang.onclick = () => {
//     if (btnLang.classList.contains('off')) {
//       btnLang.classList.remove('off');
//       btnLang.textContent = 'en';
//     } else {
//       btnLang.classList.add('off');
//       btnLang.textContent = 'ru';
//     }
//   };
//   const btnMusicVolume = createButton('btn-music', 'button', 'music ON');
//   btnMusicVolume.onclick = () => {
//     btnMusicVolume.classList.toggle('off');
//     if (btnMusicVolume.classList.contains('off')) {
//       btnMusicVolume.textContent = 'music OFF';
//     } else {
//       btnMusicVolume.textContent = 'music ON';
//     }
//   };
//   const btnSoundsVolume = createButton('btn-sounds', 'button', 'sound ON');
//   btnSoundsVolume.onclick = () => {
//     btnSoundsVolume.classList.toggle('off');
//     if (btnSoundsVolume.classList.contains('off')) {
//       btnSoundsVolume.textContent = 'sound OFF';
//     } else {
//       btnSoundsVolume.textContent = 'sound ON';
//     }
//   };
//   const btnDevelopedBy = createButton(
//     'btn-developed',
//     'button',
//     'developed by',
//   );
//   const btnShare = createButton('btn-share', 'button', 'share');
//   btnShare.onclick = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: 'Игра UNO',
//         text: 'Тебе давно уже пора заняться чем-то по истинне крутым.',
//         url: window.location.href,
//       })
//         .then(() => console.log('Удалось поделиться'))
//         .catch((error) => console.log('Не удалось поделиться', error));
//     }
//   };
//   const settings = createImage(
//     'settings',
//     '../assets/img/settings.png',
//     'settings',
//   );
//   container.append(btnLang, btnDevelopedBy, btnMusicVolume, btnSoundsVolume, btnShare);
//   header.append(container, settings);
//   return header;
// };

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

const hideDevelopedByBlock = () => {
  (document.querySelector('.opacity') as HTMLDivElement).classList.remove(
    'show',
  );
  (document.querySelector('.developed-by') as HTMLDivElement).classList.remove(
    'show',
  );
};

const showSettings = (element: HTMLButtonElement) => {
  element.style.transform = 'scale(0)';
  (
    document.querySelector('.header .btns-container') as HTMLDivElement
  ).classList.add('show');
};

const hideSettings = (element: HTMLButtonElement) => {
  (
    document.querySelector('.header .btns-container') as HTMLDivElement
  ).classList.remove('show');
  element.style.transform = 'scale(1)';
};

const removeChoiceContainer = () => {
  const choiceContainer = document.querySelector('.choice-container');
  choiceContainer?.remove();
  (document.querySelector('.opacity') as HTMLDivElement).classList.remove(
    'show',
  );
};

const fillGameField = (quantity: number) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  (document.querySelector('.opacity') as HTMLDivElement).classList.remove(
    'show',
  );
  main.innerHTML = '';
  createGameField(quantity);
};

const addButtonBackToMainPage = () => {
  const btn = createButton('btn-main-page', 'button', 'main page');
  const header = document.querySelector('header') as HTMLDivElement;
  header.append(btn);
};

document.addEventListener('click', (e) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  const element = e.target as HTMLButtonElement;
  if (element.closest('.btn-developed')) showDevelopedByBlock();
  if (element.closest('.developed-by .btn-cross')) hideDevelopedByBlock();
  if (element.closest('.settings')) {
    showSettings(element);
    setTimeout(() => hideSettings(element), 5000);
  }
  if (element.closest('.btn-computer')) {
    (document.querySelector('.opacity') as HTMLDivElement).classList.add(
      'show',
    );
    createChoiceContainer();
  }
  if (element.closest('.choice-container .btn-cross')) removeChoiceContainer();
  if (element.closest('.choice-quantity .two')) {
    addButtonBackToMainPage();
    fillGameField(2);
  }
  if (element.closest('.choice-quantity .three')) {
    addButtonBackToMainPage();
    fillGameField(3);
  }
  if (element.closest('.choice-quantity .four')) {
    addButtonBackToMainPage();
    fillGameField(4);
  }
  if (element.closest('.btn-main-page')) {
    main.innerHTML = '';
    element.remove();
    createMainPage();
  }
  if (element.closest('.btn-rules')) {
    main.innerHTML = '';
    addButtonBackToMainPage();
    createRulesPage();
  }
});
