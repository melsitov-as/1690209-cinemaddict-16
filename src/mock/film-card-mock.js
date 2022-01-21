import dayjs from 'dayjs';
import { getRandomPositiveFloat, getRandomPositiveInteger } from '../utils/common.js';


const LAST_HANDRED_YEARS= 36500;
const LAST_ONE_YEAR = 365;
const MAX_COMMENT_MINUTES_GAP = 5256000;
const MAX_ID = 10000;
const MAX_DURATION = 240;
const MAX_COMMENTS = 15;
const RELEASE_DATE_FORMAT = 'DD MMMM YYYY';
const YEAR_FORMAT = 'YYYY';
export const COMMENTS_DATE_FORMAT = 'YYYY/MM/DD HH:mm';
const ELLIPSIS = '&#8230;';

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

const formatWithIndex = (value, index)=>`${value} - ${1+index}`;
const makeArrayWithIndex = (count, value) => Array(count).fill(value).map(formatWithIndex);

export const AUTHORS_LIST = makeArrayWithIndex(5,'Author');
const ORIGINAL_TITLES_LIST = makeArrayWithIndex(5,'Original Title');

const DIRECTORS_LIST = makeArrayWithIndex(5,'Director');

const SCREENWRITERS_LIST = makeArrayWithIndex(3,'Screenwriter');

const ACTORS_LIST = makeArrayWithIndex(5,'Actor');

const COUNTRIES_LIST = makeArrayWithIndex(5,'Country');

// Генерирует случайный элемент в массиве
export const getRandomItem = (data) => data[getRandomPositiveInteger(0, data.length - 1)];

const getRating = () => getRandomPositiveFloat(1, 10, 1);

// Класс Генерирует случайный массив

const shuffle = (array) => array.sort(()=>Math.random()-0.5);

const getRandomArray = (array) =>  shuffle(array).slice(0, getRandomPositiveInteger(1, array.length));

const getRandomNegativeYears = (interval) => (-getRandomPositiveInteger(1, interval));

const getPastDate = (interval) => dayjs().add(getRandomNegativeYears(interval), 'day');

const getReleaseDate = () => getPastDate(LAST_HANDRED_YEARS);

const getGenreTitle = (data) => data.length === 1? 'Genre': 'Genres';

const getDescription = (data) => getRandomArray(data).join(' ');

const getShortDescription = (data) => data.length > 140? `${data.slice(0, 138)}${ELLIPSIS};`: data;

const getAgeRating = () => `${getRandomPositiveInteger(0, 18)}+`;

const getDateWatched = (data) => (data === false)? false: getPastDate(LAST_ONE_YEAR);

const getCommentDate = () => dayjs().add(
  -getRandomPositiveInteger(
    0,
    MAX_COMMENT_MINUTES_GAP,
  ),
  'minutes',
).format(COMMENTS_DATE_FORMAT);

const getComment = () => ({
  id: getRandomPositiveInteger(0, MAX_ID),
  emoji: getRandomItem(EMOJIES_LIST),
  text: getRandomItem(SENTENCES_LIST),
  author: getRandomItem(AUTHORS_LIST),
  date: getCommentDate()
});

const getCommentsMockData = () => Array.from(
  {
    length: getRandomPositiveInteger(0, MAX_COMMENTS),
  },
  getComment,
);


const getCommentsTitle = (data) =>  (data === 1)?'comment': 'comments';

const getRandomFlag = ()=>Boolean(getRandomPositiveInteger(0, 1));

export const getFilmCardMockData = () => {
  const releaseDate = getReleaseDate();
  const genre = getRandomArray(GENRES_LIST);
  const description = getDescription(SENTENCES_LIST);
  const isWatched = getRandomFlag();
  const commentsData = getCommentsMockData();
  return {
    id: getRandomPositiveInteger(0, MAX_ID),
    number: getRandomPositiveInteger(0, MAX_ID),
    image: getRandomItem(IMAGES_LIST),
    title: getRandomItem(TITLES_LIST),
    originalTitle: getRandomItem(ORIGINAL_TITLES_LIST),
    rating: Number(getRating()),
    director: getRandomItem(DIRECTORS_LIST),
    screenwriters: getRandomArray(SCREENWRITERS_LIST),
    actors: getRandomArray(ACTORS_LIST),
    releaseDate: releaseDate,
    releaseDateDMY: releaseDate.format(RELEASE_DATE_FORMAT),
    year: releaseDate.format(YEAR_FORMAT),
    totalDuration: getRandomPositiveInteger(0, MAX_DURATION),
    country: getRandomItem(COUNTRIES_LIST),
    genre: genre,
    genreTitle: getGenreTitle(genre),
    description: description,
    shortDescription: getShortDescription(description),
    ageRating: getAgeRating(),
    isInWatchlist: getRandomFlag(),
    isWatched: isWatched,
    isInFavorites: getRandomFlag(),
    dateWatched: getDateWatched(isWatched),
    isRegular: false,
    isTopRated: false,
    isMostCommented: false,
    comments: commentsData,
    commentsCount: commentsData.length,
    commentsTitle: getCommentsTitle(commentsData.length)
  };
};
