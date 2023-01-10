import { createViewOptions } from '../view/view';
import './header.css';

/* global document */
export const createHeader = () => {
  const header = document.createElement('header');
  const view = createViewOptions();
  header.appendChild(view);
  return header;
};
