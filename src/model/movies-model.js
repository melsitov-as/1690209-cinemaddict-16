import AbstractObservable from '../utils/abstract-observable.js';

export default class MoviesModel extends AbstractObservable {
  #apiService = null;
  #films = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;

    this.#apiService.films.then((films) => {
      console.log(films);
    });

    this.#apiService.comments.then((comments) => {
      console.log(comments);
    });
  }

  set films(filmCards) {

    this.#films = [...filmCards];
  }

  get films() {
    return this.#films;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
