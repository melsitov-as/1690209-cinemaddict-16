import AbstractView from './abstract-view.js';

const createSiteMostCommentedFilmsTemplate = () => `<section class="films-list films-list--extra films-list--most-commented">
  <h2 class="films-list__title">Most Commented</h2>

  <div class="films-list__container">
  </div>
  </section>`;

export default class SiteMostCommentedFilmsView extends AbstractView {
  get template() {
    return createSiteMostCommentedFilmsTemplate();
  }
}

