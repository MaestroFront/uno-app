
export const getCardFromDeck = (e: Event) => {
  const card = document.querySelector('.full-deck .last-card') as HTMLDivElement;
  const clickedCard = e.target as Element;
  if (clickedCard.closest('.back-side')) {
    card.classList.add('move');
  }
};