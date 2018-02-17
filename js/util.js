'use strict';

(function () {
  // получение случайного элемента массива
  var getRandomArrayElement = function (collection) {
    var randomElement = collection[Math.floor(Math.random() * collection.length)];
    return randomElement;
  };

  // получение случайного числа
  var getRandomNumber = function (count) {
    var number = Math.floor(Math.random() * count);
    return number;
  };

  // получение случайного числа из диапазона
  var getRandomNumberFromRange = function (min, max) {
    var number = getRandomNumber(max + 1 - min) + min;
    return number;
  };

  // получение случайного местонахождения
  var getRandomLocation = function (coord) {
    var randomLocation = {};
    randomLocation.x = getRandomNumberFromRange(coord.minX, coord.maxX);
    randomLocation.y = getRandomNumberFromRange(coord.minY, coord.maxY);
    return randomLocation;
  };

  // получение случайного массива из существующего
  var getRandomArrayFromExisting = function (array) {
    var newArray = array.slice();

    function compareRandom() {
      return Math.random() - 0.5;
    }
    newArray.sort(compareRandom);
    newArray.length = getRandomNumberFromRange(1, array.length);
    return newArray;
  };

  // функция переключения активного состояния элементов массива
  var toggleDisabled = function (collection) {
    collection.forEach(function (item) {
      item.disabled = !item.disabled;
    });
  };

  window.util = {
    getRandomArrayElement: getRandomArrayElement,
    getRandomNumber: getRandomNumber,
    getRandomNumberFromRange: getRandomNumberFromRange,
    getRandomLocation: getRandomLocation,
    getRandomArrayFromExisting: getRandomArrayFromExisting,
    toggleDisabled: toggleDisabled
  };
})();