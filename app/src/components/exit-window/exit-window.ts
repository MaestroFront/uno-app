import { langData } from '../data';
import { createElement, createButton } from '../helpers/helpers';

export const createExitWindow = (lang: string) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  const container = createElement('div', 'exit-container') as HTMLDivElement;
  const question = createElement('h2', 'question') as HTMLHeadElement;
  question.textContent = langData[lang]['leave-message'];
  const btnContainer = createElement('div', 'exit-btns-container') as HTMLDivElement;
  const btnYes = createButton('btn-yes', 'button', langData[lang]['leave-yes']);
  const btnNo = createButton('btn-no', 'button', langData[lang]['leave-no']);

  btnContainer.append(btnYes, btnNo);
  container.append(question, btnContainer);

  main.append(container);
};
