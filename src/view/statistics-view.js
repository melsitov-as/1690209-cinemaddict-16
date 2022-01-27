// import dayjs  from 'dayjs';
// import flatpickr from 'flatpickr';
import AbstractView from './abstract-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


// import '../../node_modules/flatpickr/dist/flatpickr.min.css';


const renderFilmsChart = (statistics, statisticCtx) => new Chart(statisticCtx, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: ['Drama', 'Mystery', 'Comedy', 'Cartoon', 'Western', 'Musical'],
    datasets: [{
      data: [statistics.drama, statistics.mystery, statistics.comedy, statistics.cartoon, statistics.western, statistics.musical],
      backgroundColor: '#ffe800',
      hoverBackgroundColor: '#ffe800',
      anchor: 'start',
      barThickness: 24,
    }],
  },
  options: {
    responsive: false,
    plugins: {
      datalabels: {
        font: {
          size: 20,
        },
        color: '#ffffff',
        anchor: 'start',
        align: 'start',
        offset: 40,
      },
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#ffffff',
          padding: 100,
          fontSize: 20,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});

const createStatisticsTemplate = (statistics) => `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${statistics.allFilmsWatched}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${statistics.totalDurationH} <span class="statistic__item-description">h</span> ${statistics.totalDurationM} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${statistics.topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;


export default class StatisticsView extends AbstractView {
  #barHeight = null;
  #statisticCtx = null;
  #getCurrentInterval = null

  constructor(barHeight, statistics, getCurrentInterval) {
    super();
    this.#barHeight = barHeight;
    this._statistics = statistics;
    this.#getCurrentInterval = getCurrentInterval;

  }

  get template() {
    return createStatisticsTemplate(this._statistics);
  }

  #intervalHandler = (evt) => {
    this.#getCurrentInterval(evt.target);
    evt.target.checked = true;
  }

  setIntervalHandler = () => {
    const inputs = this.element.querySelectorAll('.statistic__filters-input');
    inputs.forEach((input) => input.addEventListener('click', this.#intervalHandler));
  }

  setFilmsChart = () => {
    this.#statisticCtx = this.element.querySelector('.statistic__chart');
    this.#statisticCtx.height = this.#barHeight * 6;
    renderFilmsChart(this._statistics, this.#statisticCtx);
  }
}
