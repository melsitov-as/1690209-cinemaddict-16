import SiteRatingView from '../view/site-rating-view.js';
import SiteMenuView from '../view/site-menu-view.js';
import SiteSortView from '../view/site-sort-view.js';
import SiteFilmsView from '../view/site-films-view.js';
import SiteShowMoreView from '../view/site-show-more-view.js';
import SiteAllFilmsView from '../view/site-all-films-list-view.js';
import SiteTopRatedFilmsView from '../view/site-top-rated-view.js';
import SiteMostCommentedFilmsView from '../view/site-most-commented-view.js';
import { replaceElement, renderElement, RenderPosition, removeElement } from '../render.js';
import { generateFilter } from '../mock/filter.js';
import MoviePresenter from './movie-presenter.js';
import { sortByDate, callbackForEachLimited, sortByRating, sortByComments } from '../utils/common.js';
import { SortType, UpdateType, UserAction } from '../const.js';

const FILM_CARDS_COUNT = 48;
const FILM_CARDS_COUNT_PER_STEP = 5;

// const body = document.querySelector('body');

export default class MoviesBoardPresenter {

  #showMoreButton = new SiteShowMoreView()
  #siteMenu = null;
  #moviesModel = null;
  #currentFilter = 'all';

  constructor(main, moviesModel) {
    this._mainContainer = main;

    this.#moviesModel = moviesModel;
    this._filters = generateFilter(this.films);

    this.#siteMenu = new SiteMenuView(this._filters, this.#currentFilter);

    this._filmPresentersRegular = new Map();
    this._filmPresentersTopRated = new Map();
    this._filmPresentersMostCommented = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._sortMenu = new SiteSortView(this._currentSortType);

    this._filmCardsDefault = this.films.slice();

    this._siteAllFilmsTemplate = new SiteAllFilmsView().element;
    // this.#moviesModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    const items = this.#moviesModel.films.filter((item)=> this.#currentFilter === 'all'
        || (
          item.watched && this.#currentFilter === 'history'
        ||
        item.isInFavorites && this.#currentFilter === 'favorites'
        ||
        item.isInWatchList && this.#currentFilter === 'watchlist'
        ));
    //   switch (this.#currentFilter) {
    //     case this.#currentFilter === 'all':
    //       this.#moviesModel.films.filter((item) => item);
    //       break;
    //     case this.#currentFilter === 'history':
    //       this.#moviesModel.films.filter((item) => item.isWatched);
    //       break;
    //     case this.#currentFilter === 'favorites':
    //       this.#moviesModel.films.filter((item) => item.isInFavorites);
    //       break;
    //     case this.#currentFilter === 'watchlist':
    //       this.#moviesModel.films.filter((item) => item.isInWatchlist);
    //   }
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
    // this._sortMenu.setSortTypeChangeHandler(this.#handleSortTypeChange);
    console.log(this.#moviesModel.films);
  }

  #renderBeforeEnd = (container, element) => renderElement(container, element, RenderPosition.BEFOREEND);

  #renderAfterBegin = (container, element) => renderElement(container, element, RenderPosition.AFTERBEGIN)

  // #clearBoard = ()=>{
  //   removeElement(this.#siteMenu);
  // }

  #rerenderFilter = (newFilter)=>{
    this.#currentFilter = newFilter;
    this._newMenu = new SiteMenuView(
      generateFilter(this.#moviesModel.films),
      this.#currentFilter
    );
    replaceElement(this._newMenu, this.#siteMenu);
    this.#workOnFilters();
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

  #workOnFilters = ()=>{
    this.#subscribeOnFilters(this._newMenu);
    this.#siteMenu = this._newMenu;
  };

  #rerenderSort = (newSort) => {
    this._currentSortType = newSort;
    this._newSort = new SiteSortView(this._currentSortType);
    replaceElement(this._newSort, this._sortMenu);
    this.#workOnSort();
  }

