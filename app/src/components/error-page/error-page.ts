import { createButton, createElement, createImage } from '../helpers/helpers';

export const createErrorPage = () => {
  const body = document.querySelector('.body') as HTMLBodyElement;
  const image = createImage('error-404', '../../assets/img/error.gif', 'error 404');
  const btnErrorContainer = createElement('div', 'error-btn-container') as HTMLDivElement;
  const button = createButton('btn-main-page', 'button', 'main page');
  btnErrorContainer.append(button);
  body.innerHTML = '';
  body.append(image, btnErrorContainer);
  console.log(window.location.href);
};