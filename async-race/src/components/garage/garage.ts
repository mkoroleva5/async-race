import { createElement } from '../../utils/createElementHelper';
import { createPagination } from '../basic-components/pagination';
import {
  Car,
  createCar,
  getCars,
  getWinner,
  getWinners,
  saveWinner,
  startRace,
  stopRace,
} from '../api';
import './garage.css';
import { createInput } from '../basic-components/input';
import { state } from '../store';
import { createCars } from '../../utils/createCars';
import {
  resetRaceAnimation,
  startRaceAnimation,
  stopRaceAnimation,
} from '../../utils/raceAnimations';
import { generateName } from '../../utils/generateName';
import { generateColor } from '../../utils/generateColor';
import { setLS } from '../../utils/localStorageHelpers';

interface CreateGarageProps {
  carsArray: Car[];
  carsTotalCount: number;
  onPageChange: (currentPage: number) => void;
  onCarsChange: () => void;
}

export const createGarage = ({ carsArray, onPageChange, onCarsChange }: CreateGarageProps) => {
  const garage = createElement('main', 'garage-wrapper');

  const winnerPopupWrapper = createElement('div', 'winner-popup-wrapper');
  const winnerPopup = createElement('div', 'winner-popup');
  const winnerMessage = createElement('p', 'winner-message');

  winnerPopup.appendChild(winnerMessage);
  winnerPopupWrapper.appendChild(winnerPopup);
  garage.appendChild(winnerPopupWrapper);

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

  const garageTitle = createElement('h1', 'garage-title');

  const creationInput = createInput(carsArray, 'create', '#ACE16B', async () => {
    raceButton.disabled = false;
    raceButton.classList.remove('disabled');
    resetButton.disabled = false;
    resetButton.classList.remove('disabled');

    onCarsChange();
    const currentCars = await getCars(state.page);
    state.cars = currentCars.items;
    state.count = currentCars.count;
    state.totalPages = Math.ceil(state.count / 7);
  });

  const updateInput = createInput(carsArray, 'update', '#988FE0', () => {
    raceButton.disabled = false;
    raceButton.classList.remove('disabled');
    resetButton.disabled = false;
    resetButton.classList.remove('disabled');

    onCarsChange();
  });

  garage.appendChild(creationInput);
  garage.appendChild(updateInput);

  const raceButtons = createElement('div', 'race-buttons');
  const raceButton = createElement('button', 'button race-button') as HTMLButtonElement;
  const resetButton = createElement('button', 'button reset-button') as HTMLButtonElement; // -------- сделать createElement дженериком
  const generateButton = createElement('button', 'button generate-button');
  raceButton.innerHTML = 'race';
  resetButton.innerHTML = 'reset';
  generateButton.innerHTML = 'generate cars';
  raceButtons.appendChild(raceButton);
  raceButtons.appendChild(resetButton);
  raceButtons.appendChild(generateButton);
  garage.appendChild(raceButtons);

  garageTitle.textContent = `Garage(${state.count})`;

  state.subscribe(({ count }) => {
    garageTitle.textContent = `Garage(${count})`;
  });

  garage.appendChild(garageTitle);

  let cars = createCars({ carsArray, onCarRemove: () => onCarsChange() });

  const updateCars = (updatedCars: Car[]) => {
    garage.removeChild(cars);
    cars = createCars({
      carsArray: updatedCars,
      onCarRemove: () => onCarsChange(),
    });
    garage.appendChild(cars);
  };

  const pagination = createPagination(async (currentPage) => {
    onPageChange(currentPage);
    const currentCars = await getCars(currentPage);
    state.page = currentPage;
    state.cars = currentCars.items;
    updateCars(state.cars);
  });
  garage.appendChild(pagination);

  garage.appendChild(cars);

  raceButton.addEventListener('click', () => {
    raceButton.disabled = true;
    raceButton.classList.add('disabled');
    resetButton.disabled = true;
    resetButton.classList.add('disabled');
    const promises = state.cars.map(async (el) => {
      try {
        const { velocity, distance } = await startRace(el.id);
        const time = Math.round(distance / velocity);
        await startRaceAnimation(el.id, time);
      } catch (err) {
        console.error(err);
      }
    });
    Promise.all(promises)
      .then(async () => {
        resetButton.disabled = false;
        resetButton.classList.remove('disabled');
        if (state.currentWinner) state.winners.push(state.currentWinner); // ---------------- не пушит и не сохраняет
        await saveWinner(state.currentWinner?.winner?.id, state.currentWinner?.time);
        state.winners = await getWinners({ page: 1, sort: state.sortBy, order: state.sortOrder });
        setLS('state', state);
      })
      .catch(() => {}); // Already handled
  });

  resetButton.addEventListener('click', () => {
    state.cars.map(async (el) => {
      await stopRace(el.id); // -------------- не работает
      await stopRaceAnimation(el.id);
      resetRaceAnimation(el.id);
      raceButton.classList.remove('disabled');
    });
    updateCars(state.cars); // -------------- обновлять драйв
  });

  generateButton.addEventListener('click', async () => {
    for (let i = 0; i < 100; i += 1) {
      createCar({
        name: generateName(),
        color: generateColor(),
      });
    }
    const currentCars = await getCars(state.page);
    updateCars(currentCars.items);
    state.cars = currentCars.items;
    state.count += 100;
    state.totalPages = Math.ceil(state.count / 7);
  });

  return { el: garage, updateCars };
};
