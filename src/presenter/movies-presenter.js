import SiteRatingView from '../view/site-rating-view.js';
import SiteMenuView from '../view/site-menu-view.js';
import SiteSortView from '../view/site-sort-view.js';
import SiteFilmsView from '../view/site-films-view.js';
import SiteShowMoreView from '../view/site-show-more-view.js';
import SiteAllFilmsView from '../view/site-all-films-list-view.js';
import SiteTopRatedFilmsView from '../view/site-top-rated-view.js';
import SiteMostCommentedFilmsView from '../view/site-most-commented-view.js';
import { replaceElement, renderBeforeEnd, removeElement } from '../render.js';
import { generateFilter } from '../mock/filter.js';
import MoviePresenter from './movie-presenter.js';
import { sortByDate, callbackForEachLimited, sortByRating, sortByComments } from '../utils/common.js';
import { SortType, UpdateType, UserAction, FILM_CARDS_COUNT, FILM_CARDS_COUNT_PER_STEP } from '../const.js';
import StatisticsChartPresenter from './statistics-chart-presenter.js';


export default class MoviesBoardPresenter {
  #siteFilmsList = null;
  #showMoreButton = new SiteShowMoreView()
  #siteMenu = null;
  #moviesModel = null;
  #currentFilter = 'all';
  #filmPopupContainer = null;
  #statisticsChart = null;

