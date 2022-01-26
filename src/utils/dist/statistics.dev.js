"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatistics = exports.getTopGenre = exports.countTopGenre = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var allGenres = [];
var drama = 0;
var mystery = 0;
var comedy = 0;
var cartoon = 0;
var western = 0;
var mysical = 0;

var getAllFilmsWatched = function getAllFilmsWatched(data) {
  return data.filter(function (item) {
    return item.isWatched;
  });
};

var getTotalDuration = function getTotalDuration(data) {
  var allTotalDuration = 0;
  data.forEach(function (item) {
    return allTotalDuration + item.totalDuration;
  });
  return allTotalDuration;
};

var countGenres = function countGenres(item) {
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
      cartoon += 1;
      break;

    case ' Western':
      western += 1;
      break;

    case ' Mysical':
      mysical += 1;
  }
};

var countTopGenre = function countTopGenre(data) {
  var topGenreCount = 0;
  data.forEach(function (item) {
    return allGenres.push.apply(allGenres, _toConsumableArray(item.genre));
  });
  allGenres.forEach(function (item) {
    return countGenres(item);
  });
  topGenreCount = Math.max(drama, mystery, comedy, cartoon, western, mysical);
  return topGenreCount;
};

exports.countTopGenre = countTopGenre;

var getTopGenre = function getTopGenre(data) {
  var topGenreCount = countTopGenre(data);
  var topGenre = '';

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

    case mysical:
      topGenre = 'Mysical';
      break;
  }

  return topGenre;
};

exports.getTopGenre = getTopGenre;

var getStatistics = function getStatistics(data) {
  return {
    allFilmsWatched: getAllFilmsWatched(data),
    totalDuration: getTotalDuration(data),
    topGenre: getTopGenre(data),
    drama: drama
  };
};

exports.getStatistics = getStatistics;