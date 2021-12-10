import { createElement } from "../render.js";

const createSiteFilmsTemplate = () => '<section class="films"></section>';

export default class SiteFilmsView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createSiteFilmsTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
