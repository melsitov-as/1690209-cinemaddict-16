import { getDuration } from '../utils/common.js';
import { addStatus } from '../utils/common.js';
import AbstractView from './abstract-view.js';

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

export default class SiteFilmCardView extends AbstractView {
  #filmCardData = null;

  constructor(filmCardData) {
    super();
    this.#filmCardData = filmCardData;
  }

  get template() {
    return createSiteFilmCardTemplate(this.#filmCardData);
  }

  get filmCardData() {
    return this.#filmCardData;
  }

  setShowPopupHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__comments').addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  #isInWatchlistHandler = () => {
    this._callbackWatchlist.click();
  }

  #isWatchedHandler = () => {
    this._callbackWatched.click();
  }

  #isInFavoritesHandler = () => {
    this._callbackInFavorites.click();
  }

  setWatchedHandler(callback) {
    this._callbackWatched.click = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#isWatchedHandler);
  }

  setWatchlistHandler(callback) {
    this._callbackWatchlist.click = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#isInWatchlistHandler);
  }

  setFavoritesHandler(callback) {
    this._callbackInFavorites.click = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#isInFavoritesHandler);
  }
}
