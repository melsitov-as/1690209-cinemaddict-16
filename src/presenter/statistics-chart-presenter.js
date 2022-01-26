import { renderBeforeEnd } from '../render';
import { getStatistics } from '../utils/statistics';
import { BAR_HEIGHT} from '../const.js';
import StatisticsView from '../view/statistics-view.js';
import dayjs  from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

export default class StatisticsChartPresenter {
  #container = null;
  #statistics = null;
  #statisticsView = null;
  #currentInterval = 'all-time';
  #films = null;


  constructor(container, films) {
    this.#container = container;
    this.#films = films;
    this.#statistics = getStatistics(this.films);
    this.#statisticsView = new StatisticsView(BAR_HEIGHT, this.#statistics, this.#getCurrentInterval);
    dayjs.extend(isSameOrAfter);
  }

  init = () => {
    renderBeforeEnd(this.#container, this.#statisticsView);
    this.#statisticsView.setFilmsChart();
    this.#statisticsView.setIntervalHandler(this.#handleInterval);
  }

  get films() {
    return this.#films;
  }

  #getCurrentInterval = (data) => {
    this.#currentInterval = data;
  }

  #handleInterval = () => {
    console.log('lol');
  }
}
