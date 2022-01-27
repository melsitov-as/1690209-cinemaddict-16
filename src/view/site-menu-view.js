import AbstractView from './abstract-view.js';

const cssClass = (link, current)=> link===current? ' main-navigation__item--active': '';
const cssClassStats = (link, active) => link===active? ' main-navigation__additional--active': '';

const createSiteMenuTemplate = (filters, currentFilter, isStatsActive) => `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item${cssClass('all', currentFilter)}">All movies</a>
      <a href="#watchlist" class="main-navigation__item${cssClass('watchlist', currentFilter)}">Watchlist <span class="main-navigation__item-count">${filters.inWatchlist}</span></a>
      <a href="#history" class="main-navigation__item${cssClass('history', currentFilter)}">History <span class="main-navigation__item-count">${filters.inHistory}</span></a>
      <a href="#favorites" class="main-navigation__item${cssClass('favorites', currentFilter)}">Favorites <span class="main-navigation__item-count">${filters.inFavorites}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional${cssClassStats('active', isStatsActive)}">Stats</a>
  </nav>`;


export default class SiteMenuView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #isStatsActive = null;

  constructor(filters, currentFilter, isStatsActive) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#isStatsActive = isStatsActive;
  }

  get template() {
    return createSiteMenuTemplate(this.#filters, this.#currentFilter, this.#isStatsActive);
  }

  get element(){
    const result = super.element;

    result.addEventListener('click',(evt)=>{
      const {href} = evt.target;
      if(href){
        const parts = href.split('#');
        this.notify(parts[1]);
      }

    });

    return result;
  }

  #statsHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  setShowStatsHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.main-navigation__additional').addEventListener('click', this.#statsHandler);
  }
}
