import { createElement } from '../../utils/createElementHelper';

export const createWinnerElement = (name: string, wins: number, time: number) => {
  const winner = createElement('div', { className: 'winner' });

  const winnerName = createElement('p', { className: 'winner-text', textContent: `${name}` });
  const winnerWins = createElement('p', { className: 'winner-text', textContent: `${wins}` });
  const winnerTime = createElement('p', { className: 'winner-text', textContent: `${time}s` });

  winner.appendChild(winnerName);
  winner.appendChild(winnerWins);
  winner.appendChild(winnerTime);

  return winner;
};
