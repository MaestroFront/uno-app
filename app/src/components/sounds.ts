
const music = new Audio('../../assets/music/melody.mp3');
const click = new Audio('../../assets/music/click.mp3');
const getCard = new Audio('../../assets/music/one_card.mp3');
export const chatSound = new Audio('../../assets/music/chat.mp3');
export const getColorSound = new Audio('../../assets/music/color.mp3');
export const getReverseSound = new Audio('../../assets/music/revers.mp3');
export const getChooseSound = new Audio('../../assets/music/choose.mp3');


export const musicPlay = () => {
  // music.autoplay = true;
  if (music.readyState) {
    void music.play();
  }
  music.loop = true;
};
export const musicStop = () => {
  void music.pause();
};

export const setMusic = (el:HTMLButtonElement ) => {
  if (el.textContent === 'music ON') {
    musicPlay();
    el.classList.remove('off');
  } else {
    musicStop();
    el.classList.add('off');
  }
};


export const clickSoundPlay = () => {
  if (click.readyState) void click.play();
};

export const getCardSoundPlay = () => {
  if (getCard.readyState) void getCard.play();
};

//------------sounds on/off
export const onSounds = () => {
  click.volume = 1;
  getCard.volume = 1;
  chatSound.volume = 1;
  getColorSound.volume = 1;
  getReverseSound.volume = 1;
  getChooseSound.volume = 1;
};
export const offSounds = () => {
  click.volume = 0;
  getCard.volume = 0;
  chatSound.volume = 0;
  getColorSound.volume = 0;
  getReverseSound.volume = 0;
  getChooseSound.volume = 0;
};

export const setSounds = (el:HTMLButtonElement ) => {
  if (el.textContent === 'sound ON') {
    onSounds();
    el.classList.remove('off');
  } else {
    offSounds();
    el.classList.add('off');
  }
};