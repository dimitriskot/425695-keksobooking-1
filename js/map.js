'use strict';

var map = document.querySelector('.map');
var mainPin = map.querySelector('.map__pin--main');
var noticeForm = document.querySelector('.notice__form');
// map.classList.remove('map--faded');
var fieldsets = document.querySelectorAll('fieldset');
var pinSet = map.querySelector('.map__pins');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var adInfoTemplate = document.querySelector('template').content.querySelector('.map__card');
var fragment = document.createDocumentFragment();
var ADS_COUNT = 8;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MAIN_PIN_HALF_WIDTH = 31;
var MAIN_PIN_HEIGHT = 82;
var PIN_HALF_WIDTH = 20;
var PIN_HEIGHT = 62;
var COORD = {
  minX: 300 + PIN_HALF_WIDTH,
  maxX: 900 - PIN_HALF_WIDTH,
  minY: 100 + PIN_HEIGHT,
  maxY: 500 - PIN_HEIGHT
};
var COUNT_ROOMS = 5;
var COUNT_GUESTS = 10;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var AD_INFO_TITLES = [
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

// функция переключения активного состояния элементов массива
var toggleDisabled = function (collection) {
  collection.forEach(function (item) {
    item.disabled = !item.disabled;
  });
};

// добавление атрибута disabled полям формы
toggleDisabled(fieldsets);

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

// получение информации об объявлении
var GetOffer = function (location) {
  this.title = getRandomArrayElement(AD_INFO_TITLES);
  this.address = location.x + ', ' + location.y;
  this.price = getRandomNumberFromRange(MIN_PRICE, MAX_PRICE);
  this.type = getRandomArrayElement(HOUSE_TYPES);
  this.rooms = getRandomNumberFromRange(1, COUNT_ROOMS);
  this.guests = getRandomNumberFromRange(1, COUNT_GUESTS);
  this.checkin = getRandomArrayElement(CHECK_IN_TIMES);
  this.checkout = getRandomArrayElement(CHECK_OUT_TIMES);
  this.features = getRandomArrayFromExisting(FEATURES_LIST);
  this.description = '';
  this.photos = [];
};

// получение объявления
var getAd = function (number) {
  var ad = {};
  var tempLocation = getRandomLocation(COORD);
  ad.author = getAuthor(number);
  ad.offer = new GetOffer(tempLocation);
  ad.location = tempLocation;
  return ad;
};

// генерация метки на карте для объявления
var renderPin = function (collection) {
  for (var i = 0; i < collection.length; i++) {
    var mapPinElement = pinTemplate.cloneNode(true);
    mapPinElement.style.top = collection[i].location.y + 'px';
    mapPinElement.style.left = collection[i].location.x + 'px';
    mapPinElement.querySelector('img').src = collection[i].author.avatar;
    mapPinElement.id = 'pin-' + i;
    fragment.appendChild(mapPinElement);
    pinSet.appendChild(fragment);
  }
  mainPin.removeEventListener('mouseup', onMainPinMouseUp);
  mainPin.removeEventListener('keydown', onMainPinEnterPress);
};

// удаление списка характеристик жилища из шаблона
(function () {
  var popup = adInfoTemplate.querySelector('.popup__features');
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
var renderAdInfo = function (adNumber) {
  var adInfo = adInfoTemplate.cloneNode(true);
  adInfo.querySelector('h3').textContent = adNumber.offer.title;
  adInfo.querySelector('small').textContent = adNumber.offer.address;
  adInfo.querySelector('.popup__price').textContent = adNumber.offer.price + String.fromCharCode(8381) + '/ночь';
  adInfo.querySelector('.popup__type').textContent = HOUSE_DICT[adNumber.offer.type];
  var typeInfo = adNumber.offer.rooms + ' для ' + adNumber.offer.guests;
  adInfo.querySelector('.popup__type-info').textContent = (adNumber.offer.guests === 1) ? typeInfo + ' гостя' : typeInfo + ' гостей';
  adInfo.querySelector('.popup__check').textContent = 'Заезд после ' + adNumber.offer.checkin + ', выезд до ' + adNumber.offer.checkout;
  getFeatures(adNumber, adInfo);
  adInfo.querySelector('.popup__description').textContent = adNumber.offer.description;
  adInfo.querySelector('.popup__avatar').src = adNumber.author.avatar;
  return adInfo;
};

// получение массива объявлений
var getAds = function (count) {
  var tempAds = [];
  for (var i = 0; i < count; i++) {
    tempAds[i] = getAd(i);
    renderPin(tempAds[i]);
  }
  return tempAds;
};

// создание массива объявлений
var ads = getAds(ADS_COUNT);

// получение начальных координат главной метки
var getMainPinStartCoords = function () {
  var formAddress = noticeForm.querySelector('#address');
  var startCoords = {
    x: mainPin.offsetLeft + MAIN_PIN_HALF_WIDTH,
    y: mainPin.offsetTop + MAIN_PIN_HEIGHT
  };
  formAddress.value = startCoords.x + ', ' + startCoords.y;
};

// событие активации страницы при отпускании главной метки
var onMainPinMouseUp = function () {
  map.classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');
  toggleDisabled(fieldsets);
  getMainPinStartCoords();
  renderPin(ads);
};

// событие активации страницы при нажатии Enter
var onMainPinEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    onMainPinMouseUp();
  }
};

// обработчик события активации страницы при отпускании главной метки
mainPin.addEventListener('mouseup', onMainPinMouseUp);

// обработчик события активации страницы при нажатии Enter
mainPin.addEventListener('keydown', onMainPinEnterPress);

// создание информации об объявлении
var createAdInfo = function (number) {
  fragment.appendChild(renderAdInfo(ads[number]));
  map.appendChild(fragment);
  // создание события закрытия окна информации по клику и по нажатию на Enter
  var closeAdInfoButton = map.querySelector('.popup__close');
  closeAdInfoButton.addEventListener('click', closeCurrentAd);
  closeAdInfoButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closeCurrentAd(event);
    }
  });
};

// событие нажатия Esc при открытой информации об объявлении
var onPinEscPress = function (event) {
  if (event.keyCode === ESC_KEYCODE) {
    closeCurrentAd(event);
  }
};

// удаление класса ..--active у метки
var deactivatePin = function () {
  if (document.querySelector('.map__pin--active')) {
    var pinActive = document.querySelector('.map__pin--active');
    pinActive.classList.remove('map__pin--active');
  }
};

// удаление информации об объявлении
var closeAdInfo = function () {
  if (document.querySelector('.map__card')) {
    var mapCard = document.querySelector('.map__card');
    map.removeChild(mapCard);
  }
};

// закрытие текущей информации об объявлении
var closeCurrentAd = function (event) {
  closeAdInfo();
  deactivatePin();
  document.removeEventListener('keydown', onPinEscPress);
  event.stopPropagation();
};

// открытие информации об объявлении
var onPinClick = function (event) {
  var target = event.target;
  var pinId;
  document.addEventListener('keydown', onPinEscPress);
  while (target !== map) {
    if (target.className === 'map__pin') {
      closeAdInfo();
      deactivatePin();
      target.classList.add('map__pin--active');
      pinId = target.id.replace('pin-', '');
      createAdInfo(pinId, event);
      return;
    }
    target = target.parentNode;
  }
};

// функция проверки нажатия Enter на метке
var onPinEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    onPinClick(event);
  }
};

// событие открытия информации об объявлении по клику
map.addEventListener('click', onPinClick);

// событие открытия информации об объявлении по нажатию Enter
map.addEventListener('keydown', onPinEnterPress);
