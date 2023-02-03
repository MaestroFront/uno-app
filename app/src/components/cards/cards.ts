import './cards.scss';

const body = document.querySelector('body') as HTMLBodyElement;
const ns = 'http://www.w3.org/2000/svg' as string;
const redColor = '#c01e1e' as string;
const blueColor = 'darkblue' as string;
const greenColor = '#258f37' as string;
const yellowColor = '#FFC300' as string;

//--------------card template
const renderCardTemplate = (
  width: string,
  height: string,
  color: string,
): HTMLElement => {
  const svg = document.createElementNS(ns, 'svg') as HTMLElement;

  svg.setAttributeNS(null, 'width', width);
  svg.setAttributeNS(null, 'height', height);
  svg.setAttributeNS(null, 'fill', color);
  svg.innerHTML = `
    <symbol id="mySymbol" viewBox="0 0 300 520" stroke="white" stroke-width="11">
          <rect class="mainCard" x="15" y="25" rx="10" ry="15" width="250" height="420"/>
          <ellipse cx="230" cy="160" rx="105" ry="183"
    style="fill:white;stroke:white;stroke-width:3;transform: rotate(25deg);"/>
        </symbol>  
       
      <use xlink:href="#mySymbol"></use>
  `;
  return svg;
};



//---------------small symbols om the top and bottom
const renderSmallSymbol = (cardSymbol: string, x1: string, y1: string, deg: string): Element => {
  const g = document.createElementNS(ns, 'g');
  g.innerHTML = `
    <text x=${x1} y=${y1} style="transform: rotate(${deg}deg)" font-family="Arial" font-size="55" font-style="italic" font-weight="bold" fill="white">${cardSymbol}</text>
    `;
  return g;
};

//-----------------------------rectangle and its gradient
const renderGradient = (
  recId: string,
  stopColor1: string,
  stopColor2: string,
  stopColor3: string,
): Element => {
  const gradient = document.createElementNS(ns, 'linearGradient');
  gradient.id = recId;
  gradient.setAttribute('x1', '0');
  gradient.setAttribute('x2', '0');
  gradient.setAttribute('y1', '0');
  gradient.setAttribute('y2', '1');
  gradient.innerHTML = `
    <stop offset="0%" stop-color=${stopColor1}></stop>
    <stop offset="55%" stop-color=${stopColor2}></stop>
    <stop offset="100%" stop-color=${stopColor3}></stop>
`;
  return gradient;
};

  
const renderRectangle = (recId: string, x: string, y: string): Element => {
  const rect = document.createElementNS(ns, 'rect');
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('rx', '5');
  rect.setAttribute('ry', '5');
  rect.setAttribute('width', '65');
  rect.setAttribute('height', '100');
  rect.setAttribute('fill', `url(#${recId})`);
  rect.setAttribute('stroke', 'white');
  rect.setAttribute('stroke-width', '4');
  
  return rect;
};  

//------------------helpers
const setClassName = (color: string) => {
  let className = '';
  switch (color) {
    case greenColor: className = 'green'; break;
    case redColor: className = 'red'; break;
    case yellowColor: className = 'yellow'; break;
    case blueColor: className = 'blue'; break;
  }  
  return className;
};

const checkColorForGradient = (color: string) => {
  const gradientColors = { //описать интерфейс
    colorTop: '',
    colorMiddle: '',
  };
    
  switch (color) {
    case greenColor: { gradientColors.colorTop = 'lightgreen'; gradientColors.colorMiddle = 'green'; break;}
    case redColor: {gradientColors.colorTop = 'red'; gradientColors.colorMiddle = 'red'; break;}
    case yellowColor: {gradientColors.colorTop = 'yellow'; gradientColors.colorMiddle = 'yellow'; break;}
    case blueColor: {gradientColors.colorTop = 'lightblue'; gradientColors.colorMiddle = 'blue'; break;}
  }
  return gradientColors;
};

//--------------------CARD with number
const renderCentralSymbolNumber = (cardSymbol: string, color: string) => {
  const g = document.createElementNS(ns, 'g');
  g.innerHTML = `
      <text x="80" y="315" font-family="Arial" font-size="208" font-style="italic" font-weight="bold" fill=${color}>${cardSymbol}</text>
      `;
  return g;
};

const renderCardWithNumber = (
  width: string,
  height: string,
  cardSymbol: string,
  color: string,
): HTMLElement => {
  const svg = renderCardTemplate(width, height, color);
  svg.classList.add('numberedCard', setClassName(color));
  //   svg.id = cardSymbol;
  svg.append(renderSmallSymbol(cardSymbol, '30', '84', '360'));
  svg.append(renderSmallSymbol(cardSymbol, '-248', '-386', '-180'));
  svg.append(renderCentralSymbolNumber(cardSymbol, color));
  
  return svg;
};
  
