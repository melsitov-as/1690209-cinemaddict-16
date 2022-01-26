import MoviesBoardPresenter from './presenter/movies-presenter.js';
import MoviesModel from './model/movies-model.js';
import { getFilmCardMockData } from './mock/film-card-mock.js';
import { FILM_CARDS_COUNT } from './const.js';

const main = document.querySelector('.main');

const filmCards = Array.from({length: FILM_CARDS_COUNT}, getFilmCardMockData);

const moviesModel = new MoviesModel();
moviesModel.films = filmCards;
new MoviesBoardPresenter(main, moviesModel).init();


