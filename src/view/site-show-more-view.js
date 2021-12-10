import { createElement } from "../render.js";

const createShowMoreTemplate = () => '<button type="button" class="films-list__show-more">Show more</button>';

export default class SiteShowMoreView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createShowMoreTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
