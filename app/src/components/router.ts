import { createPage } from './helpers/helpers';
import { openRulesPage } from './rules-page/rules-page';
import { showChoiceContainer } from './main-page/main-page';
class Router {
  static url: URL;

  constructor() {
    Router.url = new URL(window.location.href);
    if (Router.url.searchParams.toString() === '') Router.setState('home');
    if (Router.url.searchParams.toString() === 'rules') Router.setState('rules');
    if (Router.url.searchParams.toString() === 'single-player') Router.setState('single-player');
    Router.checkPage();
  }

  static setState(state: string) {
    Router.url.searchParams.set(state, '');
    window.history.pushState(state, '', Router.url.searchParams.toString().concat(Router.url.hash));
  }

  static checkPage() {
    switch (window.history.state) {
      case 'home' || '': {
        createPage();
        break;
      }
      case 'rules': {
        createPage();
        openRulesPage();
        break;
      }
      case 'single-player': {
        createPage();
        showChoiceContainer();
        break;
      }
      case 'multiplayer': {
        break;
      }
    }
  }
}

export default Router;
