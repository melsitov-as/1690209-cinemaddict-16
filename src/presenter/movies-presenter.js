import SiteRatingView from '../view/site-rating-view.js';
import SiteMenuView from '../view/site-menu-view.js';
import SiteSortView from '../view/site-sort-view.js';
import SiteFilmsView from '../view/site-films-view.js';
import SiteShowMoreView from '../view/site-show-more-view.js';
import SiteAllFilmsView from '../view/site-all-films-list-view.js';
import SiteTopRatedFilmsView from '../view/site-top-rated-view.js';
import SiteMostCommentedFilmsView from '../view/site-most-commented-view.js';
import { replaceElement, renderBeforeEnd } from '../render.js';
import { generateFilter } from '../mock/filter.js';
import MoviePresenter from './movie-presenter.js';
import { sortByDate, callbackForEachLimited, sortByRating, sortByComments } from '../utils/common.js';
import { SortType, UpdateType, UserAction, FILM_CARDS_COUNT, FILM_CARDS_COUNT_PER_STEP } from '../const.js';


export default class MoviesBoardPresenter {
  #siteFilmsList = null;
  #showMoreButton = new SiteShowMoreView()
  #siteMenu = null;
  #moviesModel = null;
  #currentFilter = 'all';
  #filmPopupContainer = null;

  constructor(main, moviesModel) {
    this.#filmPopupContainer = document.body;
    this._mainContainer = main;

    this.#siteFilmsList = new SiteFilmsView();
    this.#moviesModel = moviesModel;
    this._filters = generateFilter(this.films);

    this.#siteMenu = new SiteMenuView(this._filters, this.#currentFilter);

    this._filmPresentersRegular = new Map();
    this._filmPresentersTopRated = new Map();
    this._filmPresentersMostCommented = new Map();
    this._popupPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._sortMenu = new SiteSortView(this._currentSortType);

    this._filmCardsDefault = this.films.slice();

    this._siteAllFilmsTemplate = new SiteAllFilmsView().element;
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
  }

  #updateFilter = () => {
    this._newMenu = new SiteMenuView(
      generateFilter(this.#moviesModel.films),
      this.#currentFilter
    );
    replaceElement(this._newMenu, this.#siteMenu);
    this.#subscribeOnFilters(this._newMenu);
    this.#siteMenu = this._newMenu;

  }

  #rerenderFilter = (newFilter)=>{
    this.#currentFilter = newFilter;
    this.#updateFilter();
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

  #workOnFilters = ()=> {
    this.#clearFilmsList(this._filmPresentersRegular, this._allFilmsContainer);
    this._filmPresentersRegular = new Map();
    this.#renderAllFilms();
  };

  #rerenderFilms = () => {
    this.#clearFilmsList(this._filmPresentersRegular, this._allFilmsContainer);
    this._filmPresentersRegular = new Map();
    this.#renderAllFilms();
    this.#clearFilmsList(this._filmPresentersTopRated, this._topRatedFilmsContainer);
    this._filmPresentersTopRated = new Map();
    this.#renderFilmItemsTopRated(this._topRatedFilmsContainer, 2, this._filmPresentersTopRated);
    this.#clearFilmsList(this._filmPresentersMostCommented, this._mostCommentedFilmsContainer);
    this._filmPresentersMostCommented = new Map();
    this.#renderFilmItemsMostCommented(this._mostCommentedFilmsContainer, 2, this._filmPresentersMostCommented);
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
    this.#clearFilmsList(this._filmPresentersRegular, this._allFilmsContainer);
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
        this.#showMoreButton.remove();
      }
    });
  }


  #renderAllFilmsContainer = (container) => {
    renderBeforeEnd(container, this._siteAllFilmsTemplate);
    this._allFilmsContainer =container.querySelector('.films-list--regular').querySelector('.films-list__container');
  }

  #renderAllFilms = () => {
    this.#renderFilmItems(this._allFilmsContainer, FILM_CARDS_COUNT_PER_STEP, this._filmPresentersRegular);
    if (this.films.length > FILM_CARDS_COUNT_PER_STEP) {
      renderBeforeEnd(this._siteAllFilmsTemplate, this.#showMoreButton.element);
      this.#initializeShowMoreClickHandler(this._allFilmsContainer);
    }
  };


  #renderTopRated = (container) => {
    renderBeforeEnd(container, new SiteTopRatedFilmsView().element);
    this._topRatedFilmsContainer = container.querySelector('.films-list--top-rated').querySelector('.films-list__container');
    this.#renderFilmItemsTopRated(this._topRatedFilmsContainer, 2, this._filmPresentersTopRated);
  }

  #renderMostCommented = (container) => {
    renderBeforeEnd(container, new SiteMostCommentedFilmsView().element);
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
    this.#subscribeOnFilters(this.#siteMenu);
    renderBeforeEnd(container, this._sortMenu.element);
    this.#subscribeOnSort(this._sortMenu);
    this.#renderFilms(container);
  };

  #clearFilmsList = (presenters, container) => {
    presenters.forEach((presenter) => {
      container.removeChild(presenter.movie.element);
    });
    presenters.forEach((presenter) => presenter.destroy());
  }
}
