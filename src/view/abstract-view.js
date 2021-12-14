import { createElement } from '../render.js';

export default class AbstractView {
  #element = null;
  _callback = {};
  _callbackWatchlist = {};
  _callbackWatched = {};
  _callbackInFavorites = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  get isElementCreated() {
    return this.#element !== null;
  }

  removeElement() {
    this.#element = null;
  }
}
