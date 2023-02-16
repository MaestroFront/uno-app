import './style.scss';
import Controller from './controller';
import './components/cards/cards';
import './components/rules-page/rules-page';
import './components/header/header';
import './components/table-results/table-results';
import './components/choice-settings/choice';
import './components/local-storage';
import './components/chat/chat';
import Router from './components/router';

window.onload = () => {
  Router.initialize();
  Controller.start(9001);
};
