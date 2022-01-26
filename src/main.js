import MoviesBoardPresenter from './presenter/movies-presenter.js';
import MoviesModel from './model/movies-model.js';
import { getFilmCardMockData } from './mock/film-card-mock.js';
import { FILM_CARDS_COUNT, BAR_HEIGHT } from './const.js';
// import StatisticsView from './view/statistics-view';
import { replaceElement, renderBeforeEnd } from './render.js';
import { getTopGenre  } from './utils/statistics.js';
// import { getStatistics } from './utils/statistics.js';

const main = document.querySelector('.main');

const filmCards = Array.from({length: FILM_CARDS_COUNT}, getFilmCardMockData);

const moviesModel = new MoviesModel();
moviesModel.films = filmCards;
// const statistics = getStatistics(moviesModel.films);
new MoviesBoardPresenter(main, moviesModel).init();


// const statisticsAndChart = new StatisticsView(moviesModel.films, BAR_HEIGHT, statistics);


// renderBeforeEnd(main, statisticsAndChart);

// console.log(statisticsAndChart.template);

