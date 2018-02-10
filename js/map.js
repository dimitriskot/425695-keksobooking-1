'use strict';

var map = document.querySelector('.map');
map.classList.remove('map--faded');
var similarMapPinElement = map.querySelector('.map__pins');
var similarMapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var similarArticleTemplate = document.querySelector('template').content.querySelector('.map__card');
var fragment = document.createDocumentFragment();
var ADS_COUNT = 8;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var PIN_HALF_WIDTH = 20;
var PIN_HEIGHT = 62;
var COORD_MIN_X = 300 + PIN_HALF_WIDTH;
var COORD_MAX_X = 900 - PIN_HALF_WIDTH;
var COORD_MIN_Y = 100 + PIN_HEIGHT;
var COORD_MAX_Y = 500 - PIN_HEIGHT;
var COUNT_ROOMS = 5;
var COUNT_GUESTS = 10;

var HOUSE_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var HOUSE_TYPES = [
  'flat',
  'house',
  'bungalo'
];

var HOUSE_DICT = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var CHECK_IN_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

var CHECK_OUT_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES_LIST = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

// получение пути к файлу с аватаркой
var getAvatarPath = function (userNumber) {
  var avatarPath = 'img/avatars/user';
  avatarPath += (userNumber < 10 ? '0' : '') + userNumber + '.png';
  return avatarPath;
};

// получение author.avatar
var getAvatar = function (number) {
  var avatars = [];
  avatars[number] = getAvatarPath(number + 1);
  return avatars[number];
};

// получение ad.author
var getAuthor = function (number) {
  return {
    avatar: getAvatar(number)
  };
};

// получение случайного элемента массива
var getRandomArrayElement = function (collection) {
  var randomElement = collection[Math.floor(Math.random() * collection.length)];
  return randomElement;
};

// получение случайной длины массива
var getRandomArrayLength = function (collection) {
  var randomLength = Math.ceil(Math.random() * collection.length);
  return randomLength;
};

// получение случайного числа
var getRandomNumber = function (count) {
  var number = Math.ceil(Math.random() * count);
  return number;
};

// получение случайного числа из диапазона
var getRandomNumberFromRange = function (min, max) {
  var number = Math.floor(Math.random() * (max - min) + min);
  return number;
};

// получение случайного местонахождения
var getRandomLocation = function (minX, maxX, minY, maxY) {
  var randomLocation = {};
  randomLocation.x = getRandomNumberFromRange(minX, maxX);
  randomLocation.y = getRandomNumberFromRange(minY, maxY);
  return randomLocation;
};

// получение случайного массива из существующего
var getRandomArrayFromExists = function (array) {
  var newArray = array.slice();

  function compareRandom() {
    return Math.random() - 0.5;
  }
  newArray.sort(compareRandom);
  newArray.length = getRandomArrayLength(array);
  return newArray;
};

// получение информации об объявлении
var GetOffer = function (location) {
  this.title = getRandomArrayElement(HOUSE_TITLES);
  this.address = location.x + ', ' + location.y;
  this.price = getRandomNumberFromRange(MIN_PRICE, MAX_PRICE);
  this.type = getRandomArrayElement(HOUSE_TYPES);
  this.rooms = getRandomNumber(COUNT_ROOMS);
  this.guests = getRandomNumber(COUNT_GUESTS);
  this.checkin = getRandomArrayElement(CHECK_IN_TIMES);
  this.checkout = getRandomArrayElement(CHECK_OUT_TIMES);
  this.features = getRandomArrayFromExists(FEATURES_LIST);
  this.description = '';
  this.photos = [];
};

// получение объявления
var getAd = function (number) {
  var ad = {};
  var tempLocation = getRandomLocation(COORD_MIN_X, COORD_MAX_X, COORD_MIN_Y, COORD_MAX_Y);
  ad.author = getAuthor(number);
  ad.offer = new GetOffer(tempLocation);
  ad.location = tempLocation;
  return ad;
};

// генерация метки на карте для объявления
var renderMapPin = function (ad) {
  var mapPinElement = similarMapPinTemplate.cloneNode(true);
  mapPinElement.style.top = ad.location.y + 'px';
  mapPinElement.style.left = ad.location.x + 'px';
  mapPinElement.querySelector('img').src = ad.author.avatar;
  fragment.appendChild(mapPinElement);
  similarMapPinElement.appendChild(fragment);
};

// удаление списка характеристик жилища из шаблона
(function () {
  var popup = similarArticleTemplate.querySelector('.popup__features');
  while (popup.firstChild) {
    popup.removeChild(popup.firstChild);
  }
})();

// получение характеристик жилища
var getFeatures = function (adNumber, element) {
  for (var j = 0; j < adNumber.offer.features.length; j++) {
    var item = document.createElement('li');
    item.className = 'feature';
    item.classList.add('feature--' + adNumber.offer.features[j]);
    fragment.appendChild(item);
    element.querySelector('.popup__features').appendChild(fragment);
  }
};

// получение карточки объявления
var renderArticle = function (adNumber) {
  var article = similarArticleTemplate.cloneNode(true);
  article.querySelector('h3').textContent = adNumber.offer.title;
  article.querySelector('small').textContent = adNumber.offer.address;
  article.querySelector('.popup__price').textContent = adNumber.offer.price + String.fromCharCode(8381) + '/ночь';
  article.querySelector('.popup__type').textContent = HOUSE_DICT[adNumber.offer.type];
  var typeInfo = adNumber.offer.rooms + ' для ' + adNumber.offer.guests;
  article.querySelector('.popup__type-info').textContent = (adNumber.offer.guests === 1) ? typeInfo + ' гостя' : typeInfo + ' гостей';
  article.querySelector('.popup__check').textContent = 'Заезд после ' + adNumber.offer.checkin + ', выезд до ' + adNumber.offer.checkout;
  getFeatures(adNumber, article);
  article.querySelector('.popup__description').textContent = adNumber.offer.description;
  article.querySelector('.popup__avatar').src = adNumber.author.avatar;
  return article;
};

// получение массива объявлений
var getAds = function (count) {
  var ads = [];
  for (var i = 0; i < count; i++) {
    ads[i] = getAd(i);
    renderMapPin(ads[i]);
  }
  fragment.appendChild(renderArticle(ads[0]));
  map.appendChild(fragment);
};

getAds(ADS_COUNT);
