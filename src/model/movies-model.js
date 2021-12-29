import AbstractObservable from '../utils/abstract-observable.js';

export default class MoviesModel extends AbstractObservable {
  #films = [];

  set films(filmCards) {
    this.#films = [...filmCards];
  }

  get films() {
    return this.#films;
  }
}
