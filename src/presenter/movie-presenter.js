import SiteFilmCardView from '../view/site-film-card-view.js';
// import SitePopupView from '../view/site-popup-view.js';
import SitePopupCommentView from '../view/site-popup-comment-view.js';
import PopupPresenter from './popup-presenter.js';
import {removeElement, replaceElement, renderBeforeEnd } from '../render.js';
import { UpdateType, UserAction } from '../const.js';

export default class MoviePresenter {
  #film = null;
  #filmView = null;
  #filmPopupView = null;
  #filmsListContainer = null;
  #filmPopupContainer = null;

  constructor(filmsContainer, changeData, popupPresenter) {
    this.#filmsListContainer = filmsContainer;
    this.#filmPopupContainer = document.body;

    this._changeData = changeData;

    this._isComments = false;

    this._popupPresenter = popupPresenter;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmView = this.#filmView;

    this.#filmView = new SiteFilmCardView(this.#film);

    this.#filmView.setShowPopupHandler(this.#handleShowPopup);
    this.#filmView.setWatchlistHandler(this.#handleWatchlistClick);
    this.#filmView.setWatchedHandler(this.#handleWatchedClick);
    this.#filmView.setFavoritesHandler(this.#handleFavoriteClick);


    if (!prevFilmView) {
      renderBeforeEnd(this.#filmsListContainer, this.#filmView);
    }

    if (prevFilmView) {
      this.#replaceFilmCard(prevFilmView);
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

  #renderPopup = (container, popup) => {
    renderBeforeEnd(container, popup);
    this.#filmPopupContainer.classList.add('hide-overflow');
    this.#renderComments(
      this.#filmPopupContainer.querySelector('.film-details__comments-list'),
      popup.filmCardData);
  }

  #renderComments = (container, filmCardData) => {
    if (this._isComments === false) {
      this.#checkCommentsContainer(container, filmCardData);
      this._isComments = true;
    }
  };

   #checkCommentsContainer= (container, filmCardData) => {
     if (container) {
       filmCardData.comments.forEach((item) => {
         const newComment = new SitePopupCommentView(item, this.#getDeletedComment);
         renderBeforeEnd(container, newComment.element);
         //  this._commentsPresenter.set(newComment.commentData.id, newComment);
         newComment.setDeleteHandler(this.#handleDeleteComment);
       });
     }
   }

  #getDeletedComment = (data) => {
    this._deletedComment = data;
  }

  #handleShowPopup = () => {
    const popup = new PopupPresenter(this._changeData);
    popup.init(this.#film);
    this.#renderPopup(this.#filmPopupContainer, popup.popup);
    this.#removeDoublePopup();
    this._popupPresenter.set(popup.popup.filmCardData.id, popup);
  }

  #removeDoublePopup = () => {
    const openedPopups = this.#filmPopupContainer.querySelectorAll('.film-details');
    if (openedPopups.length > 1) {
      removeElement(openedPopups[0]);
    }
  }

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

  #handleDeleteComment = () => {
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
