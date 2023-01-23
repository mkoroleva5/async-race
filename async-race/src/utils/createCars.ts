import { Car, deleteCar, startRace } from '../components/api';
import { createCarSvg } from './createCarSvg';
import { createElement } from './createElementHelper';
import playIcon from '../assets/icons/play.svg';
import stopIcon from '../assets/icons/stop.svg';
import finishIcon from '../assets/icons/flag.svg';
import flameIcon from '../assets/icons/flame-icon.svg';
import { state } from '../components/store';
import { startRaceAnimation, stopRaceAnimation } from './raceAnimations';

interface CreateCarsProps {
  carsArray: Car[];
  onCarRemove: () => void;
}

export const createCars = ({ carsArray, onCarRemove }: CreateCarsProps) => {
  const cars = createElement('div', 'cars-wrapper');

  carsArray.map(async (el) => {
    const car = createElement('div', 'car-wrapper');

    const carInfo = createElement('div', 'car-info');
    const selectButton = createElement('button', 'button select-button');
    const removeButton = createElement('button', 'button remove-button');
    selectButton.innerHTML = 'select';
    removeButton.innerHTML = 'remove';
    const carTitle = createElement('p', 'car-title');
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
    });

    const raceField = createElement('div', 'race-field');
    const startButton = createElement(
      'button',
      `action-button start-button start-button-${el.id}`,
    ) as HTMLButtonElement;
    const stopButton = createElement(
      'button',
      `action-button stop-button stop-button-${el.id}`,
    ) as HTMLButtonElement;
    stopButton.disabled = true;
    const playImg = createElement('img', 'play-img');
    playImg.setAttribute('src', playIcon);
    playImg.setAttribute('alt', 'Play');
    const stopImg = createElement('img', 'stop-img');
    stopImg.setAttribute('src', stopIcon);
    stopImg.setAttribute('alt', 'Stop');

    const carImage = createElement('div', `car-image car-${el.id}`);
    const carSvg = createCarSvg(el.color);
    carImage.innerHTML = carSvg;

    const flame = createElement('img', `flame flame-${el.id}`);
    flame.setAttribute('src', flameIcon);
    carImage.appendChild(flame);

    startButton.addEventListener('click', async () => {
      const { velocity, distance } = await startRace(el.id);
      const time = Math.round(distance / velocity);
      startRaceAnimation(el.id, time);
    });

    stopButton.addEventListener('click', async () => {
      await stopRaceAnimation(el.id);
    });

    carImage.addEventListener('transitionend', () => {
      stopButton.disabled = true;
      stopButton.style.backgroundColor = '#c9c9c9';

      startButton.disabled = false;
      startButton.style.backgroundColor = 'var(--bg-color)';
    });

    car.appendChild(raceField);
    raceField.appendChild(startButton);
    startButton.appendChild(playImg);
    raceField.appendChild(stopButton);
    stopButton.appendChild(stopImg);
    raceField.appendChild(carImage);

    const raceLine = createElement('div', 'race-line');
    const finishImg = createElement('img', `finish-img finish-${el.id}`);
    finishImg.setAttribute('src', finishIcon);
    finishImg.setAttribute('alt', 'Finish');
    raceLine.appendChild(finishImg);
    car.appendChild(raceLine);

    cars.appendChild(car);
    return car;
  });
  return cars;
};
