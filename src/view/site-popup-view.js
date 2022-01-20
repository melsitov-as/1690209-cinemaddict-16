import { getDuration, isEscKey, isCtrlCommandEnterKey } from '../utils/common.js';
import { addPopupStatus } from '../utils/common.js';
import AbstractView from './abstract-view.js';
import { renderBeforeEnd } from '../render.js';
import dayjs from 'dayjs';
import { getRandomItem, AUTHORS_LIST, COMMENTS_DATE_FORMAT } from '../mock/film-card-mock.js';
import SitePopupCommentView from '../view/site-popup-comment-view.js';

const createPopupTemplate = (filmCardData) => {
  const durationInHM = getDuration(filmCardData.totalDuration);
  const status = addPopupStatus(filmCardData);

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${filmCardData.image}" alt="">

          <p class="film-details__age">${filmCardData.ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmCardData.title}</h3>
              <p class="film-details__title-original">${filmCardData.originalTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmCardData.rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmCardData.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${filmCardData.screenwriters}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${filmCardData.actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${filmCardData.releaseDateDMY}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${durationInHM}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${filmCardData.country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${filmCardData.genreTitle}</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${filmCardData.genre}</span>
            </tr>
          </table>

          <p class="film-details__film-description">
          ${filmCardData.description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${status.isInWatchlistActive}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${status.isWatchedActive}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${status.isInFavoritesActive}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmCardData.commentsCount}</span></h3>

        <ul class="film-details__comments-list"></ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji" data-emoji="smile.png">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji" data-emoji="sleeping.png">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji" data-emoji="puke.png">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji" data-emoji="angry.png">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class SitePopupView extends AbstractView {
  #filmCard = null;
  #popupCloseButton = null;
  #document = null;

  constructor(filmCardData, document) {
    super();
    // this.#filmCardData = filmCardData;
    this.#filmCard = filmCardData;
    this.#document = document;
    this._newComment = new Object();

    this._commentsContainer = this.element.querySelector('.film-details__comments-list');
    this._emojiIconContainer = this.element.querySelector('.film-details__add-emoji-label');
    this._input = this.element.querySelector('.film-details__comment-input');
    this._isFocusOnInput = false;

    this.#setInnerHandlers();
  }

  #setInnerHandlers = () => {
    this.setInputCallback();
    this.setChangeEmojiHandler();
    this.addAuthor();
    this.addDate();
    this.setFocusOnInput();
    this.setBlurOnInput();
  }

  setInputCallback = () => {
    this._input.addEventListener('input', this.#inputCallback);
  }

  #inputCallback = (evt) => {
    if (evt) {
      this._newComment.text = evt.target.value;
    }
  }

  setChangeEmojiHandler = () => {
    this.element.querySelectorAll('.film-details__emoji-label').forEach((item) => {
      item.querySelector('img').addEventListener('click', this.#changeEmojiHandler);
    });
  }

  #changeEmojiHandler = (evt) => {
    this._newCommentEmojiIcon = evt.target.cloneNode(true);
    this._newCommentEmojiIcon.style.width = '55px';
    this._newCommentEmojiIcon.style.height = '55px';
    renderBeforeEnd(this._emojiIconContainer, this._newCommentEmojiIcon);
    this._newComment.emoji = this._newCommentEmojiIcon.dataset.emoji;
    this.#removeManyEmojies();
  }

  #removeManyEmojies = () => {
    this._emojiIcons = this._emojiIconContainer.querySelectorAll('img');
    if (this._emojiIcons.length > 1) {
      this._emojiIcons[0].remove();
    }
  }

  addAuthor = () => {
    this._newComment.author = getRandomItem(AUTHORS_LIST);
  }

  addDate = () => {
    this._newComment.date = dayjs().format(COMMENTS_DATE_FORMAT);
  }


  setChangeCommentsDataHandler = (callbackChangeComments) => {
    this._callbackChangeComments.keydown = callbackChangeComments;
    document.addEventListener('keydown', this.#isChangeCommentsDataHandler);
  }

  #isChangeCommentsDataHandler = (evt) => {
    if (!isCtrlCommandEnterKey(evt)) {
      return;
    }
    this._callbackChangeComments.keydown();
    if (this._newComment.emoji && this._newComment.text) {
      renderBeforeEnd(this._commentsContainer, new SitePopupCommentView(this._newComment).element);
    }
  }

  get template() {
    return createPopupTemplate(this.#filmCard);
  }

  setPopupCloseHandler = (closePopup) => {
    this._callback.closePopup = closePopup;
    this.#popupCloseButton = this.element.querySelector('.film-details__close-btn');
    this.#popupCloseButton.addEventListener('click', this.#handleCloseButtonClick);
    this.#document.addEventListener('keydown', this.#handleDocumentKeydown);
  }

  #handleCloseButtonClick = (evt) => {
    evt.preventDefault();
    this.#checkAndEraseInputAndEmoji();
    this._callback.closePopup();
  }

  #eraseInputValueEmojiContainerOrClosePopup = () => {
    if (this._emojiIconContainer.contains(this._newCommentEmojiIcon) || this._input.value !== '') {
      this._input.value = '';
      this._newCommentEmojiIcon.remove();
      this._emojiIcons = [];
    } else {
      this._callback.closePopup();
    }
  }

  #checkAndEraseInputAndEmoji = () => {
    if (this._isFocusOnInput || this._emojiIconContainer.contains) {
      this.#eraseInputValueEmojiContainerOrClosePopup();
      this._newComment.text = undefined;
      this._newComment.emoji = undefined;
    } else {
      this._callback.closePopup();
    }
  }

  #handleDocumentKeydown = (evt)=>{
    if(!isEscKey(evt)){
      return;
    }
    this.#checkAndEraseInputAndEmoji();
    this.#document.classList.add('hide-overflow');
  }

  setFocusOnInput = () => this._input.addEventListener('focus', this.#isFocusOnInput);


  #isFocusOnInput = (evt) =>  {
    if (!evt) {
      return;
    }
    this._isFocusOnInput = true;
  }

  setBlurOnInput = () => this._input.addEventListener('blur', this.#isBlurOnInput);

  #isBlurOnInput = (evt) => {
    if (!evt) {
      return;
    }
    this._isFocusOnInput = false;
  }

  #isInWatchlistHandler = () => {
    this._callbackWatchlist.click();
  }

  #isInFavoritesHandler = () => {
    this._callbackInFavorites.click();
  }

  #isWatchedHandler = () => {
    this._callbackWatched.click();
  }

  setWatchlistHandler = (callback) => {
    this._callbackWatchlist.click = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#isInWatchlistHandler);
  }

  setWatchedHandler = (callback) => {
    this._callbackWatched.click = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#isWatchedHandler);
  }

  setFavoritesHandler = (callback) => {
    this._callbackInFavorites.click = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#isInFavoritesHandler);
  }
}
