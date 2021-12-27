import dayjs from 'dayjs';

const CSS_SELECTOR_CARD_CONTROL_ACTIVE = 'film-card__controls-item--active';
const CSS_SELECTOR_DETAILS_CONTROL_ACTIVE = 'film-details__control-button--active';

// Генерирует случайное дробное число
export const getRandomPositiveFloat = (a, b, digits = 1) => {
  const lower = Math.min(Math.abs(a), Math.abs(b));
  const upper = Math.max(Math.abs(a), Math.abs(b));
  const result = Math.random() * (upper - lower) + lower;
  return result.toFixed(digits);
};

// Генерирует случайное целое число
export const getRandomPositiveInteger = (a, b) => {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

// Длительность фильма
export const getDuration = (data) => {
  if (data < 60) {
    return `${data % 60}m`;
  } else if (data === 60) {
    return `${data / 60}h`;
  } else {
    return `${Math.floor(data / 60)}h ${data % 60}m`;
  }
};

const getStringOrEmpty = (flag, value)=>flag?value:'';

const getCardSelector = (flag)=>getStringOrEmpty(flag,CSS_SELECTOR_CARD_CONTROL_ACTIVE);
const getDetailsSelector = (flag)=>getStringOrEmpty(flag, CSS_SELECTOR_DETAILS_CONTROL_ACTIVE);

export const addStatus = (filmCardData) => ({
  isInWatchlistActive: getCardSelector(filmCardData.isInWatchlist),
  isWatchedActive: getCardSelector(filmCardData.isWatched),
  isInFavoritesActive: getCardSelector(filmCardData.isInFavorites),
});

export const addPopupStatus = (filmCardData) => ( {
  isInWatchlistActive: getDetailsSelector(filmCardData.isInWatchlist),
  isWatchedActive: getDetailsSelector(filmCardData.isWatched),
  isInFavoritesActive: getDetailsSelector(filmCardData.isInFavorites),
});

export const isEscKey = (evt)=>(evt.key === 'Escape' || evt.key === 'esc');

export const isCtrlCommandEnterKey = (evt) => ((evt.ctrlKey && evt.key === 'Enter') || (evt.commandKey && evt === 'Enter'));

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const sortByDate = (filmA, filmB) => dayjs(filmB.releaseDate).diff(dayjs(filmA.releaseDate));

export const callbackForEachLimited = (items, count, callback) => {
  Array.from(
    {length:Math.min(items.length, count)
    },
    (_, ix) => callback(items[ix]),
  );
};

export const sortByRating = (a, b) => b.rating - a.rating;

export const sortByComments = (a, b) => b.commentsCount - a.commentsCount;
