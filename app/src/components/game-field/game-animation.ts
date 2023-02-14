
export const moveCurrCard = (e: Event) => {
  const el = e.target as Element;
  const currCard = (el.parentElement as Element).parentElement as HTMLElement;
  if (el.closest('.cardCenter')) {
    const currCardKeyframes = new KeyframeEffect(
      currCard, 
      [
        { transform: 'translate(0%, 0%)' }, 
        { transform: 'translate(50%, -50%)' },
      ], 
      { duration: 300, fill: 'none' },
    );
    const moveCardAnimation = new Animation(currCardKeyframes, document.timeline);
    moveCardAnimation.play();
  }
  
};



export const getCardFromDeck = (e: Event) => {
  const card = document.querySelector('.get-card') as HTMLDivElement;
  const clickedCard = e.target as Element;
  if (clickedCard.closest('.back-side')) {
    card.classList.toggle('move');
  }
};
