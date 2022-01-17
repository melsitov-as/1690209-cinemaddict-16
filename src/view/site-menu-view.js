import AbstractView from './abstract-view.js';

const cssClass = (link, current)=> link===current? ' main-navigation__item--active': '';

const createSiteMenuTemplate = (filters, currentFilter) => `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item${cssClass('all', currentFilter)}">All movies</a>
      <a href="#watchlist" class="main-navigation__item${cssClass('watchlist', currentFilter)}">Watchlist <span class="main-navigation__item-count">${filters.inWatchlist}</span></a>
      <a href="#history" class="main-navigation__item${cssClass('history', currentFilter)}">History <span class="main-navigation__item-count">${filters.inHistory}</span></a>
      <a href="#favorites" class="main-navigation__item${cssClass('favorites', currentFilter)}">Favorites <span class="main-navigation__item-count">${filters.inFavorites}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;


export default class SiteMenuView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilter) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createSiteMenuTemplate(this.#filters, this.#currentFilter);
  }
  
  get element(){
    const result = base.element;
    
    result.addEventListener('click',(evt)=>{
      const {href} = evt.target;
      if(href){
        const parts = href.split('#');
        this.notify(parts[1]);
      }
    });
    
    return result;
  }
}