//--------------------reverse card
const renderCentralSymbolReverse = (color: string): Element => {
  const g = document.createElementNS(ns, 'g');
  const pathPart1 = document.createElementNS(ns, 'path');
  const pathPart2 = document.createElementNS(ns, 'path');
  pathPart1.setAttribute(
    'd',
    'm147.28903,142.78959l13.92774,13.54236l-55.71097,54.16946c-13.92774,13.54236 -13.92774,40.62709 0,54.16946l27.85549,-27.08474l55.71097,-54.16946l13.92774,13.54236l0,-54.16946l-55.71097,0l0.00001,0.00001l0,0.00001l-0.00001,0z');
  pathPart2.setAttribute(
    'd',
    'm147.28903,319.73153l-14.07225,-13.2734l56.28903,-53.09361c14.07225,-13.2734 14.07225,-39.8202 0,-53.09361l-28.14451,26.5468l-56.28903,53.09361l-14.07225,-13.2734l0,53.09361l56.28903,0l-0.00001,0l-0.00001,0z');
  pathPart1.setAttribute('style', `fill:${color}`);
  pathPart2.setAttribute('style', `fill:${color}`);
  g.append(pathPart1, pathPart2);
  return g;
};

const renderReverseCard = (width: string, height: string, color: string) => {
  const svg = renderCardTemplate(width, height, color);
  svg.classList.add('reverseCard', setClassName(color));
  //   svg.id = 'reverse';
  const topReverseSymbol1 = document.createElementNS(ns, 'path');
  const topReverseSymbol2 = document.createElementNS(ns, 'path');
  const bottomReverseSymbol1 = document.createElementNS(ns, 'path');
  const bottomReverseSymbol2 = document.createElementNS(ns, 'path');
  topReverseSymbol1.setAttribute(
    'd',
    'm54.57997,38.12738l3.855,3.74833l-15.41999,14.99333c-3.855,3.74833 -3.855,11.24499 0,14.99333l7.71,-7.49666l15.41999,-14.99333l3.855,3.74833l0,-14.99333l-15.41999,0l0,0l0,0l-0.00001,0z'
  );
  topReverseSymbol2.setAttribute(
    'd',
    'm54.57997,87.10236l-3.895,-3.67389l15.57999,-14.69555c3.895,-3.67389 3.895,-11.02166 0,-14.69555l-7.79,7.34777l-15.57999,14.69555l-3.895,-3.67389l0,14.69555l15.57999,0l0,0l0.00001,0.00001z'
  );
  bottomReverseSymbol1.setAttribute(
    'd',
    'm225.28001,379.91252l3.855,3.74833l-15.42,14.99333c-3.855,3.74832 -3.855,11.24499 0,14.99332l7.71,-7.49666l15.41999,-14.99333l3.855,3.74833l0,-14.99333l-15.41999,0l0,0.00001l0,0z'
  );
  bottomReverseSymbol2.setAttribute(
    'd',
    'm225.28001,428.8875l-3.895,-3.67389l15.57999,-14.69554c3.895,-3.67389 3.895,-11.02166 0,-14.69555l-7.78999,7.34777l-15.57999,14.69555l-3.895,-3.67389l0,14.69555l15.57999,0l0,0z'
  );
  topReverseSymbol1.setAttribute('style', 'fill:white');
  bottomReverseSymbol1.setAttribute('style', 'fill:white');
  topReverseSymbol2.setAttribute('style', 'fill:white');
  bottomReverseSymbol2.setAttribute('style', 'fill:white');
  svg.append(topReverseSymbol1, topReverseSymbol2, bottomReverseSymbol1, bottomReverseSymbol2);
  svg.append(renderCentralSymbolReverse(color));
  
  return svg;
};
  
//--------------------blocked card
const renderCentralSymbolBlock = (color: string): Element => {
  const g = document.createElementNS(ns, 'g');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute(
    'd',
    'm145.17068,151.36242c-20.98242,-0.02733 -42.04457,7.92497 -58.0745,23.91302c-32.05986,31.97634 -32.14693,83.91833 -0.17054,115.97819c31.97634,32.05986 83.91833,32.14693 115.97819,0.17054c32.05986,-31.97634 32.14693,-83.91833 0.17054,-115.97819c-15.98817,-16.02993 -36.92129,-24.05644 -57.90369,-24.08384l0,0.00028zm-0.17054,27.32918c9.56455,0.01093 19.17263,2.51478 27.67079,7.51552l-74.81362,74.81362c-12.35469,-20.97684 -9.49312,-48.45737 8.54037,-66.44406c10.68663,-10.65877 24.61419,-15.90329 38.60245,-15.88508l0.00001,0zm47.14283,26.81675c12.44008,20.99279 9.52908,48.59236 -8.54037,66.61486c-18.05202,18.00496 -45.49154,20.65146 -66.44406,8.19876l74.98443,-74.81362z'
  );
  path.setAttribute('style', `fill:${color}`);
  g.append(path);
  return g;
};

