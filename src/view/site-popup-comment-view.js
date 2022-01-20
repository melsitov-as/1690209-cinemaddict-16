import AbstractView from './abstract-view.js';

const createPopupCommentTemplate = (commentData) => `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${commentData.emoji}" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${commentData.text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${commentData.author}</span>
        <span class="film-details__comment-day">${commentData.date}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>
`;

export default class SitePopupCommentView extends AbstractView {
  #commentData = null;

  constructor(commentData) {
    super();
    this.#commentData = commentData;
  }

  get template() {
    return createPopupCommentTemplate(this.#commentData);
  }
}
