/* A class that controls the behavior of the computer player */
import CardDeck from './сard_deck';
import { CardInfo } from './types';

class ComputerPlayer {
  private readonly playersName: string;

  private cardsInHand: number[];

  constructor(name: string) {
    this.playersName = name;
    this.cardsInHand = [];
  }

  /* Chooses possible moves depending on the card lying on the table and the available cards */
  selectPossibleOptionsForMove(topCardId: number): number[] {
    const topCardInfo = CardDeck.getColorAndValue(topCardId);
    const optionsOfMove: number[] = [];
    for (let i = 0; i < this.cardsInHand.length; i++) {
      const cardInfo : CardInfo = CardDeck.getColorAndValue(this.cardsInHand[i]);
      if (cardInfo.color === topCardInfo.color || cardInfo.value === topCardInfo.value || cardInfo.color === CardDeck.colors[4]) {
        optionsOfMove.push(this.cardsInHand[i]);
      }
    }
    return optionsOfMove;
  }

  /* Adds cards to hand */
  takeCards(cards: number[]): void {
    this.cardsInHand.push(...cards);
  }

  /* Makes a move on one of the possible options
  * returns 999 if there are no more cards to draw and the computer has no options  */
  getMove(deck: CardDeck, topCardId: number): number {
    let options: number[] = this.selectPossibleOptionsForMove(topCardId);
    while (options.length === 0 && deck.isNoMoreCards()) {
      deck.getCards();
      options = this.selectPossibleOptionsForMove(topCardId);
    }
    if (options.length > 0) {
      const randomCard: number = options[Math.floor(Math.random() * options.length)];
      this.cardsInHand.splice(this.cardsInHand.indexOf(randomCard), 1);
      return randomCard;
    } else {
      return 999;
    }
  }
}

export default ComputerPlayer;
