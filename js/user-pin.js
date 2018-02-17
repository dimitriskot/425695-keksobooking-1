'use strict';

(function () {
  var MAIN_PIN_START_COORDS = {
    x: window.variables.mainPin.offsetLeft,
    y: window.variables.mainPin.offsetTop
  };

  // событие активации страницы при отпускании главной метки
  var onMainPinMouseUp = function () {
    window.variables.map.classList.remove('map--faded');
    window.variables.noticeForm.classList.remove('notice__form--disabled');
    window.util.toggleDisabled(window.variables.fieldsets);
    getMainPinCoords(MAIN_PIN_START_COORDS);
    window.pins.renderPins(window.variables.ads);
    window.variables.mainPin.addEventListener('mousedown', dragMainPin);
  };

  // получение координат главной метки
  var getMainPinCoords = function (coords) {
    var formAddress = window.variables.noticeForm.querySelector('#address');
    var mainPinCoords = {
      x: coords.x + window.constants.MAIN_PIN_HALF_WIDTH,
      y: coords.y + window.constants.MAIN_PIN_HEIGHT
    };
    formAddress.value = mainPinCoords.x + ', ' + mainPinCoords.y;
  };

  // событие активации страницы при нажатии Enter
  var onMainPinEnterPress = function (evt) {
    if (evt.keyCode === window.constants.ENTER_KEYCODE) {
      onMainPinMouseUp();
    }
  };

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
      if (window.variables.mainPin.offsetTop - shift.y < window.constants.MIN_PIN_COORD) {
        window.variables.mainPin.style.top = window.constants.MIN_PIN_COORD + 'px';
      } else if (window.variables.mainPin.offsetTop - shift.y > window.constants.MAX_PIN_COORD) {
        window.variables.mainPin.style.top = window.constants.MAX_PIN_COORD + 'px';
      }
      window.variables.mainPin.style.top = (window.variables.mainPin.offsetTop - shift.y) + 'px';
      window.variables.mainPin.style.left = (window.variables.mainPin.offsetLeft - shift.x) + 'px';
      pinCoords = {
        x: window.variables.mainPin.offsetLeft - shift.x,
        y: window.variables.mainPin.offsetTop - shift.y
      };
      getMainPinCoords(pinCoords);
    };
    var onMouseUp = function (upEvent) {
      upEvent.preventDefault();
      window.variables.map.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      getMainPinCoords(pinCoords);
    };
    window.variables.map.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // обработчик события активации страницы при отпускании главной метки
  window.variables.mainPin.addEventListener('mouseup', onMainPinMouseUp);

  // обработчик события активации страницы при нажатии Enter
  window.variables.mainPin.addEventListener('keydown', onMainPinEnterPress);

  window.userPin = {
    onMainPinMouseUp: onMainPinMouseUp,
    onMainPinEnterPress: onMainPinEnterPress
  };
})();
