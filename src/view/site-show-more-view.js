import AbstractView from './abstract-view.js';

const createShowMoreTemplate = () => '<button type="button" class="films-list__show-more">Show more</button>';

export default class SiteShowMoreView extends AbstractView {
  get template() {
    return createShowMoreTemplate();
  }

  setShowMoreHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }
}
