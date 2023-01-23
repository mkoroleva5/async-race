import { createElement } from '../../utils/createElementHelper';
import { state } from '../store';
import arrowIcon from '../../assets/icons/chevron.svg';
import './winnersPagination.css';
import { getWinners } from '../api';

export const createWinnersPagination = () => {
  let currentPage = state.winnersPage || 1;

  const pageWrapper = createElement('div', 'winners-page-wrapper');
  const page = createElement('p', 'winners-page');
  page.textContent = `${currentPage}`;

  const prevPageButton = createElement('button', 'winners-switch-button') as HTMLButtonElement;
  const nextPageButton = createElement('button', 'winners-switch-button') as HTMLButtonElement;

  const prevPageImg = createElement('img', 'winners-prev-arrow-img');
  prevPageImg.setAttribute('src', arrowIcon);
  prevPageImg.setAttribute('alt', 'Prev page');
  prevPageButton.appendChild(prevPageImg);

  const nextPageImg = createElement('img', 'winners-next-arrow-img');
  nextPageImg.setAttribute('src', arrowIcon);
  nextPageImg.setAttribute('alt', 'Next page');
  nextPageButton.appendChild(nextPageImg);

  pageWrapper.appendChild(prevPageButton);
  pageWrapper.appendChild(page);
  pageWrapper.appendChild(nextPageButton);

  prevPageButton.addEventListener('click', async () => {
    if (currentPage > 1) currentPage -= 1;
    page.textContent = `${currentPage}`;
    state.winnersPage = currentPage;
    state.winners = await getWinners({
      page: state.winnersPage,
      sort: state.sortBy,
      order: state.sortOrder,
    });
    state.broadcast(state);
  });

  nextPageButton.addEventListener('click', async () => {
    if (currentPage < Math.ceil(state.winners.count / 10)) currentPage += 1;
    page.textContent = `${currentPage}`;
    state.winnersPage = currentPage;
    state.winners = await getWinners({
      page: state.winnersPage,
      sort: state.sortBy,
      order: state.sortOrder,
    });
    state.broadcast(state);
  });

  return pageWrapper;
};
