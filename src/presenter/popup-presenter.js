import SitePopupView from '../view/site-popup-view.js';
import SitePopupCommentView from '../view/site-popup-comment-view.js';
import {removeElement, replaceElement, renderBeforeEnd } from '../render.js';
import { UpdateType, UserAction } from '../const.js';

export default class PopupPresenter {
  #film = null;
  #popupView = null;
  #prevPopupView = null;
  #filmPopupContainer = null;
  #isComments = true;

  constructor(changeData) {
    this.#filmPopupContainer = document.body;
    this._changeData = changeData;
  }

  init = (film) => {
    this.#film = film;

    this.#prevPopupView = this.#popupView;
    this.#popupView = new SitePopupView(this.#film, this.#filmPopupContainer);

    this.#popupView.setPopupCloseHandler(this.#closePopup);
    this.#popupView.setWatchlistHandler(this.#handleWatchlistClick);
    this.#popupView.setWatchedHandler(this.#handleWatchedClick);
    this.#popupView.setFavoritesHandler(this.#handleFavoriteClick);
    this.#popupView.setChangeCommentsDataHandler(this.#handleChangeComments);
    if (this.#prevPopupView) {
      if (this.#filmPopupContainer.contains(this.#prevPopupView.element)) {
        replaceElement(this.#popupView, this.#prevPopupView);
        this.#isComments = false;
      }

      if (this.#isComments === false) {
        this.#renderComments(
          this.#filmPopupContainer.querySelector('.film-details__comments-list'),
          this.#prevPopupView.filmCardData);
      }
    }
  }

  get popup() {
    return this.#popupView;
  }

  destroy() {
    removeElement(this.#popupView);
  }

  #renderComments = (container, filmCardData) => {
    this.#checkCommentsContainer(container, filmCardData);
    this.#isComments = true;
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

   #getDeletedComment = (data) => {
     this._deletedComment = data;
   }

  #closePopup = () => {
    removeElement(this.#popupView);
    if (!this._isFocusOnInput) {
      this.#filmPopupContainer.classList.remove('hide-overflow');
    }
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
    if (this.#popupView.newComment.emoji && this.#popupView.newComment.text) {
      this.#film.comments.push(this.#popupView.newComment);
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
    const newCommentsCount = this.#film.comments.length;
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign({}, this.#film, {commentsCount: newCommentsCount}));
  }
}
