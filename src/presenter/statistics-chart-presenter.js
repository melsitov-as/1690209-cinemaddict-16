import { renderBeforeEnd } from '../render';
import { getStatistics } from '../utils/statistics';
import { BAR_HEIGHT} from '../const.js';
import StatisticsView from '../view/statistics-view.js';
import { removeElement } from '../render.js';
import dayjs  from 'dayjs';


export default class StatisticsChartPresenter {
  #container = null;
  #statistics = null;
  #statisticsView = null;
  #currentInterval = 'all-time';
  #films = null;
  #watchedFilms = null;
  #gap = 0;
  #toCount = [];

  constructor(container, films) {
    this.#container = container;
    this.#films = films;
    this.#watchedFilms = this.#getWatchedFilms(this.#films);
    this.#statistics = getStatistics(this.#watchedFilms);
    this.#statisticsView = new StatisticsView(BAR_HEIGHT, this.#statistics, this.#getCurrentInterval);

  }

  init = () => {
    renderBeforeEnd(this.#container, this.#statisticsView);
    this.#statisticsView.setFilmsChart();
    this.#statisticsView.setIntervalHandler();
  }

  get films() {
    return this.#films;
  }

  destroy() {
    removeElement(this.#statisticsView);
  }

  #getCurrentInterval = (data) => {
    this.#currentInterval = data;
    this.#workOnIntervals();
    this.#filterByInterval();
    this.#rerenderStatisticsChart();
  }

  #workOnIntervals = () => {
    switch (this.#currentInterval.value) {
      case 'all-time':
        this.#gap = 0;
        break;
      case 'today':
        this.#gap = 1;
        break;
      case 'week':
        this.#gap = 7;
        break;
      case 'month':
        this.#gap = 30;
        break;
      case 'year':
        this.#gap = 365;
        break;
    }
  }

  #filterByInterval = () => {
    const refDate = dayjs().add(-this.#gap, 'day');
    this.#toCount = this.#watchedFilms.filter((item) => item.dateWatched.diff(refDate) >= this.#gap);
  }

  #getWatchedFilms = (data) => data.filter((item) => item.isWatched);

  #rerenderStatisticsChart = () => {
    if (this.#gap === 0) {
      this.#watchedFilms = this.#getWatchedFilms(this.#films);
    } else if (this.#gap > 0) {
      this.#watchedFilms = this.#getWatchedFilms(this.#toCount);
    }
    this.destroy();
    this.#statistics = getStatistics(this.#watchedFilms);
    this.#statisticsView = new StatisticsView(BAR_HEIGHT, this.#statistics, this.#getCurrentInterval);
    this.init();
    this.#watchedFilms = this.#getWatchedFilms(this.#films);
  }
}
