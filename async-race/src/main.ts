import { createGarage } from './components/garage/garage';
import { createHeader } from './components/header/header';
import { createWinnersContainer } from './components/winners/winners';
import { getLS, setLS } from './utils/localStorageHelpers';
import './style.css';
import { getCars, getWinners } from './components/api';
import { state } from './components/store';

getLS('state') ? (state.page = getLS('state').page) : 1;
const carsApi = await getCars(state.page);
state.cars = carsApi.items;
state.count = carsApi.count;
state.totalPages = Math.ceil(state.count / 7);
const winnersApi = await getWinners(1, state.sortBy, state.sortOrder);
state.winners = winnersApi;
getLS('state') ? (state.page = getLS('state').page) : setLS('state', state);

state.subscribe((updatedState) => {
  console.log(updatedState);
  setLS('state', updatedState);
});

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

const createBody = () => {
  const header = createHeader(); // --------- блокировать кнопки гараж/виннерс во время гонки
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

createBody();
