import './style.scss';
import Controller from './controller';

import './components/cards/cards';
import './components/rules-page/rules-page';
import './components/header/header';
import './components/table-results/table-results';
import './components/choice-settings/choice';

import Router from './components/router';

const router = new Router();
console.log(router);

window.onload = () => {
  Controller.start(9001);
  Router.checkPage();
};
