
export const generateFilter = (filmCards) => {
  const inWatchlist = filmCards.filter((filmCard) => filmCard.isInWatchlist);
  const inHistory = filmCards.filter((filmCard) => filmCard.isWatched);
  const inFavorites = filmCards.filter((filmCard) => filmCard.isInFavorites);

  return {
    inWatchlist: inWatchlist.length,
    inHistory: inHistory.length,
    inFavorites: inFavorites.length
  };
};
