import { ns, redColor, greenColor, yellowColor, blueColor } from './cards';

//--------------card template
export const renderCardTemplate = (
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
export const renderSmallSymbol = (cardSymbol: string, x1: string, y1: string, deg: string): Element => {
  const g = document.createElementNS(ns, 'g');
  g.innerHTML = `
      <text x=${x1} y=${y1} style="transform: rotate(${deg}deg)" font-family="Arial" font-size="55" font-style="italic" font-weight="bold" fill="white">${cardSymbol}</text>
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
    
export const renderRectangle = (recId: string, x: string, y: string): Element => {
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