  constructor(main, moviesModel) {
    this.#filmPopupContainer = document.body;
    this._mainContainer = main;

    this.#siteFilmsList = new SiteFilmsView();
    this.#moviesModel = moviesModel;
    this._filters = generateFilter(this.films);

    this.#siteMenu = new SiteMenuView(this._filters, this.#currentFilter, this._isStatsActive);

    this._filmPresentersRegular = new Map();
    this._filmPresentersTopRated = new Map();
    this._filmPresentersMostCommented = new Map();
    this._popupPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._sortMenu = new SiteSortView(this._currentSortType);

    this._filmCardsDefault = this.films.slice();

    this._siteAllFilmsTemplate = new SiteAllFilmsView().element;

    this._isStatsRendered = false;
    this._isFilmsRendered = false;

    this._isStatsActive = 'not-active';

    this.#moviesModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    const items = this.#moviesModel.films.filter((item)=> item && this.#currentFilter === 'all'
        || (
          item.isWatched && this.#currentFilter === 'history'
        ||
        item.isInFavorites && this.#currentFilter === 'favorites'
        ||
        item.isInWatchlist && this.#currentFilter === 'watchlist'
        ||
        item && this.#currentFilter === 'stats'
        ));
    switch (this._currentSortType) {
      case SortType.DATE:
        return items.sort(sortByDate);
      case SortType.RATING:
        return items.sort(sortByRating);
    }
    return items;
  }

  init = () => {
    this.#renderSite(this._mainContainer);
    // this.#addStatisticsChart(this._mainContainer, this.films);
  }

  #updateFilter = () => {
    this._newMenu = new SiteMenuView(
      generateFilter(this.#moviesModel.films),
      this.#currentFilter,
      this._isStatsActive
    );
    replaceElement(this._newMenu, this.#siteMenu);
    this.#subscribeOnFilters(this._newMenu);
    this.#siteMenu = this._newMenu;
    this._newMenu.setShowStatsHandler(this.#showStats);
  }

  #rerenderFilter = (newFilter)=>{
    this.#currentFilter = newFilter;
    this.#updateFilter();
    this.#workOnFilters();
    this.#siteMenu.setShowStatsHandler(this.#showStats);
  }

  #subscribeOnFilters = (filter) => {
    filter.subscribe(
      'all',
      ()=>this.#rerenderFilter('all'),
    );
    filter.subscribe(
      'watchlist',
      ()=>this.#rerenderFilter('watchlist'),
    );
    filter.subscribe(
      'history',
      ()=>this.#rerenderFilter('history'),
    );
    filter.subscribe(
      'favorites',
      ()=>this.#rerenderFilter('favorites'),
    );
  }

  #workOnFilters = ()=> {
    if (this._isFilmsRendered && !this._isStatsRendered) {
      this.#clearFilmsList(this._filmPresentersRegular, this._allFilmsContainer.element.querySelector('.films-list__container'));
      removeElement(this.#showMoreButton);
      this.#clearFilmsList(this._filmPresentersTopRated, this._topRatedFilmsContainer.element.querySelector('.films-list__container'));
      this.#clearFilmsList(this._filmPresentersMostCommented, this._mostCommentedFilmsContainer.element.querySelector('.films-list__container'));
      this._filmPresentersRegular = new Map();
      this._filmPresentersTopRated = new Map();
      this._filmPresentersMostCommented = new Map();
      this.#renderAllFilms();
      this.#renderFilmItemsTopRated(this._topRatedFilmsContainer.element.querySelector('.films-list__container'), 2, this._filmPresentersTopRated);
      this.#renderFilmItemsMostCommented(this._mostCommentedFilmsContainer.element.querySelector('.films-list__container'), 2, this._filmPresentersMostCommented);
      this._isStatsRendered = false;
      this._isFilmsRendered = true;
    }
    if (!this._isFilmsRendered && this._isStatsRendered) {
      this.#statisticsChart.destroy();
      this._isStatsRendered = false;
      this._isFilmsRendered = true;
      this.#renderFilms(this._mainContainer);
      this._isStatsActive = 'no-active';
      this.#updateFilter();
    }

  }


  #rerenderFilms = () => {
    if (this._isFilmsRendered && !this._isStatsRendered) {
      this.#clearFilmsList(this._filmPresentersRegular, this._allFilmsContainer.element.querySelector('.films-list__container'));
      removeElement(this.#showMoreButton);
      this.#clearFilmsList(this._filmPresentersTopRated, this._topRatedFilmsContainer.element.querySelector('.films-list__container'));
      this.#clearFilmsList(this._filmPresentersMostCommented, this._mostCommentedFilmsContainer.element.querySelector('.films-list__container'));
      this._filmPresentersRegular = new Map();
      this._filmPresentersTopRated = new Map();
      this._filmPresentersMostCommented = new Map();
      this.#renderAllFilms();
      this.#renderFilmItemsTopRated(this._topRatedFilmsContainer.element.querySelector('.films-list__container'), 2, this._filmPresentersTopRated);
      this.#renderFilmItemsMostCommented(this._mostCommentedFilmsContainer.element.querySelector('.films-list__container'), 2, this._filmPresentersMostCommented);
      this._isFilmsRendered = true;
    }
  }

  #rerenderSort = (newSort) => {
    this._currentSortType = newSort;
    this._newSort = new SiteSortView(this._currentSortType);
    replaceElement(this._newSort, this._sortMenu);
    this.#workOnSort();
  }

  #workOnSort = () => {
    this.#subscribeOnSort(this._newSort);
    this._sortMenu = this._newSort;
    this.#clearFilmsList(this._filmPresentersRegular, this._allFilmsContainer.element.querySelector('.films-list__container'));
    this._filmPresentersRegular = new Map();
    this.#renderAllFilms();
  }

  #subscribeOnSort = (sort) => {
    sort.subscribe(
      SortType.DEFAULT,
      () => this.#rerenderSort(SortType.DEFAULT),
    );
    sort.subscribe(
      SortType.DATE,
      () => this.#rerenderSort(SortType.DATE),
    );
    sort.subscribe(
      SortType.RATING,
      () => this.#rerenderSort(SortType.RATING),
    );
  }

  #renderFilm = (film, container, filmPresenters) => {
    const filmCard = new MoviePresenter(container, this.#handleViewAction, this._popupPresenter);
    filmCard.init(film);

    filmPresenters.set(filmCard.movie.filmCardData.id, filmCard);
    return filmCard.movie.element;
  }

  #renderFilmItems = (container, count, filmPresenters) => {
    callbackForEachLimited (
      this.films,
      count,
      (item)=>{this.#renderFilm(item, container, filmPresenters);},
    );
  };

  #renderFilmItemsTopRated = (container, count, filmPresenters) => {
    callbackForEachLimited (
      this.films.slice().sort(sortByRating),
      count,
      (item)=>this.#renderFilm(item, container, filmPresenters)
    );
  }

  #renderFilmItemsMostCommented = (container, count, filmPresenters) => {
    callbackForEachLimited (
      this.films.slice().sort(sortByComments),
      count,
      (item)=>this.#renderFilm(item, container, filmPresenters)
    );
  }

  #initializeShowMoreClickHandler = (allFilmsContainer) => {
    let renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP;
    this.#showMoreButton.setShowMoreHandler(() => {
      this.films
        .slice(renderedFilmCardsCount, renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP)
        .forEach((filmCard) => {
          this.#renderFilm(filmCard, allFilmsContainer, this._filmPresentersRegular);
        });
      renderedFilmCardsCount += FILM_CARDS_COUNT_PER_STEP;
      if (renderedFilmCardsCount >= this.films.length) {
        removeElement(this.#showMoreButton);
      }
    });
  }


  #renderAllFilmsContainer = (container) => {
    this._allFilmsContainer = new SiteAllFilmsView();
    renderBeforeEnd(container, this._allFilmsContainer);
  }

  #renderAllFilms = () => {
    this.#renderFilmItems(this._allFilmsContainer.element.querySelector('.films-list__container'), FILM_CARDS_COUNT_PER_STEP, this._filmPresentersRegular);
    if (this.films.length > FILM_CARDS_COUNT_PER_STEP) {
      renderBeforeEnd(this._allFilmsContainer.element, this.#showMoreButton.element);
      this.#initializeShowMoreClickHandler(this._allFilmsContainer.element.querySelector('.films-list__container'));
    }
  };


  #renderTopRated = (container) => {
    this._topRatedFilmsContainer = new SiteTopRatedFilmsView();
    renderBeforeEnd(container,this._topRatedFilmsContainer);
    this.#renderFilmItemsTopRated(this._topRatedFilmsContainer.element.querySelector('.films-list__container'), 2, this._filmPresentersTopRated);
  }

  #renderMostCommented = (container) => {
    this._mostCommentedFilmsContainer = new SiteMostCommentedFilmsView();
    renderBeforeEnd(container, this._mostCommentedFilmsContainer);
    this.#renderFilmItemsMostCommented(this._mostCommentedFilmsContainer.element.querySelector('.films-list__container'), 2, this._filmPresentersMostCommented);
  };

  #showNoFilmsMessage = (container) => {
    this.#renderAllFilms(container);
    const filmsListTitle = container.querySelector('.films-list__title');
    filmsListTitle.classList.remove('visually-hidden');
    filmsListTitle.textContent = 'There are no movies in our database';
  };

  #renderFilms = (container) => {
    renderBeforeEnd(container, this.#siteFilmsList);
    if (FILM_CARDS_COUNT <= 0) {
      this.#showNoFilmsMessage(container);
    } else {
      this.#renderAllFilmsContainer(container.querySelector('.films'));
      this.#renderAllFilms();
      this.#renderTopRated(container.querySelector('.films'));
      this.#renderMostCommented(container.querySelector('.films'));
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch(actionType) {
      case UserAction.UPDATE_FILM:
        this.#moviesModel.updateFilm(updateType, update);
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch(updateType) {
      case UpdateType.PATCH:
        if ( this._filmPresentersRegular.get(data.id) !== undefined) {
          this._filmPresentersRegular.get(data.id).init(data);
        }

        if ( this._filmPresentersTopRated.get(data.id) !== undefined) {
          this._filmPresentersTopRated.get(data.id).init(data);
        }

        if ( this._filmPresentersMostCommented.get(data.id) !== undefined) {
          this._filmPresentersMostCommented.get(data.id).init(data);
        }

        if (this._popupPresenter.get(data.id) !== undefined) {
          this._popupPresenter.get(data.id).init(data);
        }
        break;
      case UpdateType.MINOR:
        if ( this._filmPresentersRegular.get(data.id) !== undefined) {
          this._filmPresentersRegular.get(data.id).init(data);
        }
        this._renderedPresenterRegular = this._filmPresentersRegular.get(data.id);

        if ( this._filmPresentersTopRated.get(data.id) !== undefined) {
          this._filmPresentersTopRated.get(data.id).init(data);
        }
        this._rerenderedPresenterTopRated = this._filmPresentersTopRated.get(data.id);

        if ( this._filmPresentersMostCommented.get(data.id) !== undefined) {
          this._filmPresentersMostCommented.get(data.id).init(data);
        }
        this._renderedPresenterMostCommented = this._filmPresentersMostCommented.get(data.id);
        if (this._popupPresenter.get(data.id) !== undefined) {
          this._popupPresenter.get(data.id).init(data);
        }
        this.#rerenderFilms();
        this.#updateFilter();
        break;
      case UpdateType.MAJOR:
        break;
    }
  }

  #renderSite = (container) => {
    renderBeforeEnd(
      document.querySelector('header'),
      new SiteRatingView().element
    );
    renderBeforeEnd(container, this.#siteMenu.element);
    this.#siteMenu.setShowStatsHandler(this.#showStats);
    this.#subscribeOnFilters(this.#siteMenu);
    renderBeforeEnd(container, this._sortMenu.element);
    this.#subscribeOnSort(this._sortMenu);
    this.#renderFilms(container);
    this._isFilmsRendered = true;
  };


  #addStatisticsChart = (container, moviesModel) => {
    this.#statisticsChart = new StatisticsChartPresenter(container, moviesModel);
    this.#statisticsChart.init();
  }

  #clearFilmsList = (presenters, container) => {
    presenters.forEach((presenter) => {
      if ((presenter.movie.element).parentElement === container) {
        container.removeChild(presenter.movie.element);
      }
    });
    presenters.forEach((presenter) => presenter.destroy());
  }

  #showStats = () => {
    if (!this._isStatsRendered && this._isFilmsRendered) {
      {this.#clearFilmsList(this._filmPresentersRegular, this._allFilmsContainer.element.querySelector('.films-list__container'));}
      removeElement(this._allFilmsContainer);
      removeElement(this.#showMoreButton);
      removeElement(this._topRatedFilmsContainer);
      removeElement(this._mostCommentedFilmsContainer);
    }
    this._isStatsActive = 'active';
    this.#currentFilter = 'stats';
    this.#updateFilter();

    // this.#clearFilmsList(this._filmPresentersTopRated, this._topRatedFilmsContainer);
    // this.#clearFilmsList(this._filmPresentersMostCommented, this._mostCommentedFilmsContainer);
    this.#addStatisticsChart(this._mainContainer, this.films);
    this._isStatsRendered = true;
    this._isFilmsRendered = false;
  }
}
