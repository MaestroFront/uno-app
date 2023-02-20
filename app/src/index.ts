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
createLoader();
void Controller.start(9001).then().catch();

window.onload = () => {
  Router.initialize();
  const loader = document.querySelector('.loader') as HTMLDivElement;
  if (loader) {
    loader.style.display = 'none';
  }
};
