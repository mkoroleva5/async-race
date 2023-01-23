import { createElement } from '../../utils/createElementHelper';
import arrowIcon from '../../assets/icons/chevron.svg';
import './pagination.css';
import { state } from '../store';

export const createPagination = (callback: (page: number) => void) => {
  let currentPage = state.page || 1;

  const pageWrapper = createElement('div', 'page-wrapper');
  const page = createElement('p', 'page');
  page.textContent = `${currentPage}`;

  const prevPageButton = createElement('button', 'switch-button') as HTMLButtonElement;
  const nextPageButton = createElement('button', 'switch-button') as HTMLButtonElement;

  const prevPageImg = createElement('img', 'prev-arrow-img');
  prevPageImg.setAttribute('src', arrowIcon);
  prevPageImg.setAttribute('alt', 'Prev page');
  prevPageButton.appendChild(prevPageImg);

  const nextPageImg = createElement('img', 'next-arrow-img');
  nextPageImg.setAttribute('src', arrowIcon);
  nextPageImg.setAttribute('alt', 'Next page');
  nextPageButton.appendChild(nextPageImg);

  pageWrapper.appendChild(prevPageButton);
  pageWrapper.appendChild(page);
  pageWrapper.appendChild(nextPageButton);

  state.subscribe(() => {
    if (state.animation === true) {
      prevPageButton.disabled = true;
      prevPageButton.classList.add('disabled-page-button');
      nextPageButton.disabled = true;
      nextPageButton.classList.add('disabled-page-button');
    }
    if (state.animation === false) {
      prevPageButton.disabled = false;
      prevPageButton.classList.remove('disabled-page-button');
      nextPageButton.disabled = false;
      nextPageButton.classList.remove('disabled-page-button');
    }
  });
  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) currentPage -= 1;
    page.textContent = `${currentPage}`;
    state.page = currentPage;
    callback(currentPage);
    state.broadcast(state);
  });

  nextPageButton.addEventListener('click', () => {
    if (currentPage < state.totalPages) currentPage += 1;
    page.textContent = `${currentPage}`;
    state.page = currentPage;
    callback(currentPage);
    state.broadcast(state);
  });

  return pageWrapper;
};
