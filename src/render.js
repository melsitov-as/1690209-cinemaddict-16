import AbstractView from './view/abstract-view';

export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderHTMLElement = (container, element, place) => {
  switch (place) {
    case RenderPosition.BEFOREBEGIN:
      container.before(element);
      break;
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
  }
};

const ensureElement = (elementOrAbstract) => elementOrAbstract instanceof AbstractView?elementOrAbstract.element : elementOrAbstract;

export const renderElement = (container, elementOrAbstract, place) => renderHTMLElement(container, ensureElement(elementOrAbstract), place);

const removeHTMLElement = (element) => {
  if (!document.contains(element)) {
    return;
  }
  element.remove();
};

const checkIsElementCreated = (elementOrAbstract) => {
  if (elementOrAbstract.isElementCreated) {
    removeHTMLElement(elementOrAbstract.element);
  }
};

export const removeElement = (elementOrAbstract) => {
  if (elementOrAbstract instanceof AbstractView) {
    checkIsElementCreated(elementOrAbstract);
    return;
  }
  removeHTMLElement(elementOrAbstract);
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};
