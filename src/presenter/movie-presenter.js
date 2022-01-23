import SiteFilmCardView from '../view/site-film-card-view.js';
import SitePopupView from '../view/site-popup-view.js';
import SitePopupCommentView from '../view/site-popup-comment-view.js';
import {removeElement, replaceElement, renderBeforeEnd } from '../render.js';
import { UpdateType, UserAction } from '../const.js';

export default class MoviePresenter {
  #film = null;
  #filmView = null;
  #filmPopupView = null;
  #prevFilmPopupView = null;
  #filmsListContainer = null;
  #filmPopupContainer = null;

  constructor(filmsContainer, changeData, popupStatus) {
    this.#filmsListContainer = filmsContainer;
    this.#filmPopupContainer = document.body;

    this._changeData = changeData;

    this._isComments = false;

    this._popupStatus = popupStatus;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmView = this.#filmView;

    this.#filmView = new SiteFilmCardView(this.#film);

    this.#prevFilmPopupView = this.#filmPopupView;
    this.#filmPopupView = new SitePopupView(this.#film, this.#filmPopupContainer);


    this.#initializeShowPopupLink(this.#filmView);
    // this.#filmPopupView.setPopupCloseHandler(this.#closePopup);
    // this.#initializePopupCloseButton(prevFilmPopupView);


    this.#filmView.setWatchlistHandler(this.#handleWatchlistClick);
    this.#filmView.setWatchedHandler(this.#handleWatchedClick);
    this.#filmView.setFavoritesHandler(this.#handleFavoriteClick);


    if (!prevFilmView) {
      renderBeforeEnd(this.#filmsListContainer, this.#filmView);
    }

    if (prevFilmView) {
      this.#replaceFilmCard(prevFilmView);
    }

    if (this.#prevFilmPopupView) {
      this.#replacePopup(this.#prevFilmPopupView);
    }
  }


  get movie() {
    return this.#filmView;
  }

  get popup() {
    return this.#filmPopupView;
  }

  get isComments() {
    return this._isComments;
  }

  set isComments(value) {
    this._isComments = value;
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
    this.#filmPopupView.setPopupCloseHandler(this.#closePopup);
    this._isComments = true;
  }

  #closePopup = () => {
    removeElement(this.#filmPopupView);
    if (!this._isFocusOnInput) {
      this.#filmPopupContainer.classList.remove('hide-overflow');
    }
    this._popupStatus(false);
  };

  #getDeletedComment = (data) => {
    this._deletedComment = data;
  }

  #checkCommentsContainer= (container, filmCardData) => {
    if (container) {
      filmCardData.comments.forEach((item) => {
        const newComment = new SitePopupCommentView(item, this.#getDeletedComment);
        renderBeforeEnd(container, newComment.element);
        newComment.setDeleteHandler(this.#handleDeleteComment);
      });
    }
  }


  #renderComments = (container, filmCardData) => {
    if (this._isComments === false) {
      this.#checkCommentsContainer(container, filmCardData);
      this._isComments = true;
    }
  };

  renderPopup = (data, container, popupView) => {
    renderBeforeEnd(
      container,
      popupView);
    this.#filmPopupContainer.classList.add('hide-overflow');
    this.#renderComments(
      popupView.element.querySelector('.film-details__comments-list'),
      data
    );
    this.#filmPopupView.setPopupCloseHandler(this.#closePopup);
    this.#filmPopupView.setWatchlistHandler(this.#handleWatchlistClick);
    this.#filmPopupView.setWatchedHandler(this.#handleWatchedClick);
    this.#filmPopupView.setFavoritesHandler(this.#handleFavoriteClick);
    this.#filmPopupView.setChangeCommentsDataHandler(this.#handleChangeComments);
    this._popupStatus(true);
  };

  removeDoublePopup = () => {
    const openedPopups = this.#filmPopupContainer.querySelectorAll('.film-details');
    if (openedPopups.length > 1) {
      removeElement(openedPopups[0]);
    }
  }

  #initializeShowPopupLink = (data) => {
    data.setShowPopupHandler(() => {
      this.renderPopup(data.filmCardData, this.#filmPopupContainer, this.#filmPopupView);
      this.removeDoublePopup();
    });
  };

  #handleWatchlistClick = () => {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign({}, this.#film, { isInWatchlist: !this.#film.isInWatchlist }));
  }

  #handleWatchedClick = () => {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign({}, this.#film, { isWatched: !this.#film.isWatched }));
  }

  #handleFavoriteClick = () => {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign({}, this.#film, { isInFavorites: !this.#film.isInFavorites }));
  }

  #handleChangeComments = () => {
    this._isComments = true;
    const newCommentsCount = this.#film.commentsCount += 1;
    if (this.#filmPopupView._newComment.emoji && this.#filmPopupView._newComment.text) {
      this.#film.comments.push(this.#filmPopupView._newComment);
      this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign({}, this.#film, { commentsCount: newCommentsCount}));
    }
  }

  #handleDeleteComment = () => {
    this._isComments = true;
    this.#film.comments.forEach((item) => {
      if (item.id === this._deletedComment.commentData.id) {
        const indexOfCurrentComment = this.#film.comments.indexOf(item);
        this.#film.comments.splice(indexOfCurrentComment, 1);
      }
    });
    const newCommentsCount = this.#film.commentsCount -= 1;
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign({}, this.#film, {commentsCount: newCommentsCount}));
  }
}
