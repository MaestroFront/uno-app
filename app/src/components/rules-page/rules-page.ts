import { blueColor, greenColor, redColor, yellowColor, renderCardWithNumber, renderMultiCard, renderBlockedCard, renderPlusFourCard, renderPlusTwoCard, renderReverseCard } from '../cards/cards';
import { langData } from '../data';
import { addButtonBackToMainPage, createButton, createElement, createParagraph } from '../helpers/helpers';


const createCardBlock  = (currCard: Element, cardTitle: string, cardValue: string, cardText: string, classNameCard: string, classNameCardFront: string): HTMLDivElement => {
  const container = createElement('div', 'card-container') as HTMLDivElement;

  const card = createElement('div', 'card-block') as HTMLDivElement;
  card.classList.add(classNameCard);
  const cardFront = createElement('div', 'card-block-front') as HTMLDivElement;
  const btnFlip = createButton('btn-flip', 'button', 'flip');
  cardFront.append(btnFlip);
  cardFront.classList.add(classNameCardFront);

  const cardImgWrapper = createElement('div', 'card-img-wrapper') as HTMLDivElement;
  const cardDescription = createElement('div', 'card-description') as HTMLDivElement;
  const showBtn = createButton('btn-show', 'button', 'show');
  
  const title = createParagraph('card-title', cardTitle);
  const value = createParagraph('card-value', cardValue);
  const text = createParagraph('card-text', cardText);
  
  cardImgWrapper.append(currCard);
  cardDescription.append(title, value, text);
  card.append(cardFront, cardImgWrapper, cardDescription, showBtn);
  container.append(card, cardFront);
  return container;
};

const createCardsDescription = (): HTMLDivElement => {
  const cardsDescription = createElement('div', 'cards-description') as HTMLDivElement;
  
  const numberedCard = createCardBlock(renderCardWithNumber('8', greenColor, 0.3), langData.ru['numbered-card-title'], langData.ru['numbered-card-points'], langData.ru['numbered-card-descr'], 'numbered-card', 'numbered-card-front');
  const plusTwoCard = createCardBlock(renderPlusTwoCard(blueColor, 0.3), langData.ru['plustwo-card-title'], langData.ru['action-card-points'], langData.ru['plustwo-card-descr'], 'plustwo-card', 'plustwo-card-front');
  const reverseCard = createCardBlock(renderReverseCard(redColor, 0.3), langData.ru['reverse-card-title'], langData.ru['action-card-points'], langData.ru['reverse-card-descr'], 'reverse', 'reverse-front');
  const blockedCard = createCardBlock(renderBlockedCard(yellowColor, 0.3), langData.ru['blocked-card-title'], langData.ru['action-card-points'], langData.ru['blocked-card-descr'], 'blocked', 'blocked-front');
  const plusFourCard = createCardBlock(renderPlusFourCard(0.3), langData.ru['plusfour-card-title'], langData.ru['black-card-points'], langData.ru['plusfour-card-descr'], 'plusfour-card', 'plusfour-card-front');
  const multiCard = createCardBlock(renderMultiCard(0.3), langData.ru['multi-card-title'], langData.ru['black-card-points'], langData.ru['multi-card-descr'], 'multi-card', 'multi-card-front');
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

document.addEventListener('click', (e) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  const element = e.target as HTMLButtonElement;
  if (element.closest('.btn-rules')) {
    main.innerHTML = '';
    addButtonBackToMainPage();
    createRulesPage();
  }
  if (element.closest('.btn-show') || element.closest('.btn-flip')) {
    const parent = element.parentNode?.parentNode as HTMLDivElement;
    parent.classList.toggle('open');
    parent.querySelector('.card-block-front')?.classList.toggle('open');
    parent.querySelector('.card-block')?.classList.toggle('open');
  }
});
