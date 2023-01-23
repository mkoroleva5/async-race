import { createElement } from '../../utils/createElementHelper';
import { generateName } from '../../utils/generateName';
import { Car, createCar, updateCar } from '../api';
import { state } from '../store';
import './input.css';

export const createInput = (
  carsArray: Car[],
  buttonName: string,
  color: string,
  callback: () => void,
) => {
  const inputWrapper = createElement('form', 'input-wrapper'); // --------- блокировать инпут до селекта

  const textInput = createElement(
    'input',
    `text-input ${buttonName}-car-input`,
  ) as HTMLInputElement;
  textInput.type = 'text';

  const colorInput = createElement(
    'input',
    `color-input ${buttonName}-color-input`,
  ) as HTMLInputElement;
  colorInput.type = 'color';
  colorInput.value = color;

  const submitButton = createElement(
    'button',
    `submit-button ${buttonName}-button`,
  ) as HTMLButtonElement;
  submitButton.textContent = buttonName;

  inputWrapper.appendChild(textInput);
  inputWrapper.appendChild(colorInput);
  inputWrapper.appendChild(submitButton);

  if (textInput.classList.contains('update-car-input')) {
    state.subscribe(() => {
      if (state.selectedCar) {
        textInput.value = state.selectedCar.name;
        colorInput.value = state.selectedCar.color;
      }
    });
  }

  state.subscribe(() => {
    if (state.animation === true) {
      submitButton.disabled = true;
      submitButton.classList.add('disabled');
    }
    if (state.animation === false) {
      submitButton.disabled = false;
      submitButton.classList.remove('disabled');
    }
  });

  submitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    if (buttonName === 'create') {
      if (textInput.value === '') {
        await createCar({
          name: generateName(),
          color: colorInput.value,
        });
      } else {
        await createCar({ name: textInput.value, color: colorInput.value });
      }
      textInput.value = '';
      state.cars = carsArray;
      callback();
    }
    if (buttonName === 'update') {
      const car = state.selectedCar;
      if (textInput.value && car) {
        await updateCar(car.id, { name: textInput.value, color: colorInput.value });
      }
      textInput.value = '';
      state.cars = carsArray;
      callback();
    }
  });
  return inputWrapper;
};
