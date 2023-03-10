import { createElement } from '../../utils/createElementHelper';
import { createPagination } from '../basic-components/pagination';
import { Car, createCar, getCars, getWinners, startRace, stopRace } from '../api';
import './garage.css';
import { createInput } from '../basic-components/input';
import { state } from '../store';
import { carsPerPage, createCars } from './createCars';
import {
  resetRaceAnimation,
  startRaceAnimation,
  stopRaceAnimation,
} from '../../utils/raceAnimations';
import { generateName } from '../../utils/generateName';
import { generateColor } from '../../utils/generateColor';
import { winnerPopupComponent } from './winnersPopUp';

interface CreateGarageProps {
  carsArray: Car[];
  carsTotalCount: number;
  onPageChange: (currentPage: number) => void;
  onCarsChange: () => void;
}

export const createGarage = ({ carsArray, onPageChange, onCarsChange }: CreateGarageProps) => {
  const garage = createElement('main', { className: 'garage-wrapper' });

  const garageTitle = createElement('h1', {
    className: 'garage-title',
    textContent: `Garage(${state.count})`,
  });

  const winnerPopUp = winnerPopupComponent();
  garage.appendChild(winnerPopUp.el);

  const raceButtons = createElement('div', { className: 'race-buttons' });
  const raceButton = createElement('button', {
    className: 'button race-button',
    textContent: 'race',
  });
  const resetButton = createElement('button', {
    className: 'button reset-button',
    textContent: 'reset',
  });
  const generateButton = createElement('button', {
    className: 'button generate-button',
    textContent: 'generate cars',
  });
  raceButtons.appendChild(raceButton);
  raceButtons.appendChild(resetButton);
  raceButtons.appendChild(generateButton);

  const creationInput = createInput({
    carsArray,
    buttonName: 'create',
    color: '#ACE16B',
    callback: async () => {
      raceButton.disabled = false;
      raceButton.classList.remove('disabled');
      resetButton.disabled = false;
      resetButton.classList.remove('disabled');

      onCarsChange();
      const currentCars = await getCars(state.page);
      state.cars = currentCars.items;
      state.count = currentCars.count;
      state.totalPages = Math.ceil(state.count / carsPerPage);
    },
  });

  const updateInput = createInput({
    carsArray,
    buttonName: 'update',
    color: '#988FE0',
    callback: () => {
      raceButton.disabled = false;
      raceButton.classList.remove('disabled');
      resetButton.disabled = false;
      resetButton.classList.remove('disabled');
      onCarsChange();
    },
    disabled: true,
  });

  garage.appendChild(creationInput);
  garage.appendChild(updateInput);

  garage.appendChild(raceButtons);

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

  const changeStatePage = (currentPage: number) => {
    state.page = currentPage;
  };

  const pagination = createPagination(
    'garage-',
    state.page,
    changeStatePage,
    async (currentPage) => {
      onPageChange(currentPage);
    },
  );

  state.subscribe(() => {
    if (state.animation === true) {
      pagination.disableButtons();
    }
    if (state.animation === false) {
      pagination.enableButtons();
    }
  });

  garage.appendChild(pagination.el);

  garage.appendChild(cars);

  raceButton.addEventListener('click', () => {
    state.currentWinner = undefined;
    state.animation = true;
    state.broadcast(state);

    raceButton.disabled = true;
    raceButton.classList.add('disabled');
    resetButton.disabled = true;
    resetButton.classList.add('disabled');
    generateButton.disabled = true;
    generateButton.classList.add('disabled');

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
        state.winners = await getWinners({
          page: state.winnersPage,
          sort: state.sortBy,
          order: state.sortOrder,
        });
        state.broadcast(state);

        resetButton.disabled = false;
        resetButton.classList.remove('disabled');
      })
      .catch((err) => {
        console.error(err);
      });
  });

  resetButton.addEventListener('click', () => {
    generateButton.disabled = false;
    generateButton.classList.remove('disabled');

    const promises = state.cars.map(async (el) => {
      await stopRace(el.id);
      await stopRaceAnimation(el.id);
      resetRaceAnimation(el.id);
    });

    Promise.all(promises)
      .then(async () => {
        updateCars(state.cars);
        raceButton.disabled = false;
        raceButton.classList.remove('disabled');
        state.animation = false;
      })
      .catch((err) => {
        console.error(err);
      });
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
    state.count = currentCars.count;
    state.totalPages = Math.ceil(state.count / carsPerPage);
  });

  return { el: garage, updateCars };
};
