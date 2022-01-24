import AbstractView from './abstract-view.js';

const createSiteAllFilmsTemplate = () => `<section class="films-list films-list--regular">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

    <div class="films-list__container">
    </div>
  </section>`;

export default class SiteAllFilmsView extends AbstractView {
  get template() {
    return createSiteAllFilmsTemplate();
  }
}
