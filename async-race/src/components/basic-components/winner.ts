import { createElement } from '../../utils/createElementHelper';

export const createWinnerElement = (name: string, wins: number, time: number) => {
  const winner = createElement('div', 'winner');

  const winnerName = createElement('p', 'winner-text');
  const winnerWins = createElement('p', 'winner-text');
  const winnerTime = createElement('p', 'winner-text');

  winnerName.textContent = `${name}`;
  winnerWins.textContent = `${wins}`;
  winnerTime.textContent = `${time}s`;

  winner.appendChild(winnerName);
  winner.appendChild(winnerWins);
  winner.appendChild(winnerTime);

  return winner;
};
