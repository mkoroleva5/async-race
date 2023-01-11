import { getLS, setLS } from '../../utils/localStorageHelpers';
import './view.css';

export const createViewOptions = () => {
  const view = document.createElement('div');
  view.className = 'view-wrapper';
  const options = ['Garage', 'Winners'];

  options.map((el) => {
    const viewOption = document.createElement('div');
    const viewInput = document.createElement('input');
    const viewLabel = document.createElement('label');
    viewOption.className = 'view-option';
    viewInput.className = 'view-input';
    viewLabel.className = 'view-label';

    viewInput.setAttribute('type', 'radio');
    viewInput.setAttribute('name', 'view');
    viewInput.setAttribute('id', el);
    viewLabel.setAttribute('for', el);
    viewLabel.innerHTML = el;

    viewInput.addEventListener('input', () => {
      setLS('view', el);
    });

    if (!getLS('view')) setLS('view', 'Garage');
    if (getLS('view') === el) viewInput.checked = true;

    viewOption.appendChild(viewInput);
    viewOption.appendChild(viewLabel);
    view.appendChild(viewOption);
    return view;
  });

  return view;
};
