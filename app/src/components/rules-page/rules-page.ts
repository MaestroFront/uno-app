import { blueColor, greenColor, redColor, renderBlockedCard, renderCardWithNumber, renderMultiCard, renderPlusFourCard, renderPlusTwoCard, renderReverseCard, yellowColor } from '../cards/cards';
import { langData } from '../data';
import { body } from '../global-components/constants';
import { createHeader } from '../header/header';
import { createElement, createParagraph } from '../helpers/helpers';

const createCardBlock  = (currCard: Element, cardTitle: string, cardValue: string, cardText: string): HTMLDivElement => {
  const card = createElement('div', 'card-block') as HTMLDivElement;
  const cardImgWrapper = createElement('div', 'card-img-wrapper') as HTMLDivElement;
  const cardDescription = createElement('div', 'card-description') as HTMLDivElement;
  
  const title = createParagraph('card-title', cardTitle);
  const value = createParagraph('card-value', cardValue);
  const text = createParagraph('card-text', cardText);
  
  cardImgWrapper.append(currCard);
  cardDescription.append(title, value, text);
  card.append(cardImgWrapper, cardDescription);
  return card;
};

const createCardsDescription = (): HTMLDivElement => {
  const cardsDescription = createElement('div', 'cards-description') as HTMLDivElement;
  
  const numberedCard = createCardBlock(renderCardWithNumber('100%', '100%', '8', greenColor), langData.ru['numbered-card-title'], langData.ru['numbered-card-points'], langData.ru['numbered-card-descr']);
  const plusTwoCard = createCardBlock(renderPlusTwoCard('100%', '100%', blueColor), langData.ru['plustwo-card-title'], langData.ru['action-card-points'], langData.ru['plustwo-card-descr']);
  const reverseCard = createCardBlock(renderReverseCard('100%', '100%', redColor), langData.ru['reverse-card-title'], langData.ru['action-card-points'], langData.ru['reverse-card-descr']);
  const blockedCard = createCardBlock(renderBlockedCard('100%', '100%', yellowColor), langData.ru['blocked-card-title'], langData.ru['action-card-points'], langData.ru['blocked-card-descr']);
  const plusFourCard = createCardBlock(renderPlusFourCard('100%', '100%'), langData.ru['plusfour-card-title'], langData.ru['black-card-points'], langData.ru['plusfour-card-descr']);
  const multiCard = createCardBlock(renderMultiCard('100%', '100%'), langData.ru['multi-card-title'], langData.ru['black-card-points'], langData.ru['multi-card-descr']);
  cardsDescription.append(numberedCard, blockedCard, reverseCard, plusTwoCard, multiCard, plusFourCard);

  cardsDescription.append();
  cardsDescription.append();
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

const createRulesPage = () => {
  const main = createElement('main', 'main') as HTMLDivElement;
  main.append(createRulesBlock());
  body.append(createHeader(), main);
};



createRulesPage();
