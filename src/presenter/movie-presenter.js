import SiteFilmCardView from '../view/site-film-card-view.js';
import SitePopupView from '../view/site-popup-view.js';
import SitePopupCommentsView from '../view/site-popup-comments-view.js';
import { renderElement, RenderPosition, removeElement } from '../render.js';

export default class MoviePresenter {
  #film = null;
  #filmView = null;
  #filmPopupContainer = null;

  constructor(film) {
    this.#film = film;
    this.#filmView = new SiteFilmCardView(this.#film);
    this.#filmPopupContainer = document.body;
  }

  init = () => {
    this.#initializeShowPopupLink(this.#filmView);
  }

  get movie() {
    return this.#filmView;
  }

  #renderBeforeEnd = (container, element) => renderElement(container, element, RenderPosition.BEFOREEND);

  #renderPopup = (data) => {
    const filmDetails = new SitePopupView(data, document);
    this.#renderBeforeEnd(
      this.#filmPopupContainer,
      filmDetails
    );
    this.#filmPopupContainer.classList.add('hide-overflow');
    this.#renderComments(
      document.querySelector('.film-details__comments-list'),
      data
    );
    this.#initializePopupCloseButton(filmDetails);
  };

  #renderComments = (container, filmCardData) => {
    filmCardData.comments.forEach((item) => {
      this.#renderBeforeEnd(container, new SitePopupCommentsView(item).element);
    });
  };

  #initializePopupCloseButton = (filmDetailsData) => {
    if(filmDetailsData === null){
      return;
    }
    const closePopup = () => {
      removeElement(filmDetailsData);
      this.#filmPopupContainer.classList.remove('hide-overflow');
    };
    filmDetailsData.setPopupCloseHandler(closePopup);
  };

  #initializeShowPopupLink = (data) => {
    data.setShowPopupHandler(() => {
      this.#renderPopup(data.filmCardData);
      this.#filmPopupContainer.classList.add('hide-overflow');
    });
  };

}
