import { ns, redColor, greenColor, yellowColor, blueColor } from './cards';

//--------------card template
export const renderCardTemplate = (
  color: string,
  currScale: number,
): HTMLElement => {
  const svg = document.createElementNS(ns, 'svg') as HTMLElement;
  svg.setAttributeNS(null, 'width', `${300 * currScale}`);
  svg.setAttributeNS(null, 'height', `${520 * currScale}`);
  svg.setAttributeNS(null, 'fill', color);
  svg.innerHTML = `
      <symbol class="cardCenter" id="mySymbol" viewBox="0 0 ${300 * currScale} ${520 * currScale}" stroke="white" stroke-width="${11 * currScale}">
            <rect class="mainCard cardCenter" x="${15 * currScale}" y="${25 * currScale}" rx="${10 * currScale}" ry="${15 * currScale}" width="${250 * currScale}" height="${420 * currScale}"/>
            <ellipse class="cardCenter" cx="${230 * currScale}" cy="${160 * currScale}" rx="${105 * currScale}" ry="${183 * currScale}"
      style="fill:white;stroke:white;stroke-width:${3 * currScale};transform: rotate(25deg);"/>
          </symbol>  
         
        <use xlink:href="#mySymbol" class="cardCenter"></use>
    `;
  return svg;
};
  
//---------------small symbols om the top and bottom
export const renderSmallSymbol = (cardSymbol: string, x1: number, y1: number, deg: string, currScale: number): Element => {
  const g = document.createElementNS(ns, 'g');
  g.innerHTML = `
      <text class="cardCenter" x=${x1 * currScale} y=${y1 * currScale} style="transform: rotate(${deg}deg)" font-family="Arial" font-size="${55 * currScale}" font-style="italic" font-weight="bold" fill="white">${cardSymbol}</text>
      `;
  return g;
};
  
//-----------------------------rectangle and its gradient
export const renderGradient = (
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
    
export const renderRectangle = (recId: string, x: number, y: number, currScale: number): Element => {
  const rect = document.createElementNS(ns, 'rect');
  rect.setAttribute('x', `${x * currScale}`);
  rect.setAttribute('y', `${y * currScale}`);
  rect.setAttribute('rx', `${5 * currScale}`);
  rect.setAttribute('ry', `${5 * currScale}`);
  rect.setAttribute('width', `${65 * currScale}`);
  rect.setAttribute('height', `${100 * currScale}`);
  rect.setAttribute('fill', `url(#${recId})`);
  rect.setAttribute('stroke', 'white');
  rect.setAttribute('stroke-width', `${4 * currScale}`);
  rect.classList.add('cardCenter');
    
  return rect;
};  
  
//------------------helpers
export const setClassName = (color: string) => {
  let className = '';
  switch (color) {
    case greenColor: className = 'green'; break;
    case redColor: className = 'red'; break;
    case yellowColor: className = 'yellow'; break;
    case blueColor: className = 'blue'; break;
  }  
  return className;
};
  
export const checkColorForGradient = (color: string) => {
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