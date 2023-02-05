import './style.scss';
import Controller from './controller';
import './main-page/main-page';
import { createElement } from './helpers/helpers';
import { createHeader, createMainPage } from './main-page/main-page';
import { createDevelopedByContainer } from './developed-by/developed-by';

const body = document.querySelector('.body') as HTMLDivElement;
const header = createElement('header', 'header') as HTMLDivElement;
const main = createElement('main', 'main') as HTMLDivElement;
const footer = createElement('footer', 'footer') as HTMLDivElement;
body.append(header, main, footer, createDevelopedByContainer());
createHeader();
createMainPage();

console.log('hello');
Controller.start();
//alert('fsfds');
console.log(
  'dfffffffffffffffffffffff fsdfffffffffffffffffffffffffffffsdf sdfdsfdfs fsssssssssssssssssssfsfs sfdfsdfsdfdsf',
);
