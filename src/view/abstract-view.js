import { createElement } from '../render.js';

export default class AbstractView {
  #element = null;
  #callback = {};
  _callbackWatchlist = {};
  _callbackWatched = {};
  _callbackInFavorites = {};
  _callbackChangeComments = {};

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

  subscribe(name, callback){
    this.#callback[name] = callback;
  }

  unsubscribe(name){
    delete this.#callback[name];
  }

  notify(name, data){
    const callback = this.#callback[name];
    if(typeof callback === 'function'){
      callback(data);
    }
  }
}
