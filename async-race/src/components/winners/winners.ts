import { createCarSvg } from '../../utils/createCarSvg';
import { createElement } from '../../utils/createElementHelper';
import { getLS, setLS } from '../../utils/localStorageHelpers';
import { createWinner, deleteWinner, getWinners } from '../api';
import { createWinnerElement } from '../basic-components/winner';
import { createWinnersOptions } from '../basic-components/winnersOptions';
import { state } from '../store';

import './winners.css';

export const createWinnersContainer = () => {
  const winners = createElement('main', 'winners-container');

  const sortOption = createWinnersOptions().sort;
  const orderOption = createWinnersOptions().order;

  winners.appendChild(sortOption);
  winners.appendChild(orderOption);

  const winnersWrapper = createElement('div', 'winners-wrapper');
  winners.append(winnersWrapper);

  const createWinners = async () => {
    const sortValue = sortOption.value;
    const orderValue = orderOption.value;

    state.subscribe(async () => {
      state.winners = await getWinners({ page: 1, sort: sortValue, order: orderValue });
      setLS('state', state);
    });

    console.log(state.winners);

    state.winners.items.map((el) => {
      // ------------------------------------------------------------ почему не видит?
      const carImage = createElement('div', 'winner-image');
      carImage.innerHTML = createCarSvg(el.car.color);
      const winner = createWinnerElement(el.car.name, el.wins, +(el.time / 1000).toFixed(2));
      winner.prepend(carImage);
      winnersWrapper.appendChild(winner);
      return winnersWrapper;
    });
  };

  createWinners();
  return winners;
};
