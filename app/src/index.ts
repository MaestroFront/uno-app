import './style.scss';
import Controller from './controller';
import './components/cards/cards';
import './components/rules-page/rules-page';
import './components/header/header';
import './components/table-results/table-results';
import './components/choice-settings/choice';
import './components/local-storage';
import './components/chat/chat';
import './components/animated-items/animated-items';
import './components/winner-message/winner-message';
import Router from './components/router';
import { moveCardToPlayers, showDistributionCardsForPlayers } from './components/game-field/game-field';
export const imgLogo = new Image();
imgLogo.src = './assets/img/UNO_Logo.svg';
imgLogo.className = 'logo';
imgLogo.alt = 'logo';
export function createLoader() {
  const div = document.createElement('div');
  div.className = 'loader';
  div.innerHTML = `
    <div class="yellow-circle"></div>
    <div class="red-circle"></div>
    <div class="blue-circle"></div>
    <div class="green-circle"></div>`;
  document.body.append(div);
}
if (history.state !== '404' || history.state !== null) {
  createLoader();
}
void Controller.start(9001).then().catch();

window.onload = () => {
  Router.initialize();
  const loader = document.querySelector('.loader') as HTMLDivElement;
  if (loader || history.state === '404' || history.state === null) {
    loader.style.display = 'none';
  }
};

if (!localStorage.getItem('reverse')) {
  localStorage.setItem('reverse', 'true');
}

document.addEventListener('click', (e) => {
  const element = e.target as HTMLElement;
  if (element.closest('.player-1 .simple-card .plusFourCard')) {
    showDistributionCardsForPlayers(1, false, false, true);
    moveCardToPlayers(false, true, false, localStorage.getItem('reverse') as string);
  } else if (element.closest('.player-1 .simple-card .plusTwoCard')) {
    showDistributionCardsForPlayers(1, false, true, false);
    moveCardToPlayers(false, false, true, localStorage.getItem('reverse') as string);
  }
});
