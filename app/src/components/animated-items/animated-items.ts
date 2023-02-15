
//------------------------get random color

import { blueColor, greenColor, redColor, yellowColor } from '../cards/cards';
import { createElement, getRandomInt } from '../helpers/helpers';

export const renderDiamond = (): HTMLDivElement => {
  const diamond = createElement('div', 'diamond-container') as HTMLDivElement;
  const diamonds = createElement('div', 'diamonds');
  const ids = ['red-diamond', 'yellow-diamond', 'blue-diamond', 'green-diamond'];

  for (let i = 0; i < 4; i++) {
    const coloredDiamond = createElement('div', 'diamond');
    const cover = createElement('div', 'cover');
    coloredDiamond.id = ids[i];
    coloredDiamond.append(cover);
    diamonds.append(coloredDiamond);
  }
  diamond.append(diamonds);
  return diamond;
};

export const getColorAnimation = () => {
  const colors = [blueColor, greenColor, yellowColor, redColor];
  const color = colors[getRandomInt(colors.length)];
  Array.from(document.getElementsByClassName('diamond')).forEach(el => el.classList.add('shy'));
  
  if ((document.getElementById('red-diamond') as HTMLDivElement).classList.contains('shy')) {
    setTimeout(() => {
      Array.from(document.getElementsByClassName('diamond')).forEach((el) => {
        (el as HTMLDivElement).style.backgroundColor = color;
        (el as HTMLDivElement).style.boxShadow = 'none';
      });
      Array.from(document.getElementsByClassName('diamond')).forEach(el => el.classList.remove('shy'));
    }, 4000);

    setTimeout(() => {
      (document.querySelector('.diamond-container') as HTMLDivElement).classList.remove('show');
    }, 6000);

    setTimeout(() => {
      (document.getElementById('red-diamond') as HTMLDivElement).style.backgroundColor = '#eca4a4';
      (document.getElementById('red-diamond') as HTMLDivElement).style.boxShadow = 'inset 1px 1px 22px 16px rgb(194 17 32)';
      (document.getElementById('blue-diamond') as HTMLDivElement).style.backgroundColor = '#a4a7ec';
      (document.getElementById('blue-diamond') as HTMLDivElement).style.boxShadow = 'inset 1px 1px 22px 16px darkblue';
      (document.getElementById('yellow-diamond') as HTMLDivElement).style.backgroundColor = '#ecd2a4';
      (document.getElementById('yellow-diamond') as HTMLDivElement).style.boxShadow = 'inset 1px 1px 22px 16px #FFC300';
      (document.getElementById('green-diamond') as HTMLDivElement).style.backgroundColor = '#a4eca7';
      (document.getElementById('green-diamond') as HTMLDivElement).style.boxShadow = 'inset 1px 1px 22px 16px #258f37';
    }, 6500);
  }
};

export const showRandomColor = () => {
  (document.querySelector('.diamond-container') as HTMLDivElement).classList.add('show');
  getColorAnimation();
};