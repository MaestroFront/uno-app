import CardDeck from './сard_deck';
import { CardInfo } from './types';

class Player {
  public playersName: string;

  private cardsInHand: number[];

  constructor(name: string) {
    this.playersName = name;
    this.cardsInHand = [];
  }

  takeCards(cards: number[]): void {
    this.cardsInHand.push(...cards);
  }

  getNumberOfCardsInHand(): number {
    return this.cardsInHand.length;
  }

  getYourCards(): number[] {
    return this.cardsInHand;
  }

  getFirstMove(cardId: number): number {
    const cardInfo: CardInfo = CardDeck.getColorAndValue(cardId);
    if (cardInfo.color !== CardDeck.colors[4]) {
      this.cardsInHand.splice(this.cardsInHand.indexOf(cardId), 1);
      return cardId;
    } else {
      return 999;
    }
  }

}

export default Player;
