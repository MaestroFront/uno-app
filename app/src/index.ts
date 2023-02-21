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
import Router from './components/router';
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
