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


// export const addStatus = (filmCardData) => {
//   const status = {
//     isInWatchlistActive: '',
//     isWatchedActive: '',
//     isInFavoritesActive: '',
//   };
//   if (filmCardData.isInWatchlist === true) {
//     status.isInWatchlistActive = 'film-card__controls-item--active';
//   }

//   if (filmCardData.isWatched === true) {
//     status.isWatchedActive = 'film-card__controls-item--active';
//   }

//   if (filmCardData.isInFavorites === true) {
//     status.isInFavoritesActive = 'film-card__controls-item--active';
//   }

//   return status;
// };

// export const addPopupStatus = (filmCardData) => {
//   const status = {
//     isInWatchlistActive: '',
//     isWatchedActive: '',
//     isInFavoritesActive: '',
//   };
//   if (filmCardData.isInWatchlist === true) {
//     status.isInWatchlistActive = 'film-details__control-button--active';
//   }

//   if (filmCardData.isWatched === true) {
//     status.isWatchedActive = 'film-details__control-button--active';
//   }

//   if (filmCardData.isInFavorites === true) {
//     status.isInFavoritesActive = 'film-details__control-button--active';
//   }

//   return status;
// };