  #workOnSort = () => {
    this.#subscribeOnSort(this._newSort);
    this._sortMenu = this._newSort;
  }

  #subscribeOnSort = (sort) => {
    sort.subscribe(
      SortType.DEFAULT,
      () => this.#rerenderSort(SortType.DEFAULT),
    );
    sort.subscribe(
      SortType.DATE,
      () => this.#rerenderSort(SortType.DATE)
    );
    sort.subscribe(
      SortType.RATING,
      () => this.#rerenderSort(SortType.RATING)
    );
  }

  #renderFilm = (film, container, filmPresenters) => {
    const filmCard = new MoviePresenter(container, this.#handleViewAction);
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

  #renderAllFilmsContainer = (container) => {
    this.#renderBeforeEnd(container, this._siteAllFilmsTemplate);
    this._allFilmsContainer = container.querySelector('.films-list--regular').querySelector('.films-list__container');
  }

  #renderAllFilms = () => {
    this.#renderFilmItems(this._allFilmsContainer, FILM_CARDS_COUNT_PER_STEP, this._filmPresentersRegular);
    if (this.films.length > FILM_CARDS_COUNT_PER_STEP) {
      this.#renderBeforeEnd(this._siteAllFilmsTemplate, this.#showMoreButton.element);
      // this.#initializeShowMoreClickHandler(this._allFilmsContainer);
    }
  };


  #renderTopRated = (container) => {
    this.#renderBeforeEnd(container, new SiteTopRatedFilmsView().element);
    this._topRatedFilmsContainer = container.querySelector('.films-list--top-rated').querySelector('.films-list__container');
    this.#renderFilmItemsTopRated(this._topRatedFilmsContainer, 2, this._filmPresentersTopRated);
  }

  #renderMostCommented = (container) => {
    this.#renderBeforeEnd(container, new SiteMostCommentedFilmsView().element);
    this._mostCommentedFilmsContainer = container.querySelector('.films-list--most-commented').querySelector('.films-list__container');
    this.#renderFilmItemsMostCommented(this._mostCommentedFilmsContainer, 2, this._filmPresentersMostCommented);
  };

  #showNoFilmsMessage = (container) => {
    this.#renderAllFilms(container);
    const filmsListTitle = container.querySelector('.films-list__title');
    filmsListTitle.classList.remove('visually-hidden');
    filmsListTitle.textContent = 'There are no movies in our database';
  };

  #renderFilms = (container) => {
    if (FILM_CARDS_COUNT <= 0) {
      this.#showNoFilmsMessage(container);
    } else {
      this.#renderAllFilmsContainer(container);
      this.#renderAllFilms();
      this.#renderTopRated(container);
      this.#renderMostCommented(container);
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch(actionType) {
      case UserAction.UPDATE_FILM:
        this.#moviesModel.updateFilm(updateType, update);
    }
  }

  #renderSite = (container) => {
    this.#renderBeforeEnd(
      document.querySelector('header'),
      new SiteRatingView().element
    );
    this.#renderBeforeEnd(container, this.#siteMenu.element);
    this.#subscribeOnFilters(this.#siteMenu);
    this.#renderBeforeEnd(container, this._sortMenu.element);
    this.#subscribeOnSort(this._sortMenu);
    this.#renderFilms(container);
  };


  // #handleModelEvent = (updateType, data) => {
  //   switch(updateType) {
  //     case UpdateType.PATCH:

  //       if ( this._filmPresentersRegular.get(data.id) !== undefined) {
  //         this._filmPresentersRegular.get(data.id).init(data);
  //       }

  //       if ( this._filmPresentersTopRated.get(data.id) !== undefined) {
  //         this._filmPresentersTopRated.get(data.id).init(data);
  //       }

  //       if ( this._filmPresentersMostCommented.get(data.id) !== undefined) {
  //         this._filmPresentersMostCommented.get(data.id).init(data);
  //       }
  //       break;
  //     case UpdateType.MINOR:
  //       break;
  //     case UpdateType.MAJOR:
  //       break;
  //   }
  // }


  // #siteFilterSubscribe = (data) => {
  //   data.subscribe(
  //     'all',
  //     ()=>this.#rerenderFilter('all'),
  //   );
  //   data.subscribe(
  //     'watchlist',
  //     ()=>this.#rerenderFilter('watchlist'),
  //   );
  //   data.subscribe(
  //     'history',
  //     ()=>this.#rerenderFilter('history'),
  //   );
  //   data.subscribe(
  //     'favorites',
  //     ()=>this.#rerenderFilter('favorites'),
  //   );
  // }


  // Переключатель карточки фильма
  //  #handleFilmChange = (updatedFilm) => {
  //    this.films= updateItem(this.films, updatedFilm);
  //    this._filmCardsDefault = updateItem(this._filmCardsDefault, updatedFilm);

  //    if ( this._filmPresentersRegular.get(updatedFilm.id) !== undefined) {
  //      this._filmPresentersRegular.get(updatedFilm.id).init(updatedFilm);
  //    }

  //    if ( this._filmPresentersTopRated.get(updatedFilm.id) !== undefined) {
  //      this._filmPresentersTopRated.get(updatedFilm.id).init(updatedFilm);
  //    }

  //    if ( this._filmPresentersMostCommented.get(updatedFilm.id) !== undefined) {
  //      this._filmPresentersMostCommented.get(updatedFilm.id).init(updatedFilm);
  //    }

  //    this.#updateSiteMenu();
  //  }


  // #sortFilmCards = (sortType) => {
  //   switch(sortType) {
  //     case SortType.DEFAULT:
  //       this._currentSortType = sortType.DEFAULT;
  //       this._filmCards = this._filmCardsDefault;
  //       break;
  //     case SortType.DATE:
  //       this._currentSortType = sortType.DATE;
  //       this._filmCards = this.films.slice().sort(sortByDate);
  //       break;
  //     case SortType.RATING:
  //       this._currentSortType = sortType.RATING;
  //       this._filmCards = this.films.slice().sort(sortByRating);
  //       break;
  //   }
  // }

  // #clearFilms = (presenters, container) => {
  //   presenters.forEach((presenter) => {
  //     container.removeChild(presenter.movie.element);
  //   });
  //   presenters.forEach((presenter) => presenter.destroy());
  // }

  // #handleSortTypeChange = (sortType) => {
  //   if (this._currentSortType === sortType) {
  //     return;
  //   }
  //   // this.#sortFilmCards(sortType);
  //   this._currentSortType = sortType;
  //   this.#clearFilms(this._filmPresentersRegular, this._allFilmsContainer);
  //   this._filmPresentersRegular = new Map();
  //   this.#renderAllFilms();
  // }
}
