import { getCardSoundPlay } from '../sounds';

export const mouseEventsStop = (hide: boolean) => {
  const playerCards = document.querySelector('.player-1') as HTMLBodyElement;
  const field = document.querySelector('.field') as HTMLBodyElement;
  if (hide) {
    setTimeout(() => {
      playerCards.classList.add('off');
      field.classList.add('off');
    }, 2000);
  } else {
    playerCards.classList.remove('off');
    field.classList.remove('off');
  }
};

export const moveCurrCard = (e: Event) => {
  const el = e.target as HTMLElement;
  const currCard = (el.parentElement as Element).parentElement as HTMLElement;
  const rect = el.getBoundingClientRect();

  if (el.closest('.player-1 .cardCenter')) {
    mouseEventsStop(true);
    const currCardKeyframes = new KeyframeEffect(
      currCard,
      [
        { transform: 'translate(0%, 0%)' },
        { transform: `translate(${window.innerWidth / 1.9 - rect.x}px, -210px)` },
      ],
      { duration: 1800, fill: 'none' },
    );
    const moveCardAnimation = new Animation(currCardKeyframes, document.timeline);
    moveCardAnimation.play();
  }
};

export const getCardFromDeck = (e: Event, playerNumber: string ) => {
  const card = document.querySelector('.get-card') as HTMLDivElement;
  const clickedCard = e.target as Element;
  const player = { transform: 'translate(100%, 160%) rotateY(-180deg)' };
  switch (playerNumber) {
    case 'top': {
      player.transform = 'translate(100%, -90%) rotate(180deg)';
    } break;
    case 'left': {
      player.transform = 'translate(-250%, 0%) rotate(90deg)';
    } break;
    case 'right': {
      player.transform = 'translate(300%, 0%) rotate(90deg)';
    } break;
  }
  if (clickedCard.closest('.back-side')) {
    const currCardKeyframes = new KeyframeEffect(
      card,
      [
        { transform: 'translate(0%, 0%) rotateY(0deg) rotateX(90deg)' },
        player,
      ],
      { duration: 1000, fill: 'none' },
    );
    const moveCardAnimation = new Animation(currCardKeyframes, document.timeline);
    moveCardAnimation.play();
    void getCardSoundPlay();
  }
};

