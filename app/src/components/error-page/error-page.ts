import { createButton, createElement, createImage } from '../helpers/helpers';
import Router from '../router';

export const createErrorPage = () => {
  const body = document.querySelector('.body') as HTMLBodyElement;
  body.innerHTML = '';
  const image = createImage('error-404', '../../assets/img/error.gif', 'error 404');
  const btnErrorContainer = createElement('div', 'error-btn-container') as HTMLDivElement;
  const button = createButton('btn-main-page', 'button', 'main page');
  button.onclick = () => {
    Router.setState('home');
    Router.checkPage();
  };
  btnErrorContainer.append(button);
  body.append(image, btnErrorContainer);
};
