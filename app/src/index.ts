import './style.scss';
import Controller from './controller';

import './components/cards/cards';
import './components/rules-page/rules-page';
import './components/header/header';
import './components/table-results/table-results';
import './components/choice-settings/choice';

import { createPage } from './components/helpers/helpers';

window.onload = () => {
  createPage();
  Controller.start();
};
