import ComputerPlayer from './computer-player';
import Player from './player';

export interface CardInfo {
  color: string,
  value: number
}
export interface Players {
  player: Player | ComputerPlayer | null;
}
