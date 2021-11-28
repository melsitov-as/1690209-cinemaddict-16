import { createSiteRatingTemplate } from './view/site-rating-view.js';
import { createSiteMenuTemplate } from './view/site-menu-view.js';
import { createSiteSortTemplate } from './view/site-sort-view.js';
import { createSiteFilmsTemplate } from './view/site-films-view.js';
import { createShowMoreTemplate } from './view/site-show-more-view.js';
import { createSiteAllFilmsTemplate } from './view/site-all-films-list-view.js';
import { createSiteFilmCardTemplate } from './view/site-film-card-view.js';
import { createSiteTopRatedFilmsTemplate } from './view/site-top-rated-view.js';
import { createSiteMostCommentedFilmsTemplate } from './view/site-most-commented-view.js';
import { createPopupTemplate } from './view/site-popup-view.js';
import { renderTemplate, RenderPosition } from './render.js';
import { getFilmCardMockData } from './mock/film-card-mock.js';
import { generateFilter } from './mock/filter.js';
import { createPopupCommentTemplate } from './view/site-comment-view.js';

const FILM_CARDS_COUNT = 15;
const FILM_CARDS_COUNT_PER_STEP = 5;

const filmCards = Array.from({length: FILM_CARDS_COUNT}, getFilmCardMockData);
const filters = generateFilter(filmCards);

const renderBeforeEnd = (container, template) => renderTemplate(container, template, RenderPosition.BEFOREEND);

const renderFilmItems = (container, count) => {
  for (let ii = 0; ii < Math.min(filmCards.length, count); ii++) {
    renderBeforeEnd(container, createSiteFilmCardTemplate(filmCards[ii]));
  }
};

const initializeShowMoreClickHandler = (container, allFilmsContainer) => {
  let renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP;

  const showMoreButton = container.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', () => {
    filmCards
      .slice(renderedFilmCardsCount, renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP)
      .forEach((filmCard) => renderBeforeEnd(allFilmsContainer, createSiteFilmCardTemplate(filmCard)));

    renderedFilmCardsCount += FILM_CARDS_COUNT_PER_STEP;

    if (renderedFilmCardsCount >= filmCards.length) {
      showMoreButton.remove();
    }
  });
};

const renderAllFilms = (container) => {
  renderBeforeEnd(container, createSiteAllFilmsTemplate());
  const allFilmsContainer = container.querySelector('.films-list__container');
  renderFilmItems(allFilmsContainer, FILM_CARDS_COUNT_PER_STEP);

  if (filmCards.length > FILM_CARDS_COUNT_PER_STEP) {
    renderBeforeEnd(container, createShowMoreTemplate());
    initializeShowMoreClickHandler(container,allFilmsContainer);
  }
};

const renderTopRated = (container) => {
  renderBeforeEnd(container, createSiteTopRatedFilmsTemplate());
  renderFilmItems(container.querySelector('.films-list--top-rated').querySelector('.films-list__container'), 2);
};

const renderMostCommented = (container) => {
  renderBeforeEnd(container, createSiteMostCommentedFilmsTemplate());
  renderFilmItems(container.querySelector('.films-list--most-commented').querySelector('.films-list__container'), 2);
};

const renderFilms = (container) => {
  renderAllFilms(container);
  renderTopRated(container);
  renderMostCommented(container);
};

const renderSite = (container) => {
  renderBeforeEnd(container, createSiteMenuTemplate(filters));
  renderBeforeEnd(container, createSiteSortTemplate());
  renderBeforeEnd(container, createSiteFilmsTemplate());
  renderFilms(container.querySelector('.films'));
};

const renderComments = (container, filmCardData) => {
  filmCardData.comments.forEach((item) => renderBeforeEnd(container, createPopupCommentTemplate(item)));
};

const renderPopup = (data) => {
  renderBeforeEnd(
    document.querySelector('body'),
    createPopupTemplate(data)
  );

  renderComments(
    document.querySelector('.film-details__comments-list'),
    data
  );
};

renderBeforeEnd(
  document.querySelector('header'),
  createSiteRatingTemplate()
);

renderSite(document.querySelector('.main'));


renderPopup(filmCards[0]);
