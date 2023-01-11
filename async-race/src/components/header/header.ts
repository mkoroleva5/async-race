import { createViewOptions } from '../view/view';
import './header.css';

export const createHeader = () => {
  const header = document.createElement('header');
  const view = createViewOptions();
  header.appendChild(view);
  return header;
};
