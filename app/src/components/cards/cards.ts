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
  svg.id = cardSymbol;
  svg.append(renderSmallSymbol(cardSymbol, '30', '84', '360'));
  svg.append(renderSmallSymbol(cardSymbol, '-248', '-386', '-180'));
  svg.append(renderCentralSymbolNumber(cardSymbol, color));
  
  return svg;
};
  



window.addEventListener('DOMContentLoaded', () => {
  body.append(renderCardWithNumber('300', '520', '2', redColor));
});