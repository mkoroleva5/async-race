import { createCarSvg } from '../../utils/createCarSvg';
import { createElement } from '../../utils/createElementHelper';
import { createWinnerElement } from '../basic-components/winner';
import { createWinnersOptions } from '../basic-components/winnersOptions';
import { createWinnersPagination } from '../basic-components/winnersPagination';
import { state } from '../store';

import './winners.css';

export const createWinnersContainer = () => {
  const winners = createElement('main', 'winners-container');

  const winnersTitle = createElement('h1', 'winners-title');
  winnersTitle.textContent = `Winners (${state.winners.count})`;
  state.subscribe(() => {
    winnersTitle.textContent = `Winners (${state.winners.count})`;
  });

  winners.appendChild(winnersTitle);

  const winnersPages = createWinnersPagination();
  winners.appendChild(winnersPages);

  const sortOption = createWinnersOptions().sort;
  const orderOption = createWinnersOptions().order;

  winners.appendChild(sortOption);
  winners.appendChild(orderOption);
  const winnersWrapper = createElement('div', 'winners-wrapper');

  const createWinners = () => {
    winnersWrapper.replaceChildren();

    state.winners.items.forEach((el, index) => {
      const carNumber = createElement('p', 'car-number');
      const carIndex = (state.winnersPage - 1) * 10 + (index + 1);
      carNumber.textContent = `${carIndex}`;

      const carImage = createElement('div', 'winner-image');
      carImage.innerHTML = createCarSvg(el.car.color);
      const winner = createWinnerElement(el.car.name, el.wins, +(el.time / 1000).toFixed(2));
      winner.prepend(carImage);
      winner.prepend(carNumber);

      winnersWrapper.appendChild(winner);
    });
  };

  state.subscribe(() => {
    createWinners();
  });

  createWinners();
  winners.append(winnersWrapper);

  return winners;
};
