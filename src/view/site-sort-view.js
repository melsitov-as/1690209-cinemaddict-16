import AbstractView from './abstract-view.js';
import { SortType } from '../const.js';

const cssClass = (link, current) => link === current? ' sort__button--active': '';

export const createSiteSortTemplate = (currentSort) => `<ul class="sort">
    <li><a href="#default" class="sort__button${cssClass(SortType.DEFAULT, currentSort)}">Sort by default</a></li>
    <li><a href="#date" class="sort__button${cssClass(SortType.DATE, currentSort)}">Sort by date</a></li>
    <li><a href="#rating" class="sort__button${cssClass(SortType.RATING, currentSort)}">Sort by rating</a></li>
  </ul>`;

export default class SiteSortView extends AbstractView {
  #currentSort = null;

  constructor(currentSort) {
    super();
    this.#currentSort = currentSort;
  }

  get template() {
    return createSiteSortTemplate(this.#currentSort);
  }

  get element() {
    const result = super.element;

    result.addEventListener('click',(evt)=>{
      const {href} = evt.target;
      if(href){
        const parts = href.split('#');
        this.notify(parts[1]);
      }

    });

    return result;
  }
}
