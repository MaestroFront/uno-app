import { blueColor, greenColor, redColor, yellowColor, renderCardWithNumber, renderMultiCard, renderBlockedCard, renderPlusFourCard, renderPlusTwoCard, renderReverseCard } from '../cards/cards';
import { langData } from '../data';
import { addButtonBackToMainPage, createButton, createElement, createParagraph } from '../helpers/helpers';

const flipCard = (e: Event): void => {
  const element = e.target as HTMLButtonElement;
  const parent = element.parentNode?.parentNode as HTMLDivElement;
  parent.classList.toggle('open');
};

const createCardFront = (currCard: Element, lang: string): HTMLDivElement => {
  const cardFront = createElement('div', 'card-block-front') as HTMLDivElement;
  const cardImgWrapper = createElement('div', 'card-img-wrapper') as HTMLDivElement;
  cardImgWrapper.append(currCard);

  const btnReadMore = createButton('btn-read', 'button', langData[lang]['btn-read']);
  cardFront.append(cardImgWrapper, btnReadMore); 

  btnReadMore.addEventListener('click', (e) => {
    flipCard(e);
  } );

  return cardFront;
};

const createCardBack = (cardTitle: string, cardValue: string, cardText: string, lang: string): HTMLDivElement => {
  const cardBack = createElement('div', 'card-block-back') as HTMLDivElement;
  
  const btnFlip = createButton('btn-flip', 'button', langData[lang]['btn-flip']);
  const cardDescription = createElement('div', 'card-description') as HTMLDivElement;
  const title = createParagraph('card-title', cardTitle);
  const value = createParagraph('card-value', cardValue);
  const text = createParagraph('card-text', cardText);

  cardDescription.append(title, value, text);

  btnFlip.addEventListener('click', (e) => {
    flipCard(e);
  } );

  cardBack.append(cardDescription, btnFlip);
  return cardBack;
};

export const createCardBlock  = (currCard: Element, cardTitle: string, cardValue: string, cardText: string, lang: string): HTMLDivElement => {
  const container = createElement('div', 'card-container') as HTMLDivElement;
  container.append(createCardFront(currCard, lang), createCardBack(cardTitle, cardValue, cardText, lang));

  return container;
};

const createCardsDescription = (lang: string): HTMLDivElement => {
  const cardsDescription = createElement('div', 'cards-description') as HTMLDivElement;
  console.log('lang', lang);
  const numberedCard = createCardBlock(renderCardWithNumber('8', greenColor, 0.5), langData[lang]['numbered-card-title'], langData[lang]['numbered-card-points'], langData[lang]['numbered-card-descr'], lang);
  const plusTwoCard = createCardBlock(renderPlusTwoCard(blueColor, 0.5), langData[lang]['plustwo-card-title'], langData[lang]['action-card-points'], langData[lang]['plustwo-card-descr'], lang);
  const reverseCard = createCardBlock(renderReverseCard(redColor, 0.5), langData[lang]['reverse-card-title'], langData[lang]['action-card-points'], langData[lang]['reverse-card-descr'], lang);
  const blockedCard = createCardBlock(renderBlockedCard(yellowColor, 0.5), langData[lang]['blocked-card-title'], langData[lang]['action-card-points'], langData[lang]['blocked-card-descr'], lang);
  const plusFourCard = createCardBlock(renderPlusFourCard(0.5), langData[lang]['plusfour-card-title'], langData[lang]['black-card-points'], langData[lang]['plusfour-card-descr'], lang);
  const multiCard = createCardBlock(renderMultiCard(0.5), langData[lang]['multi-card-title'], langData[lang]['black-card-points'], langData[lang]['multi-card-descr'], lang);
  cardsDescription.append(numberedCard, blockedCard, reverseCard, plusTwoCard, multiCard, plusFourCard);

  return cardsDescription;
};

const createRulesParagraph = (title: string, text: string): HTMLDivElement => {
  const rulesBlock = createElement('div', 'rules-description-block') as HTMLDivElement;
  const rulesTitle = createElement('h3', 'rules-description-title');
  rulesTitle.textContent = title;
  const rulesText = createParagraph('rules-description-text', text);
  rulesBlock.append(rulesTitle, rulesText);
  return rulesBlock;
};

const createRulesDescription = (lang: string): HTMLDivElement => {
  const rulesDescription = createElement('div', 'rules-description') as HTMLDivElement;
  rulesDescription.append(createRulesParagraph(langData[lang]['rules-goal-title'], langData[lang]['rules-goal-text']));
  rulesDescription.append(createRulesParagraph(langData[lang]['rules-play-title'], langData[lang]['rules-play-text']));
  rulesDescription.append(createRulesParagraph(langData[lang]['rules-points-title'], langData[lang]['rules-points-text']));
  return rulesDescription;
};

const createRulesBlock = (lang: string): HTMLDivElement => {
  const rulesBlock = createElement('div', 'rules-wrapper') as HTMLDivElement;
  rulesBlock.append(createRulesDescription(lang), createCardsDescription(lang));
  return rulesBlock;
};

export const createRulesPage = (lang: string) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  main.append(createRulesBlock(lang));
};

export const openRulesPage = (lang: string) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  main.innerHTML = '';
  addButtonBackToMainPage(lang);
  createRulesPage(lang);
};



//----------------------------RULES WINDOW
export const createRulesWindow = (lang: string) => {
  const rulesWindow = createElement('div', 'rules-window') as HTMLDivElement;
  const button = createButton('btn-cross', 'button', 'x'); 
  rulesWindow.append(createCardsDescription(lang), button);
  rulesWindow.style.display = 'none';

  button.addEventListener('click', () => {
    rulesWindow.style.display = 'none';
    rulesWindow.classList.remove('open');
  } );
  return rulesWindow;
};

export const openRulesWindow = () => {
  const rulesWindow = document.querySelector('.rules-window') as HTMLDivElement;
  rulesWindow.style.display = 'flex';
  rulesWindow.classList.add('open');
};

