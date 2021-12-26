import SiteFilmCardView from '../view/site-film-card-view.js';
import SitePopupView from '../view/site-popup-view.js';
import SitePopupCommentsView from '../view/site-popup-comments-view.js';
import { renderElement, RenderPosition, removeElement, replaceElement } from '../render.js';

export default class MoviePresenter {
  #film = null;
  #filmView = null;
  #filmPopupView = null;
  #prevFilmPopupView = null;
  #filmsListContainer = null;
  #filmPopupContainer = null;

  constructor(filmsContainer, changeData) {
    this.#filmsListContainer = filmsContainer;
    this.#filmPopupContainer = document.body;

    this._changeData = changeData;

    this._isComments = false;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmView = this.#filmView;

    this.#filmView = new SiteFilmCardView(this.#film);

    this.#prevFilmPopupView = this.#filmPopupView;
    this.#filmPopupView = new SitePopupView(this.#film, this.#filmPopupContainer);


    this.#initializeShowPopupLink(this.#filmView);
    this.#filmPopupView.setPopupCloseHandler(this.#closePopup);
    // this.#initializePopupCloseButton(prevFilmPopupView);


    this.#filmView.setWatchlistHandler(this.#handleWatchlistClick);
    this.#filmView.setWatchedHandler(this.#handleWatchedClick);
    this.#filmView.setFavoritesHandler(this.#handleFavoriteClick);


    if (!prevFilmView) {
      this.#renderBeforeEnd(this.#filmsListContainer, this.#filmView);
    }

    if (prevFilmView) {
      this.#replaceFilmCard(prevFilmView);
    }

    this.#filmPopupView.setWatchlistHandler(this.#handleWatchlistClick);
    this.#filmPopupView.setWatchedHandler(this.#handleWatchedClick);
    this.#filmPopupView.setFavoritesHandler(this.#handleFavoriteClick);


    if (this.#prevFilmPopupView) {
      this.#replacePopup(this.#prevFilmPopupView);
    }
  }


  get movie() {
    return this.#filmView;
  }

  destroy() {
    removeElement(this.#filmView);
    removeElement(this.#filmPopupView);
  }

  #replaceFilmCard = (prevFilmViewData) => {
    if (this.#filmsListContainer.contains(prevFilmViewData.element)) {
      replaceElement(this.#filmView, prevFilmViewData);
    }
  };

  #replacePopup = (prevFilmPopupViewData) => {
    this._isComments = false;
    if (this.#filmPopupContainer.contains(prevFilmPopupViewData.element)) {
      replaceElement(this.#filmPopupView, prevFilmPopupViewData);
    }
    this.#renderComments(document.querySelector('.film-details__comments-list'), this.#film);
  }

  #renderBeforeEnd = (container, element) => renderElement(container, element, RenderPosition.BEFOREEND);

  #closePopup = () => {
    removeElement(this.#filmPopupView);
    this.#filmPopupContainer.classList.remove('hide-overflow');
  };

  #renderComments = (container, filmCardData) => {
    if (this._isComments === false) {
      filmCardData.comments.forEach((item) => {
        this.#renderBeforeEnd(container, new SitePopupCommentsView(item).element);
      });
      this._isComments = true;
    }

  };

  #renderPopup = (data) => {
    this.#renderBeforeEnd(
      this.#filmPopupContainer,
      this.#filmPopupView);
    this.#filmPopupContainer.classList.add('hide-overflow');
    this.#renderComments(
      document.querySelector('.film-details__comments-list'),
      data
    );
    this.#filmPopupView.setChangeCommentsDataHandler(this.#handleChangeComments);
  };

  #removeDoublePopup = () => {
    const openedPopups = this.#filmPopupContainer.querySelectorAll('.film-details');
    if (openedPopups.length > 1) {
      removeElement(openedPopups[0]);
    }
  }

  #initializeShowPopupLink = (data) => {
    data.setShowPopupHandler(() => {
      this.#renderPopup(data.filmCardData);
      this.#removeDoublePopup();
    });
  };

  #handleWatchlistClick = () => {
    this._changeData(Object.assign({}, this.#film, { isInWatchlist: !this.#film.isInWatchlist }));
  }

  #handleWatchedClick = () => {
    this._changeData(Object.assign({}, this.#film, { isWatched: !this.#film.isWatched }));
  }

  #handleFavoriteClick = () => {
    this._changeData(Object.assign({}, this.#film, { isInFavorites: !this.#film.isInFavorites }));
  }

  #handleChangeComments = () => {
    const newCommentsCount = this.#film.commentsCount += 1;
    if (this.#filmPopupView._newComment.emoji && this.#filmPopupView._newComment.text) {
      this.#film.comments.push(this.#filmPopupView._newComment);
      this._changeData(Object.assign({}, this.#film, { commentsCount: newCommentsCount}));
    }
  }
}
