import { createGarage } from './components/garage/garage';
import { createHeader } from './components/header/header';
import { createWinnersContainer } from './components/winners/winners';
import { getLS, setLS } from './utils/localStorageHelpers';
import './style.css';
import { getCars, getWinners } from './components/api';
import { state } from './components/store';
import { carsPerPage } from './components/garage/createCars';

const checkView = (
  body: HTMLElement,
  garageContainer: HTMLElement,
  winnersContainer: HTMLElement,
) => {
  if (!getLS('view')) body.appendChild(garageContainer);
  if (getLS('view') === 'Garage') {
    state.view = 'garage';
    winnersContainer.remove();
    body.appendChild(garageContainer);
  } else {
    state.view = 'winners';
    garageContainer.remove();
    body.appendChild(winnersContainer);
  }
  return body;
};

const createBody = async () => {
  state.page = getLS('state') ? getLS('state').page : 1;

  const carsApi = await getCars(state.page);
  state.cars = carsApi.items;
  state.count = carsApi.count;
  state.totalPages = Math.ceil(state.count / carsPerPage);
  state.winners = await getWinners({
    page: state.winnersPage,
    sort: getLS('sort') || state.sortBy,
    order: getLS('order') || state.sortOrder,
  });
  if (getLS('state')) {
    state.page = getLS('state').page;
  } else {
    setLS('state', state);
  }

  state.subscribe((updatedState) => {
    setLS('state', updatedState);
  });

  const header = createHeader();
  const garageContainer = createGarage({
    carsArray: carsApi.items,
    carsTotalCount: carsApi.count,
    onPageChange: async (currentPage) => {
      const { items } = await getCars(currentPage);
      garageContainer.updateCars(items);
    },
    onCarsChange: async () => {
      const { items } = await getCars(state.page);
      garageContainer.updateCars(items);
    },
  });
  const winnersContainer = createWinnersContainer();

  document.body.appendChild(header.el);

  header.viewWrapper.addEventListener('input', () => {
    checkView(document.body, garageContainer.el, winnersContainer);
  });
  checkView(document.body, garageContainer.el, winnersContainer);
};

createBody().catch((err) => {
  console.error(err);
});
