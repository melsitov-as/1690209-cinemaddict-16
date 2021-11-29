const initCounter = {
  inWatchlist: 0,
  inHistory: 0,
  inFavorites: 0
};

const boolToInt = (flag)=>flag?0:1;

const counterReducer = (accumulator, current) =>{
  accumulator.inWatchlist += boolToInt(current.isInWatchlist);
  accumulator.inHistory += boolToInt(current.isWatched);
  accumulator.inFavorites += boolToInt(current.isInFavorites);
  return accumulator;
};

export const generateFilter = (filmCards) =>  filmCards.reduce(counterReducer,{...initCounter});