const renderBlockedCard = (width: string, height: string, color: string): HTMLElement => {
  const svg = renderCardTemplate(width, height, color);
  svg.classList.add('blockedCard', setClassName(color));
  //svg.id = 'blocked';
  const topBlockSymbol = document.createElementNS(ns, 'path');
  const bottomBlockSymbol = document.createElementNS(ns, 'path');
  topBlockSymbol.setAttribute(
    'd',
    'm54.54684,41.36221c-5.75789,-0.0075 -11.53766,2.17473 -15.93651,6.56209c-8.79771,8.77479 -8.8216,23.02844 -0.0468,31.82615c8.77479,8.79771 23.02844,8.8216 31.82615,0.0468c8.79771,-8.77479 8.8216,-23.02844 0.0468,-31.82615c-4.38739,-4.39885 -10.13175,-6.60145 -15.88964,-6.60897l0,0.00008zm-0.0468,7.49954c2.62466,0.003 5.26126,0.69009 7.59328,2.06237l-20.52998,20.52998c-3.39031,-5.75636 -2.60505,-13.29743 2.34361,-18.23324c2.93257,-2.92493 6.7545,-4.3641 10.59309,-4.3591l0,0l0,-0.00001zm12.9367,7.35892c3.41374,5.76074 2.61492,13.33447 -2.34361,18.28011c-4.95374,4.94083 -12.48356,5.66707 -18.23324,2.24986l20.57685,-20.52998l0,0.00001z'
  );
  bottomBlockSymbol.setAttribute(
    'd',
    'm225.04681,382.89932c-5.75789,-0.0075 -11.53766,2.17473 -15.93651,6.56209c-8.7977,8.77479 -8.8216,23.02845 -0.0468,31.82615c8.77479,8.79771 23.02845,8.8216 31.82615,0.0468c8.79771,-8.77478 8.8216,-23.02844 0.0468,-31.82615c-4.38739,-4.39885 -10.13175,-6.60144 -15.88964,-6.60896l0,0.00007zm-0.0468,7.49954c2.62466,0.003 5.26126,0.69009 7.59328,2.06237l-20.52997,20.52998c-3.39032,-5.75636 -2.60506,-13.29743 2.3436,-18.23325c2.93257,-2.92492 6.7545,-4.3641 10.59309,-4.3591l0,0zm12.9367,7.35892c3.41375,5.76073 2.61492,13.33447 -2.3436,18.28011c-4.95375,4.94083 -12.48356,5.66707 -18.23325,2.24986l20.57685,-20.52997z'
  );
  topBlockSymbol.setAttribute('style', 'fill:white');
  bottomBlockSymbol.setAttribute('style', 'fill:white');
  svg.append(topBlockSymbol, bottomBlockSymbol);
  svg.append(renderCentralSymbolBlock(color));
  
  return svg;
};
  
//--------------------------card Plus 2
const renderCentralSymbolPlusTwo = (color: string): Element => {
  const { colorTop, colorMiddle } = checkColorForGradient(color);
  const g = document.createElementNS(ns, 'g');
  g.append(
    renderGradient(`${color}Card1`, colorTop, colorMiddle, color),
    renderRectangle(`${color}Card1`, '85', '230'),
    renderGradient(`${color}Card2`, colorTop, colorMiddle, color),
    renderRectangle(`${color}Card2`, '130', '170'),
  );
  return g;
};

const renderPlusTwoCard = (width: string, height: string, color: string): HTMLElement => {
  const svg = renderCardTemplate(width, height, color);
  svg.classList.add('plusTwoCard', setClassName(color));
  svg.id = 'plusTwo';
  svg.append(renderSmallSymbol('+2', '30', '84', '360'));
  svg.append(renderSmallSymbol('+2', '-248', '-386', '-180'));
  svg.append(renderCentralSymbolPlusTwo(color));
  
  return svg;
};
  
  
  
  
  
    
  




//-------------------------------Listeners
window.addEventListener('DOMContentLoaded', () => {
  body.append(renderCardWithNumber('300', '520', '2', redColor));
  body.append(renderReverseCard('300', '520', blueColor));
  body.append(renderBlockedCard('300', '520', yellowColor));
  body.append(renderPlusTwoCard('300', '520', greenColor));
});