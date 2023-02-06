import { createDevelopedByContainer } from '../developed-by/developed-by';
import { createHeader } from '../header/header';
import { createMainPage } from '../main-page/main-page';
import { createFooter } from '../footer/footer';

export const createElement = (tagName: string, className: string) => {
  const element = document.createElement(tagName);
  element.classList.add(className);
  return element;
};

export const createPage = () => {
  const body = document.querySelector('.body') as HTMLDivElement;
  const header = createElement('header', 'header') as HTMLDivElement;
  const main = createElement('main', 'main') as HTMLDivElement;
  const footer = createElement('footer', 'footer') as HTMLDivElement;
  body.append(header, main, footer, createDevelopedByContainer());
  createHeader();
  createMainPage();
  createFooter();
};

export const createImage = (className: string, src: string, alt: string) => {
  const element = document.createElement('img');
  element.classList.add('img');
  element.classList.add(className);
  element.src = src;
  element.alt = alt;
  return element;
};

export const createButton = (
  className: string,
  type: string,
  buttonText: string,
) => {
  const element = document.createElement('button');
  element.classList.add('button');
  element.classList.add(className);
  element.type = type;
  element.textContent = buttonText;
  return element;
};

export const createLink = (className: string, href: string, title: string) => {
  const element = document.createElement('a');
  element.classList.add('link');
  element.classList.add(className);
  element.href = href;
  element.dataset.title = title;
  element.target = '_blank';
  return element;
};

export const createParagraph = (className: string, text: string) => {
  const element = document.createElement('p');
  element.classList.add(className);
  element.textContent = text;
  return element;
};
