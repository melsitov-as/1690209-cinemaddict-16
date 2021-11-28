import dayjs from 'dayjs';
import { getRandomPositiveFloat, getRandomPositiveInteger } from '../utils/common.js';

const IMAGES_LIST = [
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'the-dance-of-life.jpg',
  'the-man-with-the-golden-arm.jpg',
  'the-great-flamarion.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'made-for-each-other.png',
];

const TITLES_LIST = [
  'Popeye the Sailor Meets Sindbad the Sailor',
  'Sagebrush Trail',
  'The Dance of Life',
  'The Man with the Golden Arm',
  'The Great Flamarion',
  'Santa Claus Conquers the Martians',
  'Made for Each Other',
];

const formatWithIndex = (value, index)=>`${value} - ${1+index}`;
const makeArrayWithIndex = (count, value) => Array(count).fill(value).map(formatWithIndex);

const ORIGINAL_TITLES_LIST = makeArrayWithIndex(5,'Original Title');

const DIRECTORS_LIST = makeArrayWithIndex(5,'Director');

const SCREENWRITERS_LIST = makeArrayWithIndex(3,'Screenwriter');

const ACTORS_LIST = makeArrayWithIndex(5,'Actor');


const COUNTRIES_LIST = makeArrayWithIndex(5,'Country');

const GENRES_LIST = [
  ' Drama',
  ' Mystery',
  ' Comedy',
  ' Cartoon',
  ' Western',
  ' Musical',
];

export const SENTENCES_LIST = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  'Cras aliquet varius magna, non porta ligula feugiat eget. ',
  'Fusce tristique felis at fermentum pharetra. ',
  'Aliquam id orci ut lectus varius viverra. ',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
  'Sed sed nisi sed augue convallis suscipit in sed felis. ',
  'Aliquam erat volutpat. ',
  'Nunc fermentum tortor ac porta dapibus. ',
  'In rutrum ac purus sit amet tempus. ',
];

const EMOJIES_LIST = [
  'smile.png',
  'sleeping.png',
  'puke.png',
  'angry.png',
];

const AUTHORS_LIST = makeArrayWithIndex(5,'Author');


// Генерирует случайный элемент в массиве
export const getRandomItem = (data) => data[getRandomPositiveInteger(0, data.length - 1)];

const getRating = () => getRandomPositiveFloat(1, 10, 1);

// Класс Генерирует случайный массив

const shuffle = (array) => {
  for (let kk = 0; kk < array.length; kk++) {
    for (let ii = array.length - 1; ii > 0; ii--) {
      const jj = Math.floor(Math.random() * (ii + 1));
      [array[ii], array[jj]] = [array[jj], array[ii]];
    }
  }
  return array;
};

const getRandomArray = (array) => {
  const shuffeledArray = shuffle(array);
  const count = getRandomPositiveInteger(1, shuffeledArray.length);
  return shuffeledArray.slice(0, count);
};

const LAST_HANDRED_YEARS= 36500;
const LAST_ONE_YEAR = 365;
const MAX_COMMENT_MINUTES_GAP = 5256000;
  
const getRandomNegativeYears = (interval) => (-getRandomPositiveInteger(1, interval));

const getPastDate = (interval) => dayjs().add(getRandomNegativeYears(interval), 'day');

const getReleaseDate = () => getPastDate(LAST_HANDRED_YEARS);

const getGenreTitle = (data) => data.length === 1? 'Genre': 'Genres';

const getDescription = (data) => getRandomArray(data).join(' ');

const getShortDescription = (data) => data.length > 140? `${data.slice(0, 138)}&#8230;`: data;

const getAgeRating = () => `${getRandomPositiveInteger(0, 18)}+`;

const getDateWatched = (data) => (data === false)? false: getPastDate(LAST_ONE_YEAR);

const getCommentDate = () => dayjs().add(
  -getRandomPositiveInteger(
    0,
    MAX_COMMENT_MINUTES_GAP,
  ),
  'minutes',
).format('YYYY/MM/DD HH:mm');

const getComment = () => ({
  emoji: getRandomItem(EMOJIES_LIST),
  text: getRandomItem(SENTENCES_LIST),
  author: getRandomItem(AUTHORS_LIST),
  date: getCommentDate()
});

const getCommentsMockData = () => {
  const numberOfComments = getRandomPositiveInteger(0, 15);
  return Array.from({length: numberOfComments}, getComment);
};

const getCommentsTitle = (data) =>  (data === 1)?'comment': 'comments';

export const getFilmCardMockData = () => {
  const releaseDate = getReleaseDate();
  const genre = getRandomArray(GENRES_LIST);
  const description = getDescription(SENTENCES_LIST);
  const isWatched = Boolean(getRandomPositiveInteger(0, 1));
  const commentsData = getCommentsMockData();
  return {
    id: getRandomPositiveInteger(0, 10000),
    number: getRandomPositiveInteger(0, 10000),
    image: getRandomItem(IMAGES_LIST),
    title: getRandomItem(TITLES_LIST),
    originalTitle: getRandomItem(ORIGINAL_TITLES_LIST),
    rating: Number(getRating()),
    director: getRandomItem(DIRECTORS_LIST),
    screenwriters: getRandomArray(SCREENWRITERS_LIST),
    actors: getRandomArray(ACTORS_LIST),
    releaseDate: releaseDate,
    releaseDateDMY: releaseDate.format('DD MMMM YYYY'),
    year: releaseDate.format('YYYY'),
    totalDuration: getRandomPositiveInteger(0, 240),
    country: getRandomItem(COUNTRIES_LIST),
    genre: genre,
    genreTitle: getGenreTitle(genre),
    description: description,
    shortDescription: getShortDescription(description),
    ageRating: getAgeRating(),
    isInWatchlist: Boolean(getRandomPositiveInteger(0, 1)),
    isWatched: isWatched,
    isInFavorites: Boolean(getRandomPositiveInteger(0, 1)),
    dateWatched: getDateWatched(isWatched),
    isRegular: false,
    isTopRated: false,
    isMostCommented: false,
    comments: commentsData,
    commentsCount: commentsData.length,
    commentsTitle: getCommentsTitle(commentsData.length)
  };
};
