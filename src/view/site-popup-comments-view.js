import { createElement } from "../render.js";

const createPopupCommentTemplate = (commentData) => `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${commentData.emoji}" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${commentData.text}"</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${commentData.author}"</span>
        <span class="film-details__comment-day">${commentData.date}"</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>
`;

export default class SitePopupCommentsView {
  #element = null;
  #commentData = null;

  constructor(commentData) {
    this.#commentData = commentData;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element
  }

  get template() {
    return createPopupCommentTemplate(this.#commentData);
  }

  get data() {
    console.log('commentData: ', this.#commentData);
    console.log('element: ', this.#element);
  }

  removeElement() {
    this.#element = null;
  }
}
