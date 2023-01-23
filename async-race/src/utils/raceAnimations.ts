import { saveWinner, setDrive } from '../components/api';
import { state } from '../components/store';

export const startRaceAnimation = async (id: number, time: number) => {
  const startButton = document.querySelector(`.start-button-${id}`) as HTMLButtonElement;
  startButton.disabled = true;
  startButton.style.backgroundColor = '#c9c9c9';

  const stopButton = document.querySelector(`.stop-button-${id}`) as HTMLButtonElement;
  stopButton.disabled = false;
  stopButton.style.backgroundColor = 'var(--bg-color)';

  const car = document.querySelector(`.car-${id}`) as HTMLElement;

  car.addEventListener('animationend', () => {
    if (!state.currentWinner) {
      state.currentWinner = { winner: state.cars.find((el) => el.id === id), time };
      const winnerPopup = document.querySelector<HTMLDivElement>('.winner-popup-wrapper');
      winnerPopup!.style.display = 'flex';

      saveWinner({ id: state.currentWinner.winner!.id, time }).catch((err) => {
        console.error(err);
      });
    }
  });

  car.style.animationDuration = `${time}ms`;
  car.classList.add('race');
  car.style.animationPlayState = 'running';

  try {
    await setDrive(id);
  } catch (err) {
    console.log(err);
    car.style.animationPlayState = 'paused';
    car.classList.add('rotate');
  }

  stopButton.disabled = true;
  stopButton.style.backgroundColor = '#c9c9c9';
  startButton.disabled = false;
  startButton.style.backgroundColor = 'var(--bg-color)';
};

export const stopRaceAnimation = async (id: number) => {
  const stopButton = document.querySelector(`.stop-button-${id}`) as HTMLButtonElement;
  stopButton.disabled = true;
  stopButton.style.backgroundColor = '#c9c9c9';

  const startButton = document.querySelector(`.start-button-${id}`) as HTMLButtonElement;
  startButton.disabled = false;
  startButton.style.backgroundColor = 'var(--bg-color)';

  const car = document.querySelector(`.car-${id}`) as HTMLElement;

  car.style.animationPlayState = 'paused';
  car.classList.remove('race');
  car.classList.remove('rotate');
};

export const resetRaceAnimation = (id: number) => {
  const car = document.querySelector(`.car-${id}`) as HTMLElement;

  car.classList.remove('race');
  car.classList.remove('rotate');
};
