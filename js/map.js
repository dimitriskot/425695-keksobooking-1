'use strict';

var map = document.querySelector('.map');
var mainPin = map.querySelector('.map__pin--main');
var noticeForm = document.querySelector('.notice__form');
var type = noticeForm.querySelector('#type');
var price = noticeForm.querySelector('#price');
var formTypes = type.children;
var timeIn = noticeForm.querySelector('#timein');
var timeOut = noticeForm.querySelector('#timeout');
var timeInOptions = timeIn.children;
var timeOutOptions = timeOut.children;
var roomNumber = noticeForm.querySelector('#room_number');
var capacity = noticeForm.querySelector('#capacity');
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
var MAIN_PIN_START_COORDS = {
  x: mainPin.offsetLeft,
  y: mainPin.offsetTop
};
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
var MIN_PIN_COORD = 125;
var MAX_PIN_COORD = 650;

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

var MIN_PRICES_OF_TYPE = [
  '1000',
  '0',
  '5000',
  '10000'
];

var ONE_ROOM = {
  value: 1,
  text: 'для 1 гостя'
};

var TWO_ROOM = {
  value: 2,
  text: 'для 2 гостей'
};

var THREE_ROOM = {
  value: 2,
  text: 'для 2 гостей'
};

var ONE_HUNDRED_ROOM = {
  value: 0,
  text: 'не для гостей'
};

var ROOM_CAPACITY = {
  '1': [ONE_ROOM],
  '2': [ONE_ROOM, TWO_ROOM],
  '3': [ONE_ROOM, TWO_ROOM, THREE_ROOM],
  '100': [ONE_HUNDRED_ROOM]
};

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
var renderPins = function (collection) {
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
    renderPins(tempAds[i]);
  }
  return tempAds;
};

// создание массива объявлений
var ads = getAds(ADS_COUNT);

// получение координат главной метки
var getMainPinCoords = function (coords) {
  var formAddress = noticeForm.querySelector('#address');
  var mainPinCoords = {
    x: coords.x + MAIN_PIN_HALF_WIDTH,
    y: coords.y + MAIN_PIN_HEIGHT
  };
  formAddress.value = mainPinCoords.x + ', ' + mainPinCoords.y;
};

// событие активации страницы при отпускании главной метки
var onMainPinMouseUp = function () {
  map.classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');
  toggleDisabled(fieldsets);
  getMainPinCoords(MAIN_PIN_START_COORDS);
  renderPins(ads);
  syncFormInputs();
  mainPin.addEventListener('mousedown', dragMainPin);
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

// функция перетаскивания главной метки
var dragMainPin = function (event) {
  event.preventDefault();
  var pinCoords;
  var startCoords = {
    x: event.clientX,
    y: event.clientY
  };
  var onMouseMove = function (moveEvent) {
    moveEvent.preventDefault();
    var shift = {
      x: startCoords.x - moveEvent.clientX,
      y: startCoords.y - moveEvent.clientY
    };
    startCoords = {
      x: moveEvent.clientX,
      y: moveEvent.clientY
    };
    if (mainPin.offsetTop - shift.y < MIN_PIN_COORD) {
      mainPin.style.top = MIN_PIN_COORD + 'px';
    } else if (mainPin.offsetTop - shift.y > MAX_PIN_COORD) {
      mainPin.style.top = MAX_PIN_COORD + 'px';
    }
    mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
    mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
    pinCoords = {
      x: mainPin.offsetLeft - shift.x,
      y: mainPin.offsetTop - shift.y
    };
    getMainPinCoords(pinCoords);
  };
  var onMouseUp = function (upEvent) {
    upEvent.preventDefault();
    map.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    getMainPinCoords(pinCoords);
  };
  map.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

// функция получения массива значений пунктов списка формы
var getValues = function (formOptions) {
  var values = [];
  for (var i = 0; i < formOptions.length; i++) {
    values[i] = formOptions[i].value;
  }
  return values;
};

// получение массива значений времён заезда
var timesIn = getValues(timeInOptions);

// получение массива значений времён выезда
var timesOut = getValues(timeOutOptions);

// функция синхронизации полей формы
var synchronizeFields = function (targetElement, sourceValues, targetValues, callback) {
  for (var i = 0; i < sourceValues.length; i++) {
    if (sourceValues[i].selected) {
      var targetValue = targetValues[i];
      if (typeof callback === 'function') {
        callback(targetElement, targetValue);
      }
    }
  }
};

// функция синхронизации минимального значения поля формы
var syncInputMinValue = function (element, value) {
  element.min = value;
};

// функция синхронизации значения поля формы
var syncInputValue = function (element, value) {
  element.value = value;
};

// событие синхронизации типа жилья и минимальной цены
var onTypeChange = function () {
  synchronizeFields(price, formTypes, MIN_PRICES_OF_TYPE, syncInputMinValue);
};

// событие синхронизации времени выезда со временем заезда
var onTimeInChange = function () {
  synchronizeFields(timeOut, timeInOptions, timesOut, syncInputValue);
};

// событие синхронизации времени заезда со временем выезда
var onTimeOutChange = function () {
  synchronizeFields(timeIn, timeOutOptions, timesIn, syncInputValue);
};

// удаление значений вместимости комнат
var clearRoomCapacities = function () {
  while (capacity.firstChild) {
    capacity.removeChild(capacity.firstChild);
  }
};

// генерация значений вместимости комнат
var getRoomCapacities = function (value) {
  for (var i = 0; i < ROOM_CAPACITY[value].length; i++) {
    var capacityItem = document.createElement('option');
    capacityItem.textContent = ROOM_CAPACITY[value][i].text;
    capacityItem.value = ROOM_CAPACITY[value][i].value;
    capacity.appendChild(capacityItem);
  }
};

// событие синхронизации количества комнат с количеством гостей
var onRoomNumberChange = function () {
  var roomNumbers = roomNumber.children;
  clearRoomCapacities();
  for (var i = 0; i < roomNumbers.length; i++) {
    if (roomNumbers[i].selected) {
      getRoomCapacities(roomNumber.value);
    }
  }
};

// функция синхронизации полей формы
var syncFormInputs = function () {
  onTypeChange();
  onTimeInChange();
  onRoomNumberChange();
};

// событие смены значения поля Тип жилья
type.addEventListener('change', onTypeChange);

// событие смены значения поля Время заезда
timeIn.addEventListener('change', onTimeInChange);

// событие смены значения поля Время выезда
timeOut.addEventListener('change', onTimeOutChange);

// событие смены значения поля Кол-во комнат
roomNumber.addEventListener('change', onRoomNumberChange);
