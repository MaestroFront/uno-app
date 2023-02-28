import { langData } from '../data';
import { createButtonResults } from '../header/header';
import { createElement, createSpan, addButtonBackToMainPage, createButton } from '../helpers/helpers';
import { language } from '../local-storage';

const createResultsListTitle = (lang: string) => {
  const item = createElement('li', 'results-item') as HTMLLIElement;
  item.classList.add('results-title');
  const name = createSpan('result-player-name', langData[lang]['res-name']);
  const points = createSpan('player-points', langData[lang]['res-points']);
  item.append(name, points);
  
  return item;
};

export const createPlayerResult = (nickname: string, points: number) => {
  const player = createElement('li', 'results-item') as HTMLLIElement;
  const name = createSpan('result-player-name', nickname);
  const pointsQuantity = createSpan('player-points', `${points}`);
  player.append(name, pointsQuantity);
  return player;
};

const createResultsTable = (lang: string) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  const container = createElement('div', 'results-container') as HTMLDivElement;
  const list = createElement('ul', 'results-list') as HTMLUListElement;
  list.append(createResultsListTitle(lang));
  const cross = createButton('btn-cross', 'burron', 'x');

  container.append(list, cross);
  main.append(container);
};

document.addEventListener('click', (e) => {
  const element = e.target as HTMLButtonElement;
  if (element.closest('.btn-results')) {
    element.remove();
    (document.querySelector('.opacity') as HTMLDivElement).classList.add(
      'show',
    );
    if (!document.querySelector('.btn-main-page')) addButtonBackToMainPage(language.chosen);
    createResultsTable(language.chosen);
  }
  if (element.closest('.results-container .btn-cross')) {
    (document.querySelector('.opacity') as HTMLDivElement).classList.remove(
      'show',
    );
    document.querySelector('.results-container')?.remove();
    createButtonResults(language.chosen);
  }
});
