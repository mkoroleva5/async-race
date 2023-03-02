import { createCarSvg } from '../../utils/createCarSvg';
import { createElement } from '../../utils/createElementHelper';
import { getWinners } from '../api';
import { createPagination } from '../basic-components/pagination';
import { createWinnerElement } from '../basic-components/winner';
import { createWinnersOptions } from '../basic-components/winnersOptions';
import { state } from '../store';

import './winners.css';

export const createWinnersContainer = () => {
  const winners = createElement('main', { className: 'winners-container' });

  const winnersTitle = createElement('h1', {
    className: 'winners-title',
    textContent: `Winners (${state.winners.count})`,
  });

  state.subscribe(() => {
    winnersTitle.textContent = `Winners (${state.winners.count})`;
  });

  winners.appendChild(winnersTitle);

  const changeStateWinnersPage = async (currentPage: number) => {
    state.winnersPage = currentPage;
    state.winners = await getWinners({
      page: state.winnersPage,
      sort: state.sortBy,
      order: state.sortOrder,
    });
  };

  const winnersPages = createPagination('winners-', state.winnersPage, changeStateWinnersPage);
  winners.appendChild(winnersPages);

  const sortOption = createWinnersOptions().sort;
  const orderOption = createWinnersOptions().order;

  winners.appendChild(sortOption);
  winners.appendChild(orderOption);
  const winnersWrapper = createElement('div', { className: 'winners-wrapper' });

  const createWinners = () => {
    winnersWrapper.replaceChildren();

    state.winners.items.forEach((el, index) => {
      const carIndex = (state.winnersPage - 1) * 10 + (index + 1);
      const carNumber = createElement('p', { className: 'car-number', textContent: `${carIndex}` });
      const carImage = createElement('div', {
        className: 'winner-image',
        innerHTML: createCarSvg(el.car.color),
      });

      const winnerTime = Number((el.time / 1000).toFixed(2));
      const winner = createWinnerElement(el.car.name, el.wins, winnerTime);
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
