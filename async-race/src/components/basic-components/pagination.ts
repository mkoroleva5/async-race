import { createElement } from '../../utils/createElementHelper';
import arrowIcon from '../../assets/icons/chevron.svg';
import './pagination.css';
import { state } from '../store';

export const createPagination = (
  className: string,
  statePage: number,
  changeState: (currentPage: number) => void,
  callback?: (page: number) => void,
) => {
  let currentPage = statePage || 1;

  const pageWrapper = createElement('div', { className: `${className}page-wrapper` });
  const page = createElement('p', { className: 'page', textContent: `${currentPage}` });

  const prevPageButton = createElement('button', {
    className: 'switch-button',
  });
  const nextPageButton = createElement('button', {
    className: 'switch-button',
  });

  const prevPageImg = createElement('img', {
    className: 'prev-arrow-img',
    src: arrowIcon,
    alt: 'Prev page',
  });
  prevPageButton.appendChild(prevPageImg);

  const nextPageImg = createElement('img', {
    className: 'next-arrow-img',
    src: arrowIcon,
    alt: 'Next page',
  });
  nextPageButton.appendChild(nextPageImg);

  pageWrapper.appendChild(prevPageButton);
  pageWrapper.appendChild(page);
  pageWrapper.appendChild(nextPageButton);

  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) currentPage -= 1;
    page.textContent = `${currentPage}`;
    changeState(currentPage);
    if (callback) callback(currentPage);
    state.broadcast(state);
  });

  nextPageButton.addEventListener('click', () => {
    const totalPages =
      className === 'garage-' ? state.totalPages : Math.ceil(state.winners.count / 10);
    if (currentPage < totalPages) currentPage += 1;
    page.textContent = `${currentPage}`;
    changeState(currentPage);
    if (callback) callback(currentPage);
    state.broadcast(state);
  });

  const disableButtons = () => {
    prevPageButton.disabled = true;
    nextPageButton.disabled = true;
    prevPageButton.classList.add('disabled-page-button');
    nextPageButton.classList.add('disabled-page-button');
  };

  const enableButtons = () => {
    prevPageButton.disabled = false;
    nextPageButton.disabled = false;
    prevPageButton.classList.remove('disabled-page-button');
    nextPageButton.classList.remove('disabled-page-button');
  };

  return { el: pageWrapper, disableButtons, enableButtons };
};
