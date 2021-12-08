import { getDuration } from '../utils/common.js';
import { addStatus } from '../utils/common.js';
import { createElement } from "../render.js";

export const createSiteFilmCardTemplate = (filmCardData) => {
  const durationInHM = getDuration(filmCardData.totalDuration);
  const status = addStatus(filmCardData);
  return `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${filmCardData.title}</h3>
    <p class="film-card__rating">${filmCardData.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${filmCardData.year}</span>
      <span class="film-card__duration">${durationInHM}</span>
      <span class="film-card__genre">${filmCardData.genre}</span>
    </p>
    <img src="./images/posters/${filmCardData.image}" alt="" class="film-card__poster">
    <p class="film-card__description">${filmCardData.shortDescription}</p>
    <span class="film-card__comments">${filmCardData.commentsCount} ${filmCardData.commentsTitle}</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${status.isInWatchlistActive}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${status.isWatchedActive}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${status.isInFavoritesActive}" type="button">Mark as favorite</button>
  </div>
</article>`;
};


export default class SiteFilmCardView {
  #element = null;
  #filmCardData = null;

  constructor(filmCardData) {
    this.#filmCardData = filmCardData;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element
  }

  get template() {
    return createSiteFilmCardTemplate(this.#filmCardData);
  }


  get filmCardData() {
    return this.#filmCardData;
  }

  removeElement() {
    this.#element = null;
  }
}
