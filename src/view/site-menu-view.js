import AbstractView from './abstract-view.js';

const createSiteMenuTemplate = (filters) => `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filters.inWatchlist}</span></a>
      <a href="#history" class="main-navigation__item main-navigation__item--active">History <span class="main-navigation__item-count">${filters.inHistory}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filters.inFavorites}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;


export default class SiteMenuView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createSiteMenuTemplate(this.#filters);
  }
  
  get element(){
    const result = base.element;
    
    result.addEventListener('click',(evt)=>{
      const {href} = evt.target;
      if(href){
        const parts = href.split('#');
        notify(parts[1]);
      }
    });
    
    return result;
  }
}
