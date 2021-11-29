export const createSiteMenuTemplate = (filter) => `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filter.inWatchlist}</span></a>
      <a href="#history" class="main-navigation__item main-navigation__item--active">History <span class="main-navigation__item-count">${filter.inHistory}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filter.inFavorites}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
