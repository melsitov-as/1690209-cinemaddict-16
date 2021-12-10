import { createElement } from '../render.js';

const createSiteMostCommentedFilmsTemplate = () => `<section class="films-list films-list--extra films-list--most-commented">
  <h2 class="films-list__title">Most Commented</h2>

  <div class="films-list__container">
  </div>
  </section>`;

export default class SiteMostCommentedFilmsView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createSiteMostCommentedFilmsTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
