import SiteRatingView from '../view/site-rating-view.js';
import SiteMenuView from '../view/site-menu-view.js';
import SiteSortView, { SortType } from '../view/site-sort-view.js';
import SiteFilmsView from '../view/site-films-view.js';
import SiteShowMoreView from '../view/site-show-more-view.js';
import SiteAllFilmsView from '../view/site-all-films-list-view.js';
import SiteTopRatedFilmsView from '../view/site-top-rated-view.js';
import SiteMostCommentedFilmsView from '../view/site-most-commented-view.js';
import { renderElement, RenderPosition, removeElement } from '../render.js';
import { generateFilter } from '../mock/filter.js';
import MoviePresenter from './movie-presenter.js';
import { updateItem, sortByDate, callbackForEachLimited, sortByRating, sortByComments } from '../utils/common.js';

const FILM_CARDS_COUNT = 48;
const FILM_CARDS_COUNT_PER_STEP = 5;

// const body = document.querySelector('body');

export default class MoviesBoardPresenter {

  #showMoreButton = new SiteShowMoreView()
  #siteMenu = null;
  #moviesModel = null;

  constructor(main, moviesModel) {
    this._mainContainer = main;

    this.#moviesModel = moviesModel;
    this._filters = generateFilter(this.#moviesModel.films);

    this.#siteMenu = new SiteMenuView(this._filters).element;

    this._filmPresentersRegular = new Map();
    this._filmPresentersTopRated = new Map();
    this._filmPresentersMostCommented = new Map();

    this._sortMenu = new SiteSortView();

    this._currentSortType = SortType.DEFAULT;
    this._filmCardsDefault = this.#moviesModel.films.slice();

    this._siteAllFilmsTemplate = new SiteAllFilmsView().element;
  }

  get films() {
    return this.#moviesModel.films;
  }

  init = () => {
    this.#renderSite(this._mainContainer);
    this._sortMenu.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderFilm = (film, container, filmPresenters) => {
    const filmCard = new MoviePresenter(container, this.#handleFilmChange);
    filmCard.init(film);

    filmPresenters.set(filmCard.movie.filmCardData.id, filmCard);
    return filmCard.movie.element;
  }

  #renderBeforeEnd = (container, element) => renderElement(container, element, RenderPosition.BEFOREEND);

  #renderAfterBegin = (container, element) => renderElement(container, element, RenderPosition.AFTERBEGIN)

  #renderFilmItems = (container, count, filmPresenters) => {
    callbackForEachLimited (
      this.#moviesModel.films,
      count,
      (item)=>{this.#renderFilm(item, container, filmPresenters);},
    );
  };

  #renderFilmItemsTopRated = (container, count, filmPresenters) => {
    callbackForEachLimited (
      this.#moviesModel.films.slice().sort(sortByRating),
      count,
      (item)=>this.#renderFilm(item, container, filmPresenters)
    );
  }

  #renderFilmItemsMostCommented = (container, count, filmPresenters) => {
    callbackForEachLimited (
      this.#moviesModel.films.slice().sort(sortByComments),
      count,
      (item)=>this.#renderFilm(item, container, filmPresenters)
    );
  }

  #initializeShowMoreClickHandler = (allFilmsContainer) => {
    let renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP;
    this.#showMoreButton.setShowMoreHandler(() => {
      this.#moviesModel.films
        .slice(renderedFilmCardsCount, renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP)
        .forEach((filmCard) => {
          this.#renderFilm(filmCard, allFilmsContainer, this._filmPresentersRegular);
        });
      renderedFilmCardsCount += FILM_CARDS_COUNT_PER_STEP;
      if (renderedFilmCardsCount >= this.#moviesModel.films.length) {
        this.#showMoreButton.remove();
      }
    });
  }

  #renderAllFilmsContainer = (container) => {
    this.#renderBeforeEnd(container, this._siteAllFilmsTemplate);
    this._allFilmsContainer = container.querySelector('.films-list__container');
  }

  #renderAllFilms = () => {
    this.#renderFilmItems(this._allFilmsContainer, FILM_CARDS_COUNT_PER_STEP, this._filmPresentersRegular);
    if (this.#moviesModel.films.length > FILM_CARDS_COUNT_PER_STEP) {
      this.#renderBeforeEnd(this._siteAllFilmsTemplate, this.#showMoreButton.element);
      this.#initializeShowMoreClickHandler(this._allFilmsContainer);
    }
  };

  #renderTopRated = (container) => {
    this.#renderBeforeEnd(container, new SiteTopRatedFilmsView().element);
    this.#renderFilmItemsTopRated(container.querySelector('.films-list--top-rated').querySelector('.films-list__container'), 2, this._filmPresentersTopRated);
  }


  #renderMostCommented = (container) => {
    this.#renderBeforeEnd(container, new SiteMostCommentedFilmsView().element);
    this.#renderFilmItemsMostCommented(container.querySelector('.films-list--most-commented').querySelector('.films-list__container'), 2, this._filmPresentersMostCommented);
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

  #renderSite = (container) => {
    this.#renderBeforeEnd(
      document.querySelector('header'),
      new SiteRatingView().element
    );
    this.#renderBeforeEnd(container, this.#siteMenu);
    this.#renderBeforeEnd(container, this._sortMenu);
    this.#renderBeforeEnd(container, new SiteFilmsView().element);
    this.#renderFilms(container.querySelector('.films'));
  };

   // Переключатель карточки фильма
   #handleFilmChange = (updatedFilm) => {
     this.#moviesModel.films= updateItem(this.#moviesModel.films, updatedFilm);
     this._filmCardsDefault = updateItem(this._filmCardsDefault, updatedFilm);

     if ( this._filmPresentersRegular.get(updatedFilm.id) !== undefined) {
       this._filmPresentersRegular.get(updatedFilm.id).init(updatedFilm);
     }

     if ( this._filmPresentersTopRated.get(updatedFilm.id) !== undefined) {
       this._filmPresentersTopRated.get(updatedFilm.id).init(updatedFilm);
     }

     if ( this._filmPresentersMostCommented.get(updatedFilm.id) !== undefined) {
       this._filmPresentersMostCommented.get(updatedFilm.id).init(updatedFilm);
     }

     this.#updateSiteMenu();
   }

   #updateSiteMenu = () => {
     removeElement(this.#siteMenu);
     this._filters = generateFilter(this.#moviesModel.films);
     this.#siteMenu = new SiteMenuView(this._filters);
     this.#renderAfterBegin(this._mainContainer, this.#siteMenu.element);
   }

  #sortFilmCards = (sortType) => {
    switch(sortType) {
      case SortType.DEFAULT:
        this._currentSortType = sortType.DEFAULT;
        this._filmCards = this._filmCardsDefault;
        break;
      case SortType.DATE:
        this._currentSortType = sortType.DATE;
        this._filmCards = this.#moviesModel.films.slice().sort(sortByDate);
        break;
      case SortType.RATING:
        this._currentSortType = sortType.RATING;
        this._filmCards = this.#moviesModel.films.slice().sort(sortByRating);
        break;
    }
  }

  #clearFilmsListRegular = () => {
    this._filmPresentersRegular.forEach((presenter) => {
      this._allFilmsContainer.removeChild(presenter.movie.element);
    });
    this._filmPresentersRegular.forEach((presenter) => presenter.destroy());
  }

  #handleSortTypeChange = (sortType) => {
    if (this._currentSortType === sortType) {
      return;
    }

    this.#sortFilmCards(sortType);
    this.#clearFilmsListRegular();
    this._filmPresentersRegular = new Map();
    this.#renderAllFilms(this._allFilmsContainer);
  }
}
