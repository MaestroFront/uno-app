import { createElement, createButton } from '../helpers/helpers';

export const createExitWindow = () => {
  const main = document.querySelector('.main') as HTMLDivElement;
  const container = createElement('div', 'exit-container') as HTMLDivElement;
  const question = createElement('h2', 'question') as HTMLHeadElement;
  question.textContent = 'Вы хотите покинуть игру?\nДанные будут утеряны';
  const btnContainer = createElement('div', 'exit-btns-container') as HTMLDivElement;
  const btnYes = createButton('btn-yes', 'button', 'yes');
  const btnNo = createButton('btn-no', 'button', 'no');

  btnContainer.append(btnYes, btnNo);
  container.append(question, btnContainer);

  main.append(container);
};
