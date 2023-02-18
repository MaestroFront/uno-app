
//------------------------get random color

import { blueColor, greenColor, redColor, yellowColor } from '../cards/cards';
import { createElement, createImage, getRandomInt } from '../helpers/helpers';
import { getColorSound, getReverseSound } from '../sounds';

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
    }, 2000);

    setTimeout(() => {
      (document.querySelector('.diamond-container') as HTMLDivElement).classList.remove('show');
    }, 2500);

    setTimeout(() => {
      (document.getElementById('red-diamond') as HTMLDivElement).style.backgroundColor = '#eca4a4';
      (document.getElementById('red-diamond') as HTMLDivElement).style.boxShadow = 'inset 1px 1px 22px 16px rgb(194 17 32)';
      (document.getElementById('blue-diamond') as HTMLDivElement).style.backgroundColor = '#a4a7ec';
      (document.getElementById('blue-diamond') as HTMLDivElement).style.boxShadow = 'inset 1px 1px 22px 16px darkblue';
      (document.getElementById('yellow-diamond') as HTMLDivElement).style.backgroundColor = '#ecd2a4';
      (document.getElementById('yellow-diamond') as HTMLDivElement).style.boxShadow = 'inset 1px 1px 22px 16px #FFC300';
      (document.getElementById('green-diamond') as HTMLDivElement).style.backgroundColor = '#a4eca7';
      (document.getElementById('green-diamond') as HTMLDivElement).style.boxShadow = 'inset 1px 1px 22px 16px #258f37';
    }, 3000);
  }
};

export const showRandomColor = () => {
  (document.querySelector('.diamond-container') as HTMLDivElement).classList.add('show');
  getColorAnimation();
  void getColorSound.play();
};

//------------------------get reverse
export const renderReverseMessage = (): HTMLDivElement => {
  const reverse = createElement('div', 'reverse-container') as HTMLDivElement;
  const reversCW = createImage('reverse-right', '../../assets/img/revers-right.png', 'reverse');
  const reversCCW = createImage('reverse-left', '../../assets/img/revers-left.png', 'reverse');

  reverse.append(reversCW, reversCCW);
  return reverse;
};

const changeDirection = (reverse: boolean) => {
  let direction;
  let turn;
  const clockWise = document.querySelector('.reverse-right') as HTMLImageElement;
  const counterClockWise = document.querySelector('.reverse-left') as HTMLImageElement;

  if (reverse) {
    direction = clockWise; turn = 2;
    clockWise.classList.add('show');
    counterClockWise.classList.remove('show');
  } else {
    direction = counterClockWise; turn = -2;
    counterClockWise.classList.add('show');
    clockWise.classList.remove('show');
  }

  const reverseKeyframes = new KeyframeEffect(
    direction,
    [
      { transform: 'rotate(0deg)' },
      { transform: `rotate(${turn}turn)` },
      { transform: 'scale(1.2)' },
    ],
    { duration: 4000, fill: 'none', iterations: 1 },
  );
  const reverseCardAnimation = new Animation(reverseKeyframes, document.timeline);
  reverseCardAnimation.play();
  void getReverseSound.play();
  setTimeout(() => {
    (document.querySelector('.reverse-container') as HTMLDivElement).classList.remove('show');
  }, 4500);
};

export const showReverseAnimation = (reverse: boolean) => {
  (document.querySelector('.reverse-container') as HTMLDivElement).classList.add('show');
  changeDirection(reverse);
};


//----------------------choose color

export const chooseColorAnimation = (e: Event) => {
  const chosenDiamond = e.target as HTMLDivElement;
  const chosenColor = (chosenDiamond.parentElement as HTMLDivElement).id.replace('-diamond', '');

  setTimeout(() => {
    (document.querySelector('.diamond-container') as HTMLDivElement).classList.remove('choose-color');
  }, 1000);

  return chosenColor;
};

let color = '';
export const chooseColor = () => {
  const diamond = document.querySelector('.diamond-container') as HTMLDivElement;
  diamond.classList.add('choose-color');
  diamond.addEventListener('click', (e: Event) => {
    color = chooseColorAnimation(e);
    console.log('color', color);
  });
};
