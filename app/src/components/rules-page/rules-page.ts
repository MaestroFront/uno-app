import { blueColor, greenColor, redColor, yellowColor, renderCardWithNumber, renderMultiCard, renderBlockedCard, renderPlusFourCard, renderPlusTwoCard, renderReverseCard } from '../cards/cards';
import { langData } from '../data';
import { addButtonBackToMainPage, createButton, createElement, createParagraph } from '../helpers/helpers';

const flipCard = (e: Event): void => {
  const element = e.target as HTMLButtonElement;
  const parent = element.parentNode?.parentNode as HTMLDivElement;
  parent.classList.toggle('open');
  parent.querySelector('.card-block-front')?.classList.toggle('open');
  parent.querySelector('.card-block-back')?.classList.toggle('open');
};

const createCardFront = (currCard: Element): HTMLDivElement => {
  const cardFront = createElement('div', 'card-block-front') as HTMLDivElement;
  const cardImgWrapper = createElement('div', 'card-img-wrapper') as HTMLDivElement;
  cardImgWrapper.append(currCard);

  const btnReadMore = createButton('btn-read', 'button', 'read more...');
  cardFront.append(cardImgWrapper, btnReadMore); 

  btnReadMore.addEventListener('click', (e) => {
    flipCard(e);
  } );

  return cardFront;
};

const createCardBack = (cardTitle: string, cardValue: string, cardText: string): HTMLDivElement => {
  const cardBack = createElement('div', 'card-block-back') as HTMLDivElement;
  
  const btnFlip = createButton('btn-flip', 'button', 'flip card');
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

export const createCardBlock  = (currCard: Element, cardTitle: string, cardValue: string, cardText: string): HTMLDivElement => {
  const container = createElement('div', 'card-container') as HTMLDivElement;
  container.append(createCardFront(currCard), createCardBack(cardTitle, cardValue, cardText));

  return container;
};

const createCardsDescription = (): HTMLDivElement => {
  const cardsDescription = createElement('div', 'cards-description') as HTMLDivElement;
  
  const numberedCard = createCardBlock(renderCardWithNumber('8', greenColor, 0.8), langData.ru['numbered-card-title'], langData.ru['numbered-card-points'], langData.ru['numbered-card-descr']);
  const plusTwoCard = createCardBlock(renderPlusTwoCard(blueColor, 0.8), langData.ru['plustwo-card-title'], langData.ru['action-card-points'], langData.ru['plustwo-card-descr']);
  const reverseCard = createCardBlock(renderReverseCard(redColor, 0.8), langData.ru['reverse-card-title'], langData.ru['action-card-points'], langData.ru['reverse-card-descr']);
  const blockedCard = createCardBlock(renderBlockedCard(yellowColor, 0.8), langData.ru['blocked-card-title'], langData.ru['action-card-points'], langData.ru['blocked-card-descr']);
  const plusFourCard = createCardBlock(renderPlusFourCard(0.8), langData.ru['plusfour-card-title'], langData.ru['black-card-points'], langData.ru['plusfour-card-descr']);
  const multiCard = createCardBlock(renderMultiCard(0.8), langData.ru['multi-card-title'], langData.ru['black-card-points'], langData.ru['multi-card-descr']);
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

const createRulesDescription = (): HTMLDivElement => {
  const rulesDescription = createElement('div', 'rules-description') as HTMLDivElement;
  rulesDescription.append(createRulesParagraph(langData.ru['rules-goal-title'], langData.ru['rules-goal-text']));
  rulesDescription.append(createRulesParagraph(langData.ru['rules-play-title'], langData.ru['rules-play-text']));
  rulesDescription.append(createRulesParagraph(langData.ru['rules-points-title'], langData.ru['rules-points-text']));
  return rulesDescription;
};

const createRulesBlock = (): HTMLDivElement => {
  const rulesBlock = createElement('div', 'rules-wrapper') as HTMLDivElement;
  rulesBlock.append(createRulesDescription(), createCardsDescription());
  return rulesBlock;
};

export const createRulesPage = () => {
  const main = document.querySelector('.main') as HTMLDivElement;
  main.append(createRulesBlock());
};

export const openRulesPage = () => {
  const main = document.querySelector('.main') as HTMLDivElement;
  main.innerHTML = '';
  addButtonBackToMainPage();
  createRulesPage();
};

