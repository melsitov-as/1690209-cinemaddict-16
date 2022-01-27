import { getDurationInHandM } from './common.js';

let drama = 0;
let mystery = 0;
let comedy = 0;
let cartoon = 0;
let western = 0;
let musical = 0;

let allGenres = [];


const getAllFilmsWatched = (data) => {
  const filmsWatched = data.filter((item) => item.isWatched);

  if (filmsWatched.length > 0) {
    return filmsWatched.length;
  } else if (filmsWatched.length === 0) {
    return 0;
  }
};

const getTotalDuration =(data) => {
  let allTotalDuration = 0;
  data.forEach((item) => {allTotalDuration += item.totalDuration;});
  const durationInHM = getDurationInHandM(allTotalDuration);

  return durationInHM;
};

const countGenres = (item) => {
  const genresWithCounts = {
    drama: 0,
    mystery: 0,
    comedy: 0,
    cartoon: 0,
    western: 0,
    musical: 0
  };

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

      return genresWithCounts;
  }
};


const countEachGenre = (data) => {
  data.forEach((item) => allGenres.push(...item.genre));
  allGenres.forEach((item) => countGenres(item));
};

const countTopGenre = (data) => {
  let topGenreCount = 0;
  countEachGenre(data);
  topGenreCount = Math.max(drama, mystery, comedy, cartoon, western, musical);

  return topGenreCount;
};

const getTopGenre = (data) => {
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

const generateStatistics = (data) => {
  countEachGenre(data);
  const totalDuration = getTotalDuration(data);
  return {
    allFilmsWatched: getAllFilmsWatched(data),
    totalDurationH: totalDuration.hours,
    totalDurationM: totalDuration.minutes,
    topGenre: getTopGenre(data),
    drama: drama,
    mystery: mystery,
    comedy: comedy,
    cartoon: cartoon,
    western: western,
    musical: musical,
  };
};

const reset = () => {
  allGenres = [];
  drama = 0;
  mystery = 0;
  comedy = 0;
  cartoon = 0;
  western = 0;
  musical = 0;
};

export const getStatistics = (data) => {
  const statistics = generateStatistics(data);
  reset();
  return statistics;
};

