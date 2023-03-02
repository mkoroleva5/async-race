import { Car, deleteCar, deleteWinner, getWinners, startRace, stopRace } from '../components/api';
import { createCarSvg } from './createCarSvg';
import { createElement } from './createElementHelper';
import playIcon from '../assets/icons/play.svg';
import stopIcon from '../assets/icons/stop.svg';
import finishIcon from '../assets/icons/flag.svg';
import flameIcon from '../assets/icons/flame-icon.svg';
import { state } from '../components/store';
import { startRaceAnimation } from './raceAnimations';

interface CreateCarsProps {
  carsArray: Car[];
  onCarRemove: () => void;
}

export const createCars = ({ carsArray, onCarRemove }: CreateCarsProps) => {
  const cars = createElement('div', { className: 'cars-wrapper' });

  const generateCar = (el: Car) => {
    const car = createElement('div', { className: 'car-wrapper' });

    const carInfo = createElement('div', { className: 'car-info' });
    const selectButton = createElement('button', {
      className: 'button select-button',
    });
    const removeButton = createElement('button', {
      className: 'button remove-button',
    });
    selectButton.innerHTML = 'select';
    removeButton.innerHTML = 'remove';
    const carTitle = createElement('p', { className: 'car-title' });
    carTitle.textContent = el.name;

    car.appendChild(carInfo);
    carInfo.appendChild(selectButton);
    carInfo.appendChild(removeButton);
    carInfo.appendChild(carTitle);

    selectButton.addEventListener('click', () => {
      state.selectedCar = el;
    });

    const removeCar = async () => {
      try {
        await deleteCar(el.id);
        onCarRemove();
        state.cars = carsArray;
        state.count -= 1;
        state.totalPages = Math.ceil(state.count / 7);
      } catch (err) {
        console.log(err);
      }
    };

    removeButton.addEventListener('click', async () => {
      await removeCar();
      await deleteWinner(el.id);
      state.winners = await getWinners({
        page: state.winnersPage,
        sort: state.sortBy,
        order: state.sortOrder,
      });
    });

    const raceField = createElement('div', { className: 'race-field' });
    const startButton = createElement('button', {
      className: `action-button start-button start-button-${el.id}`,
    });
    const stopButton = createElement('button', {
      className: `action-button stop-button stop-button-${el.id}`,
    });
    stopButton.disabled = true;
    const playImg = createElement('img', { className: 'play-img' });
    playImg.setAttribute('src', playIcon);
    playImg.setAttribute('alt', 'Play');
    const stopImg = createElement('img', { className: 'stop-img' });
    stopImg.setAttribute('src', stopIcon);
    stopImg.setAttribute('alt', 'Stop');

    const carImage = createElement('div', { className: `car-image car-${el.id}` });
    const carSvg = createCarSvg(el.color);
    carImage.innerHTML = carSvg;

    const flame = createElement('img', { className: `flame flame-${el.id}` });
    flame.setAttribute('src', flameIcon);
    carImage.appendChild(flame);

    startButton.addEventListener('click', async () => {
      state.singleAnimations = { ...state.singleAnimations, [el.id]: true };
      const { velocity, distance } = await startRace(el.id);
      const time = Math.round(distance / velocity);
      await startRaceAnimation(el.id, time);
    });

    stopButton.addEventListener('click', async () => {
      delete state.singleAnimations[el.id];
      await stopRace(el.id);

      stopButton.disabled = true;
      stopButton.style.backgroundColor = '#c9c9c9';
      startButton.disabled = false;
      startButton.style.backgroundColor = 'var(--bg-color)';

      carImage.style.animationPlayState = 'paused';
      carImage.classList.remove('race');
      carImage.classList.remove('rotate');
    });

    const updateButtonsView = () => {
      state.subscribe(() => {
        if (state.animation === true) {
          startButton.disabled = true;
          startButton.classList.add('disabled-car-button');
          stopButton.disabled = true;
          stopButton.classList.add('disabled-car-button');
          selectButton.disabled = true;
          selectButton.classList.add('disabled');
          removeButton.disabled = true;
          removeButton.classList.add('disabled');
        }
        if (state.animation === false) {
          startButton.disabled = false;
          startButton.classList.remove('disabled-car-button');
          stopButton.disabled = false;
          stopButton.classList.remove('disabled-car-button');
          selectButton.disabled = false;
          selectButton.classList.remove('disabled');
          removeButton.disabled = false;
          removeButton.classList.remove('disabled');
        }
      });
    };

    updateButtonsView();

    car.appendChild(raceField);
    raceField.appendChild(startButton);
    startButton.appendChild(playImg);
    raceField.appendChild(stopButton);
    stopButton.appendChild(stopImg);
    raceField.appendChild(carImage);

    const raceLine = createElement('div', { className: 'race-line' });
    const finishImg = createElement('img', { className: `finish-img finish-${el.id}` });
    finishImg.setAttribute('src', finishIcon);
    finishImg.setAttribute('alt', 'Finish');
    raceLine.appendChild(finishImg);
    car.appendChild(raceLine);

    cars.appendChild(car);
    return { element: cars, updateButtonsView };
  };

  carsArray.map(async (el) => {
    generateCar(el);
  });

  return cars;
};
