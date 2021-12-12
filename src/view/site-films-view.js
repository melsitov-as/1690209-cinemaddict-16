import AbstractView from './abstract-view.js';

const createSiteFilmsTemplate = () => '<section class="films"></section>';

export default class SiteFilmsView extends AbstractView {
    get template() {
    return createSiteFilmsTemplate();
  }
}

