import { createElement } from '../../utils/createElementHelper';
import { getLS, setLS } from '../../utils/localStorageHelpers';
import { getWinners } from '../api';
import { state } from '../store';

export const createWinnersOptions = () => {
  const sortInputWrapper = createElement('select', 'sort-wrapper') as HTMLSelectElement;
  const sortOption1 = createElement('option', 'sort-option-1');
  sortOption1.setAttribute('value', 'id');
  sortOption1.textContent = 'id';
  const sortOption2 = createElement('option', 'sort-option-2');
  sortOption2.setAttribute('value', 'wins');
  sortOption2.textContent = 'wins';
  const sortOption3 = createElement('option', 'sort-option-3');
  sortOption3.setAttribute('value', 'time');
  sortOption3.textContent = 'time';

  sortInputWrapper.appendChild(sortOption1);
  sortInputWrapper.appendChild(sortOption2);
  sortInputWrapper.appendChild(sortOption3);

  const orderInputWrapper = createElement('select', 'order-wrapper') as HTMLSelectElement;
  const orderOption1 = createElement('option', 'order-option-1');
  orderOption1.setAttribute('value', 'ASC');
  orderOption1.textContent = 'ASC';
  const orderOption2 = createElement('option', 'order-option-2');
  orderOption2.setAttribute('value', 'DESC');
  orderOption2.textContent = 'DESC';

  orderInputWrapper.appendChild(orderOption1);
  orderInputWrapper.appendChild(orderOption2);

  if (!getLS('sort')) {
    state.sortBy = 'id';
    setLS('sort', 'id');
  } else {
    sortInputWrapper.value = getLS('sort');
    state.sortBy = sortInputWrapper.value;
  }
  if (!getLS('order')) {
    state.sortOrder = 'ASC';
    setLS('order', 'ASC');
  } else {
    orderInputWrapper.value = getLS('order');
    state.sortOrder = orderInputWrapper.value;
  }

  sortInputWrapper.addEventListener('change', async () => {
    setLS('sort', sortInputWrapper.value);
    state.sortBy = sortInputWrapper.value;
    state.winners = await getWinners({ page: 1, sort: state.sortBy, order: state.sortOrder });
    state.broadcast(state);
    console.log(state.winners);
  });

  orderInputWrapper.addEventListener('change', async () => {
    setLS('order', orderInputWrapper.value);
    state.sortOrder = orderInputWrapper.value;
    state.winners = await getWinners({ page: 1, sort: state.sortBy, order: state.sortOrder });
    state.broadcast(state);
    console.log(state.winners);
  });

  return { sort: sortInputWrapper, order: orderInputWrapper };
};
