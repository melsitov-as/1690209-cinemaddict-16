import MoviesBoardPresenter from './presenter/movies-presenter.js';

const main = document.querySelector('.main');

new MoviesBoardPresenter(main).init();
