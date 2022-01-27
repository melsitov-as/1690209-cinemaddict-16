
import { getDurationInHandM } from './common.js';

const MINUTES_PER_HOUR = 60;

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

/**
 *
 * @typedef {Object} CompleteStatistics
 * @property {number} allFilmsWatched
 * @property {number} totalDurationH
 * @property {number} totalDurationM
 * @property {string} topGenre
 * @property {number} drama
 * @property {number} mystery
 * @property {number} comedy
 * @property {number} cartoon
 * @property {number} western
 * @property {number} musical
 */

/**
 * @typedef {object} GenreCounts
 * @property {number} drama
 * @property {number} mystery
 * @property {number} comedy
 * @property {number} cartoon
 * @property {number} western
 * @property {number} musical
 */

/**
 *
 * @typedef {object} StatisticsInProgress
 * @property {number} filmCount
 * @property {number} totalDuration
 * @property {GenreCounts} genreCounts
 */

/**
 * @typedef {object} FilmCard
 * @property {number} totalDuration
 * @property {string[]} genre
 * @property {boolean} isWatched
 * @property {import('dayjs').Dayjs} dateWatched
 */
/**
 * @callback Reducer
 * @param {StatisticsInProgress} currentStatistics
 * @param {FilmCard} film
 * @returns {StatisticsInProgress}
 */


/**
 *
 * @param {GenreCounts} genreCounts
 * @param {string} genre
 * @returns {GenreCounts}
 */
const collectGenreCounts = (genreCounts, genre)=>({...genreCounts, [genre]: (genreCounts[genre] +1) || 1});

/**
 *
 * @param {import('dayjs').Dayjs | 'all'} rangeBegin
 * @param {import('dayjs').Dayjs} dateWatched
 * @returns {boolean}
 */
const isDateWatchedWithinRange = (rangeBegin, dateWatched)=>rangeBegin === 'all' || rangeBegin.diff(dateWatched)<0;

/**
 *
 * @returns {StatisticsInProgress}
 */

const getInitialValue = ()=>( {
  allFilmsWatched: 0,
  totalDurationH: 0,
  totalDurationM: 0,
  topGenre: '',
  drama: 0,
  mystery: 0,
  comedy: 0,
  cartoon: 0,
  western: 0,
  musical: 0,
});

/**
 *
 * @param {[string,number]} accumulator
 * @param {[string,number]} entry
 * @returns {[string,number]}
 */
const takeMax = (accumulator, entry)=>accumulator[1]>entry[1]?accumulator:entry;

/**
 *
 * @param {GenreCounts} genreCounts
 * @returns {string}
 */
const getTopGenre2 = (genreCounts)=>Object.entries(genreCounts).reduce(takeMax, ['',0]);


/**
 * @param {import('dayjs').Dayjs | 'all'} rangeBegin
 *
 * @returns {Reducer}
 */

const collectFilmStatistics = (rangeBegin)=>(currentStatistics, film)=>{
  const {isWatched, dateWatched, genre, totalDuration} = film;
  if(!isWatched || !isDateWatchedWithinRange(rangeBegin,dateWatched)){
    return currentStatistics;
  }
  return {
    filmCount: currentStatistics.filmCount+1,
    genreCounts: genre.reduce(collectGenreCounts, currentStatistics.genreCounts),
    totalDuration: currentStatistics.totalDuration + totalDuration
  };
};

/**
 *
 * @param {StatisticsInProgress} statisticsInProgress
 * @returns {CompleteStatistics}
 */
const transform = (statisticsInProgress)=>({
  allFilmsWatched: statisticsInProgress.filmCount,
  topGenre: getTopGenre2(statisticsInProgress.genreCounts),
  totalDurationH: Math.floor(statisticsInProgress.totalDuration/MINUTES_PER_HOUR),
  totalDurationM: Math.floor(statisticsInProgress.totalDuration%MINUTES_PER_HOUR),

  ...statisticsInProgress.genreCounts
});

/**
 *
 * @param {FilmCard[]} films
 * @param {import('dayjs').Dayjs | 'all'} date
 */
export const getStatisticsAtOnce = (films, date)=>transform(
  films.reduce(
    collectFilmStatistics(date),
    getInitialValue(),
  ),
);
