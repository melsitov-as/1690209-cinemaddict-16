import SitePopupView from '../view/site-popup-view.js';
import SitePopupCommentsView from '../view/site-popup-comments-view.js';
import { renderElement, RenderPosition, removeElement, replaceElement } from '../render.js';

export default class PopupPresenter {
  #popupContainer = null;

  constructor (popupContainer, changeData) {
    this.#popupContainer = popupContainer;

    this._changeData = changeData;
  }
}
