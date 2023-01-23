import { createElement } from '../../utils/createElementHelper';
import { getLS, setLS } from '../../utils/localStorageHelpers';
import { state } from '../store';
import './view.css';

export const createViewOptions = () => {
  const view = createElement('div', 'view-wrapper');
  const options = ['Garage', 'Winners'];

  options.map((el) => {
    const viewOption = createElement('div', 'view-option');
    const viewInput = createElement('input', 'view-input') as HTMLInputElement;
    const viewLabel = createElement('label', 'view-label');

    viewInput.setAttribute('type', 'radio');
    viewInput.setAttribute('name', 'view');
    viewInput.setAttribute('id', el);
    viewLabel.setAttribute('for', el);
    viewLabel.innerHTML = el;

    viewInput.addEventListener('input', () => {
      setLS('view', el);
    });

    if (!getLS('view')) setLS('view', 'Garage');
    if (getLS('view') === el) {
      viewInput.checked = true;
    }

    state.subscribe(() => {
      if (state.animation === true) {
        viewInput.disabled = true;
        viewOption.classList.add('disabled-view');
        viewLabel.classList.add('disabled-view');
      }
      if (state.animation === false) {
        viewInput.disabled = false;
        viewOption.classList.remove('disabled-view');
        viewLabel.classList.remove('disabled-view');
      }
    });

    viewOption.appendChild(viewInput);
    viewOption.appendChild(viewLabel);
    view.appendChild(viewOption);
    return view;
  });

  return view;
};
