import { getCardSoundPlay } from '../sounds';

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



export const getCardFromDeck = (e: Event, playerNumber: string ) => {
  const card = document.querySelector('.get-card') as HTMLDivElement;
  const clickedCard = e.target as Element;
  let player = {};
  switch (playerNumber) {
    case 'top': {
      player = { transform: 'translate(100%, -90%) rotate(180deg)' };
    } break;
    case 'left': {
      player = { transform: 'translate(-250%, 0%) rotate(90deg)' };
    } break;
    case 'right': {
      player = { transform: 'translate(300%, 0%) rotate(90deg)' };
    } break;
    default: {
      player = { transform: 'translate(100%, 90%) rotateY(-180deg)' };
    } break;

  }
  if (clickedCard.closest('.back-side')) {
    // card.classList.toggle('move');
    const currCardKeyframes = new KeyframeEffect(
      card, 
      [
        { transform: 'translate(0%, 0%) rotateY(0deg) rotateX(90deg)' },
        player,
        // { transform: 'translate(100%, 90%) rotateY(-180deg)' }, bottom
        // { transform: 'translate(100%, -90%) rotate(180deg)' }, //top
        // { transform: 'translate(-250%, 0%) rotate(90deg)' }, //left
        // { transform: 'translate(300%, 0%) rotate(90deg)' }, //right
      ], 
      { duration: 1000, fill: 'none' },
    );
    const moveCardAnimation = new Animation(currCardKeyframes, document.timeline);
    moveCardAnimation.play();
    void getCardSoundPlay();
  }
};
