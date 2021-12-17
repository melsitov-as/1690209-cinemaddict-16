import SiteRatingView from '../view/site-rating-view.js';
import SiteMenuView from '../view/site-menu-view.js';
import SiteSortView from '../view/site-sort-view.js';
import SiteFilmsView from '../view/site-films-view.js';
import SiteShowMoreView from '../view/site-show-more-view.js';
import SiteAllFilmsView from '../view/site-all-films-list-view.js';
import SiteTopRatedFilmsView from '../view/site-top-rated-view.js';
import SiteMostCommentedFilmsView from '../view/site-most-commented-view.js';
import { renderElement, RenderPosition, removeElement } from '../render.js';
import { getFilmCardMockData } from '../mock/film-card-mock.js';
import { generateFilter } from '../mock/filter.js';
import MoviePresenter from './movie-presenter.js';
import { updateItem } from '../utils/common.js';

const FILM_CARDS_COUNT = 48;
const FILM_CARDS_COUNT_PER_STEP = 5;

// const body = document.querySelector('body');

export default class MoviesBoardPresenter {

  #showMoreButton = new SiteShowMoreView()
  #siteMenu = null;

  constructor(main) {
    this._mainContainer = main;

    this._filmCards = Array.from({length: FILM_CARDS_COUNT}, getFilmCardMockData);
    this._filters = generateFilter(this._filmCards);

    this.#siteMenu = new SiteMenuView(this._filters).element;

    this._filmPresentersRegular = new Map();
    this._filmPresentersTopRated = new Map();
    this._filmPresentersMostCommented = new Map();

    this._filmCardsDefault = this._filmCards.slice();
  }

  init = () => {
    this.#renderSite(this._mainContainer);
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
    for (let ii = 0; ii < Math.min(this._filmCards.length, count); ii++) {
      this.#renderFilm(this._filmCards[ii], container, filmPresenters);
    }
  };

  #initializeShowMoreClickHandler = (allFilmsContainer) => {
    let renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP;
    this.#showMoreButton.setShowMoreHandler(() => {
      this._filmCards
        .slice(renderedFilmCardsCount, renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP)
        .forEach((filmCard) => {
          this.#renderFilm(filmCard, allFilmsContainer, this._filmPresentersRegular);
        });
      renderedFilmCardsCount += FILM_CARDS_COUNT_PER_STEP;
      if (renderedFilmCardsCount >= this._filmCards.length) {
        this.#showMoreButton.remove();
      }
    });
  }

  #renderAllFilms = (container) => {
    this.#renderBeforeEnd(container, new SiteAllFilmsView().element);
    const allFilmsContainer = container.querySelector('.films-list__container');
    this.#renderFilmItems(allFilmsContainer, FILM_CARDS_COUNT_PER_STEP, this._filmPresentersRegular);
    if (this._filmCards.length > FILM_CARDS_COUNT_PER_STEP) {
      this.#renderBeforeEnd(container, this.#showMoreButton.element);
      this.#initializeShowMoreClickHandler(allFilmsContainer);
    }
  };

  #renderTopRated = (container) => {
    this.#renderBeforeEnd(container, new SiteTopRatedFilmsView().element);
    this.#renderFilmItems(container.querySelector('.films-list--top-rated').querySelector('.films-list__container'), 2, this._filmPresentersTopRated);
  };

  #renderMostCommented = (container) => {
    this.#renderBeforeEnd(container, new SiteMostCommentedFilmsView().element);
    this.#renderFilmItems(container.querySelector('.films-list--most-commented').querySelector('.films-list__container'), 2, this._filmPresentersMostCommented);
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
      this.#renderAllFilms(container);
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
    this.#renderBeforeEnd(container, new SiteSortView().element);
    this.#renderBeforeEnd(container, new SiteFilmsView().element);
    this.#renderFilms(container.querySelector('.films'));
    // this.#initializeShowPopupLink(this.#renderedFilmCards);
  };

   // Переключатель карточки фильма
   #handleFilmChange = (updatedFilm) => {
     this._filmCards = updateItem(this._filmCards, updatedFilm);
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
     //  this._mainContainer.removeChild(this.#siteMenu);
     removeElement(this.#siteMenu);
     this._filters = generateFilter(this._filmCards);
     this.#siteMenu = new SiteMenuView(this._filters);
     this.#renderAfterBegin(this._mainContainer, this.#siteMenu.element);
   }
}
