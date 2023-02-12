
const melody = '../../assets/music/melody.mp3';
export const music = new Audio(melody);

export const musicPlay = () => {
  if (music.readyState) void music.play();
};

export const musicStop = () => {
  void music.pause();
};