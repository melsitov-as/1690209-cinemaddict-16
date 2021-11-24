import {createSiteRatingTemplate} from './view/site-rating-view.js';
import {createSiteMenuTemplate} from './view/site-menu-view.js';
import {createSiteSortTemplate} from './view/site-sort-view.js';
import {createSiteFilmsTemplate} from './view/site-films-view.js';
import {createShowMoreTemplate} from './view/site-show-more-view.js';
import {createSiteAllFilmsTemplate} from './view/site-all-films-list-view.js';
import {createSiteFilmCardTemplate} from './view/site-film-card-view.js';
import {createSiteTopRatedFilmsTemplate} from './view/site-top-rated-view.js';
import {createSiteMostCommentedFilmsTemplate} from './view/site-most-commented-view.js';
import {createPopupTemplate} from './view/site-popup-view.js';
import {renderTemplate, RenderPosition} from './render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteBodyElement = document.querySelector('body');

renderTemplate(siteHeaderElement, createSiteRatingTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteFilmsTemplate(), RenderPosition.BEFOREEND);

const siteFilmsElement = document.querySelector('.films');

renderTemplate(siteFilmsElement, createSiteAllFilmsTemplate(), RenderPosition.BEFOREEND);

const allFilmsContainer = document.querySelector('.films-list__container');

for (let ii = 0; ii < 5; ii++) {
  renderTemplate(allFilmsContainer, createSiteFilmCardTemplate(), RenderPosition.BEFOREEND);
}

const allFilmsListElement = document.querySelector('.films-list');

renderTemplate(allFilmsListElement, createShowMoreTemplate(), RenderPosition.BEFOREEND);

renderTemplate(siteFilmsElement, createSiteTopRatedFilmsTemplate(), RenderPosition.BEFOREEND);

const topRatedContainer = document.querySelector('.films-list--top-rated').querySelector('.films-list__container');

for (let ii = 0; ii < 2; ii++) {
  renderTemplate(topRatedContainer, createSiteFilmCardTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(siteFilmsElement, createSiteMostCommentedFilmsTemplate(), RenderPosition.BEFOREEND);

const mostCommentedContainer = document.querySelector('.films-list--most-commented').querySelector('.films-list__container');

for (let ii = 0; ii < 2; ii++) {
  renderTemplate(mostCommentedContainer, createSiteFilmCardTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(siteBodyElement, createPopupTemplate(), RenderPosition.BEFOREEND);
