import { getDuration } from './common.js';

const allGenres = [];
let drama = 0;
let mystery = 0;
let comedy = 0;
let cartoon = 0;
let western = 0;
let musical = 0;

const getAllFilmsWatched = (data) => {
  const filmsWatched = data.filter((item) => item.isWatched);

  return filmsWatched.length;
};

const getTotalDuration =(data) => {
  let allTotalDuration = 0;
  data.forEach((item) => {allTotalDuration += item.totalDuration;});
  const durationInHM = getDuration(allTotalDuration);

  return durationInHM;
};

const countGenres = (item) => {
  switch (item) {
    case ' Drama':
      drama += 1;
      break;
    case ' Mystery':
      mystery += 1;
      break;
    case ' Comedy':
      comedy += 1;
      break;
    case ' Cartoon':
      cartoon +=1 ;
      break;
    case ' Western':
      western += 1;
      break;
    case ' Musical':
      musical += 1;
  }
};

const countEachGenre = (data) => {
  data.forEach((item) => allGenres.push(...item.genre));
  allGenres.forEach((item) => countGenres(item));
};

export const countTopGenre = (data) => {
  let topGenreCount = 0;
  countEachGenre(data);
  topGenreCount = Math.max(drama, mystery, comedy, cartoon, western, musical);

  return topGenreCount;
};

export const getTopGenre = (data) => {
  const topGenreCount = countTopGenre(data);
  let topGenre = '';
  switch (topGenreCount) {
    case drama:
      topGenre = 'Drama';
      break;
    case mystery:
      topGenre = 'Mystery';
      break;
    case comedy:
      topGenre = 'Comedy';
      break;
    case cartoon:
      topGenre = 'Cartoon';
      break;
    case western:
      topGenre = 'Western';
      break;
    case musical:
      topGenre = 'Musical';
      break;
  }

  return topGenre;
};

export const getStatistics = (data) => {
  countEachGenre(data);
  return {
    allFilmsWatched: getAllFilmsWatched(data),
    totalDuration: getTotalDuration(data),
    topGenre: getTopGenre(data),
    drama: drama,
    mystery: mystery,
    comedy: comedy,
    cartoon: cartoon,
    western: western,
    musical: musical,
  };
};

