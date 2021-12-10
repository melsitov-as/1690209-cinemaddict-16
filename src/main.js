import SiteRatingView from './view/site-rating-view.js';
import SiteMenuView from './view/site-menu-view.js';
import SiteSortView from './view/site-sort-view.js';
import SiteFilmsView from './view/site-films-view.js';
import SiteShowMoreView from './view/site-show-more-view.js';
import SiteAllFilmsView from './view/site-all-films-list-view.js';
import SiteFilmCardView from './view/site-film-card-view.js';
import SiteTopRatedFilmsView from './view/site-top-rated-view.js';
import SiteMostCommentedFilmsView from './view/site-most-commented-view.js';
import SitePopupView from './view/site-popup-view.js';
import { renderElement, RenderPosition } from './render.js';
import { getFilmCardMockData } from './mock/film-card-mock.js';
import { generateFilter } from './mock/filter.js';
import SitePopupCommentsView from './view/site-popup-comments-view.js';

const FILM_CARDS_COUNT = 42;
const FILM_CARDS_COUNT_PER_STEP = 5;

const body = document.querySelector('body');

let filmCards = null;
let filters = null;
const renderedFilmCards = [];

const renderBeforeEnd = (container, element) => renderElement(container, element, RenderPosition.BEFOREEND);

const renderFilmItems = (container, count) => {
  for (let ii = 0; ii < Math.min(filmCards.length, count); ii++) {
    const filmCard = new SiteFilmCardView(filmCards[ii]);
    renderBeforeEnd(container, filmCard.element);
    renderedFilmCards.push(filmCard);
  }
};

const initializeShowMoreClickHandler = (container, allFilmsContainer) => {
  let renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP;

  const showMoreButton = container.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', () => {
    filmCards
      .slice(renderedFilmCardsCount, renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP)
      .forEach((filmCard) => {
        const filmCardMore = new SiteFilmCardView(filmCard);
        renderBeforeEnd(allFilmsContainer, filmCardMore.element);
        renderedFilmCards.push(filmCardMore);
      });

    renderedFilmCardsCount += FILM_CARDS_COUNT_PER_STEP;

    if (renderedFilmCardsCount >= filmCards.length) {
      showMoreButton.remove();
    }
  });
};

const renderAllFilms = (container) => {
  renderBeforeEnd(container, new SiteAllFilmsView().element);
  const allFilmsContainer = container.querySelector('.films-list__container');
  renderFilmItems(allFilmsContainer, FILM_CARDS_COUNT_PER_STEP);

  if (filmCards.length > FILM_CARDS_COUNT_PER_STEP) {
    renderBeforeEnd(container, new SiteShowMoreView().element);
    initializeShowMoreClickHandler(container,allFilmsContainer);
  }
};

const renderTopRated = (container) => {
  renderBeforeEnd(container, new SiteTopRatedFilmsView().element);
  renderFilmItems(container.querySelector('.films-list--top-rated').querySelector('.films-list__container'), 2);
};

const renderMostCommented = (container) => {
  renderBeforeEnd(container, new SiteMostCommentedFilmsView().element);
  renderFilmItems(container.querySelector('.films-list--most-commented').querySelector('.films-list__container'), 2);
};

const renderFilms = (container) => {
  renderAllFilms(container);
  renderTopRated(container);
  renderMostCommented(container);
};

const renderComments = (container, filmCardData) => {
  filmCardData.comments.forEach((item) => {
    renderBeforeEnd(container, new SitePopupCommentsView(item).element);
  });
};

const initializePopupCloseButton = (filmDetailsData) => {
  const popupCloseButton = document.querySelector('.film-details__close-btn');

  popupCloseButton.addEventListener('click', () => {
    body.removeChild(filmDetailsData);
    body.classList.remove('hide-overflow');
  });
};

const renderPopup = (data) => {
  const filmDetails = new SitePopupView(data).element;

  renderBeforeEnd(
    document.querySelector('body'),
    filmDetails
  );

  body.classList.add('hide-overflow');

  renderComments(
    document.querySelector('.film-details__comments-list'),
    data
  );

  initializePopupCloseButton(filmDetails);
};

const initializeShowPopupLink = (filmCardsData) => {
  filmCardsData.forEach((item) => {
    item.element.querySelector('.film-card__comments').addEventListener('click', () => {
      renderPopup(item.filmCardData);
      body.classList.add('hide-overflow');
    });
  });
};

const renderSite = (container) => {
  renderBeforeEnd(container, new SiteMenuView(filters).element);
  renderBeforeEnd(container, new SiteSortView().element);
  renderBeforeEnd(container, new SiteFilmsView().element);
  renderFilms(container.querySelector('.films'));
  initializeShowPopupLink(renderedFilmCards);
};

filmCards = Array.from({length: FILM_CARDS_COUNT}, getFilmCardMockData);
filters = generateFilter(filmCards);

renderBeforeEnd(
  document.querySelector('header'),
  new SiteRatingView().element
);

renderSite(document.querySelector('.main'));
