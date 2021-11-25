import { createSiteRatingTemplate} from './view/site-rating-view.js';
import { createSiteMenuTemplate} from './view/site-menu-view.js';
import { createSiteSortTemplate} from './view/site-sort-view.js';
import { createSiteFilmsTemplate} from './view/site-films-view.js';
import { createShowMoreTemplate} from './view/site-show-more-view.js';
import { createSiteAllFilmsTemplate} from './view/site-all-films-list-view.js';
import { createSiteFilmCardTemplate} from './view/site-film-card-view.js';
import { createSiteTopRatedFilmsTemplate} from './view/site-top-rated-view.js';
import { createSiteMostCommentedFilmsTemplate} from './view/site-most-commented-view.js';
import { createPopupTemplate} from './view/site-popup-view.js';
import { renderTemplate,  RenderPosition} from './render.js';

const renderBeforeEnd = (container, template) => renderTemplate(container, template, RenderPosition.BEFOREEND);

const renderFilmItems = (container, count) => {
  Array(count).fill(0).forEach(() => renderBeforeEnd(container, createSiteFilmCardTemplate()));
};
const renderAllFilms = (container) => {
  renderBeforeEnd(container, createSiteAllFilmsTemplate());
  renderFilmItems(container.querySelector('.films-list__container'), 5);
  renderBeforeEnd(container, createShowMoreTemplate());
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
  renderBeforeEnd(container, createSiteMenuTemplate());
  renderBeforeEnd(container, createSiteSortTemplate());
  renderBeforeEnd(container, createSiteFilmsTemplate());
  renderFilms(container.querySelector('.films'));
};

renderBeforeEnd(
  document.querySelector('.header'),
  createSiteRatingTemplate(),
);

renderSite(document.querySelector('.main'));

renderBeforeEnd(
  document.querySelector('body'),
  createPopupTemplate(),
);
