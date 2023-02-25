import { langData } from '../data';
import { createElement, createParagraph } from '../helpers/helpers';


export const renderWinBlock = (lang: string, player = 'Player-1', points = 100) => {
  const container = createElement('div', 'win-container') as HTMLDivElement;
  for (let i = 1; i < 5; i++) {
    const firework = createElement('div', 'firework') as HTMLDivElement;
    firework.classList.add(`firework-${i}`);
    for (let j = 0; j < 6; j++) {
      const bar = createElement('div', 'bar') as HTMLDivElement;
      firework.append(bar);
    }
    container.append(firework);
  }

  const message = createElement('div', 'message-container') as HTMLDivElement;
  const title = createParagraph('win-title', langData[lang]['win-title']);
  const winner = createParagraph('win-winner', `${player} ${langData[lang]['win-winner']}`);
  const score = createParagraph('win-score', `${langData[lang]['win-score-text']} ${points} ${langData[lang]['win-score']}`);

  message.append(title, winner, score);
  container.append(message);

  return container;
};

export const showWinnerMessage = (lang: string, player = 'Player-1', points = 100) => {
  (document.querySelector('main') as HTMLDivElement).append(renderWinBlock(lang, player, points));
  Array.from((document.querySelectorAll('.firework'))).forEach(el => el.classList.add('show'));
  (document.querySelector('.win-container') as HTMLDivElement).classList.add('show');
  setTimeout(() => {
    Array.from((document.querySelectorAll('.firework'))).forEach(el => el.classList.remove('show'));
    (document.querySelector('.win-container') as HTMLDivElement).classList.remove('show');
  }, 4000);
};

// (document.querySelector('body') as HTMLBodyElement).addEventListener('click', () => {
//   showWinnerMessage('en');
// });