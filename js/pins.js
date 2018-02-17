'use strict';

(function () {
  var pinSet = window.variables.map.querySelector('.map__pins');

  // генерация метки на карте для объявления
  var renderPins = function (collection) {
    for (var i = 0; i < collection.length; i++) {
      var mapPinElement = window.variables.pinTemplate.cloneNode(true);
      mapPinElement.style.top = collection[i].location.y + 'px';
      mapPinElement.style.left = collection[i].location.x + 'px';
      mapPinElement.querySelector('img').src = collection[i].author.avatar;
      mapPinElement.id = 'pin-' + i;
      window.variables.fragment.appendChild(mapPinElement);
      pinSet.appendChild(window.variables.fragment);
    }
    window.variables.mainPin.removeEventListener('mouseup', window.userPin.onMainPinMouseUp);
    window.variables.mainPin.removeEventListener('keydown', window.userPin.onMainPinEnterPress);
  };

  // событие нажатия Esc при открытой информации об объявлении
  var onPinEscPress = function (event) {
    if (event.keyCode === window.constants.ESC_KEYCODE) {
      window.adCard.closeCurrentAdCard(event);
    }
  };

  // удаление класса ..--active у метки
  var deactivatePin = function () {
    if (document.querySelector('.map__pin--active')) {
      var pinActive = document.querySelector('.map__pin--active');
      pinActive.classList.remove('map__pin--active');
    }
  };

  // открытие информации об объявлении
  var onPinClick = function (event) {
    var target = event.target;
    var pinId;
    document.addEventListener('keydown', onPinEscPress);
    while (target !== window.variables.map) {
      if (target.className === 'map__pin') {
        window.adCard.closeAdCard();
        deactivatePin();
        target.classList.add('map__pin--active');
        pinId = target.id.replace('pin-', '');
        window.adCard.getAdCard(pinId, event);
        return;
      }
      target = target.parentNode;
    }
  };

  // функция проверки нажатия Enter на метке
  var onPinEnterPress = function (evt) {
    if (evt.keyCode === window.constants.ENTER_KEYCODE) {
      onPinClick(event);
    }
  };

  window.pins = {
    renderPins: renderPins,
    onPinClick: onPinClick,
    deactivatePin: deactivatePin,
    onPinEnterPress: onPinEnterPress,
    onPinEscPress: onPinEscPress
  };
})();
