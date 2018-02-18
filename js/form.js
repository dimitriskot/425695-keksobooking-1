'use strict';

(function () {
  var type = window.variables.noticeForm.querySelector('#type');
  var formTypes = type.children;
  var price = window.variables.noticeForm.querySelector('#price');
  var timeIn = window.variables.noticeForm.querySelector('#timein');
  var timeInOptions = timeIn.children;
  var timeOut = window.variables.noticeForm.querySelector('#timeout');
  var timeOutOptions = timeOut.children;
  var roomNumber = window.variables.noticeForm.querySelector('#room_number');
  var capacity = window.variables.noticeForm.querySelector('#capacity');
  var MIN_PRICES_OF_TYPE = [
    '1000',
    '0',
    '5000',
    '10000'
  ];

  var ONE_GUEST = {
    value: 1,
    text: 'для 1 гостя'
  };

  var TWO_GUESTS = {
    value: 2,
    text: 'для 2 гостей'
  };

  var THREE_GUESTS = {
    value: 3,
    text: 'для 3 гостей'
  };

  var NO_GUESTS = {
    value: 0,
    text: 'не для гостей'
  };

  var ROOM_CAPACITY = {
    '1': [ONE_GUEST],
    '2': [ONE_GUEST, TWO_GUESTS],
    '3': [ONE_GUEST, TWO_GUESTS, THREE_GUESTS],
    '100': [NO_GUESTS]
  };
  // добавление атрибута disabled полям формы
  window.util.toggleDisabled(window.variables.fieldsets);

  // получение массива значений пунктов списка формы
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

  // событие смены значения поля Тип жилья
  type.addEventListener('change', onTypeChange);

  // событие смены значения поля Время заезда
  timeIn.addEventListener('change', onTimeInChange);

  // событие смены значения поля Время выезда
  timeOut.addEventListener('change', onTimeOutChange);

  // событие смены значения поля Кол-во комнат
  roomNumber.addEventListener('change', onRoomNumberChange);
})();
