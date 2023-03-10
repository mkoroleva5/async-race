import { createElement } from '../../utils/createElementHelper';
import { createViewOptions } from '../view/view';
import './header.css';

export const createHeader = () => {
  const header = createElement('header', { className: 'header' });
  const view = createViewOptions();
  header.appendChild(view);

  return {
    el: header,
    viewWrapper: view,
  };
};
