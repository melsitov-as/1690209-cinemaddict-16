import MoviesBoardPresenter from './presenter/movies-presenter.js';
import MoviesModel from './model/movies-model.js';
import { getFilmCardMockData } from './mock/film-card-mock.js';
import { FILM_CARDS_COUNT } from './const.js';
import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic rgsdrlgnrsdnSDFFGDSFll';
const END_POINT_MOVIES = 'https://16.ecmascript.pages.academy/cinemaddict/movies';
const END_POINT_COMMENTS = 'https://16.ecmascript.pages.academy/cinemaddict/comments';

const main = document.querySelector('.main');

const filmCards = Array.from({length: FILM_CARDS_COUNT}, getFilmCardMockData);

const moviesModel = new MoviesModel(new ApiService(END_POINT_MOVIES, END_POINT_COMMENTS, AUTHORIZATION));
moviesModel.films = filmCards;
new MoviesBoardPresenter(main, moviesModel).init();
