import AbstractView from './abstract-view.js';

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const createSiteSortTemplate = () => `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`;

export default class SiteSortView extends AbstractView {
  get template() {
    return createSiteSortTemplate();
  }

  #changeActiveStatus = (evtData) => {
    const buttons = this.element.querySelectorAll('.sort__button');
    for (const button of buttons) {
      if (button === evtData.target) {
        button.classList.add('sort__button--active');
      }
      if (button !== evtData.target) {
        button.classList.remove('sort__button--active');
      }
    }
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);

    this.#changeActiveStatus(evt);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }
}
