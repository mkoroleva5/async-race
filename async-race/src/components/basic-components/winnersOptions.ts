import { createElement } from '../../utils/createElementHelper';
import { getLS, setLS } from '../../utils/localStorageHelpers';
import { getWinners } from '../api';
import { SortBy, SortOrder, state } from '../store';

export const createWinnersOptions = () => {
  const sortInputWrapper = createElement('select', {
    className: 'sort-wrapper',
  });

  const sortOptionId = createElement('option', {
    className: 'sort-option-1',
    value: 'id',
    textContent: 'id',
  });

  const sortOptionWins = createElement('option', {
    className: 'sort-option-2',
    value: 'wins',
    textContent: 'wins',
  });

  const sortOptionTime = createElement('option', {
    className: 'sort-option-3',
    value: 'time',
    textContent: 'time',
  });

  sortInputWrapper.appendChild(sortOptionId);
  sortInputWrapper.appendChild(sortOptionWins);
  sortInputWrapper.appendChild(sortOptionTime);

  const orderInputWrapper = createElement('select', {
    className: 'order-wrapper',
  });

  const orderOptionASC = createElement('option', {
    className: 'order-option-1',
    value: 'ASC',
    textContent: 'ASC',
  });
  const orderOptionDESC = createElement('option', {
    className: 'order-option-2',
    value: 'DESC',
    textContent: 'DESC',
  });

  orderInputWrapper.appendChild(orderOptionASC);
  orderInputWrapper.appendChild(orderOptionDESC);

  if (!getLS('sort')) {
    state.sortBy = 'id';
    setLS('sort', 'id');
  } else {
    sortInputWrapper.value = getLS('sort');
    state.sortBy = sortInputWrapper.value as SortBy;
  }
  if (!getLS('order')) {
    state.sortOrder = 'ASC';
    setLS('order', 'ASC');
  } else {
    orderInputWrapper.value = getLS('order');
    state.sortOrder = orderInputWrapper.value as SortOrder;
  }

  sortInputWrapper.addEventListener('change', async () => {
    setLS('sort', sortInputWrapper.value);
    state.sortBy = sortInputWrapper.value as SortBy;
    state.winners = await getWinners({ page: 1, sort: state.sortBy, order: state.sortOrder });
    state.broadcast(state);
  });

  orderInputWrapper.addEventListener('change', async () => {
    setLS('order', orderInputWrapper.value);
    state.sortOrder = orderInputWrapper.value as SortOrder;
    state.winners = await getWinners({ page: 1, sort: state.sortBy, order: state.sortOrder });
    state.broadcast(state);
  });

  return { sort: sortInputWrapper, order: orderInputWrapper };
};
