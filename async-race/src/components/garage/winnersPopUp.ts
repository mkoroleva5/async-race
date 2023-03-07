import { createElement } from '../../utils/createElementHelper';
import { state } from '../store';

export const winnerPopupComponent = () => {
  const winnerPopupWrapper = createElement('div', { className: 'winner-popup-wrapper' });
  const winnerPopup = createElement('div', { className: 'winner-popup' });
  const winnerMessage = createElement('p', { className: 'winner-message' });

  winnerPopup.appendChild(winnerMessage);
  winnerPopupWrapper.appendChild(winnerPopup);

  winnerPopupWrapper.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      winnerPopupWrapper.style.display = 'none';
    }
  });

  state.subscribe(({ currentWinner }) => {
    if (currentWinner && currentWinner.winner) {
      const time = (currentWinner.time / 1000).toFixed(2);
      winnerMessage.innerHTML = `${currentWinner.winner.name} went first(${time}s)!`;
    }
  });
  return { el: winnerPopupWrapper };
};
