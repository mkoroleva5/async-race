import { createElement } from '../../utils/createElementHelper';
import { getLS, setLS } from '../../utils/localStorageHelpers';
import { state } from '../store';
import './view.css';

export const createViewOptions = () => {
  const view = createElement('div', { className: 'view-wrapper' });
  const options = ['Garage', 'Winners'];

  options.map((el) => {
    const viewOption = createElement('div', { className: 'view-option' });
    const viewInput = createElement('input', {
      className: 'view-input',
      type: 'radio',
      name: 'view',
      id: el,
    });
    const viewLabel = createElement('label', {
      className: 'view-label',
      innerHTML: el,
      htmlFor: el,
    });

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
