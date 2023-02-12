
export const getCardFromDeck = (e: Event) => {
  const card = document.querySelector('.full-deck .card:last-child') as HTMLDivElement;
  const clickedCard = e.target as Element;
  if (clickedCard.closest('.back-side')) {
    card.classList.add('move');
  }
};