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

const FILM_CARDS_COUNT = 42;
const FILM_CARDS_COUNT_PER_STEP = 5;

// const body = document.querySelector('body');

export default class MoviesBoardPresenter {
  #renderedFilmCards = [];

  #showMoreButton = new SiteShowMoreView()

  constructor(main) {
    this._mainContainer = main;

    this._filmCards = Array.from({length: FILM_CARDS_COUNT}, getFilmCardMockData);
    this._filters = generateFilter(this._filmCards);

    this._filmPresentersRegular = new Map();
    this._filmPresentersTopRated = new Map();
    this._filmPresentersMostCommented = new Map();

  }

  init = () => {
    this.#renderSite(this._mainContainer);
    // const movie = new MoviePresenter(this._filmCards[0]);
    // console.log(movie.movie.element);
    console.log(this._filmPresentersRegular);
    console.log(this._filmPresentersTopRated);
    console.log(this._filmPresentersMostCommented);
  }

  #renderFilm = (film, filmPresenters) => {
    const filmCard = new MoviePresenter(film);
    filmCard.init();
    console.log(filmCard.movie.filmCardData.id);

    filmPresenters.set(filmCard.movie.filmCardData.id, filmCard);
    return filmCard.movie.element;
  }

  #renderBeforeEnd = (container, element) => renderElement(container, element, RenderPosition.BEFOREEND);

  #renderFilmItems = (container, count, filmPresenters) => {
    for (let ii = 0; ii < Math.min(this._filmCards.length, count); ii++) {
      // const filmCard = new MoviePresenter(this._filmCards[ii]);
      // this.#renderBeforeEnd(container, filmCard.movie.element);
      const filmCard = this.#renderFilm(this._filmCards[ii], filmPresenters);
      this.#renderBeforeEnd(container, filmCard);

      // filmPresenters.set(film.id, filmPresenter);
    }
  };

  #initializeShowMoreClickHandler = (allFilmsContainer) => {
    let renderedFilmCardsCount = FILM_CARDS_COUNT_PER_STEP;
    this.#showMoreButton.setShowMoreHandler(() => {
      this._filmCards
        .slice(renderedFilmCardsCount, renderedFilmCardsCount + FILM_CARDS_COUNT_PER_STEP)
        .forEach((filmCard) => {
          const filmCardMore = this.#renderFilm(filmCard, this._filmPresentersRegular);
          this.#renderBeforeEnd(allFilmsContainer, filmCardMore);
        });
      renderedFilmCardsCount += FILM_CARDS_COUNT_PER_STEP;
      if (renderedFilmCardsCount >= this._filmCards.length) {
        this.#showMoreButton.remove();
      }
    });
  };

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
    this.#renderBeforeEnd(container, new SiteMenuView(this._filters).element);
    this.#renderBeforeEnd(container, new SiteSortView().element);
    this.#renderBeforeEnd(container, new SiteFilmsView().element);
    this.#renderFilms(container.querySelector('.films'));
    // this.#initializeShowPopupLink(this.#renderedFilmCards);
  };
}
