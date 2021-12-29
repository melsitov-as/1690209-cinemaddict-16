import MoviesBoardPresenter from './presenter/movies-presenter.js';
import MoviesModel from './model/movies-model.js';
import { getFilmCardMockData } from './mock/film-card-mock.js';

const FILM_CARDS_COUNT = 48;

const main = document.querySelector('.main');

const filmCards = Array.from({length: FILM_CARDS_COUNT}, getFilmCardMockData);

const moviesModel = new MoviesModel();
moviesModel.films = filmCards;
new MoviesBoardPresenter(main, moviesModel).init();

// Комментарий для коммита

