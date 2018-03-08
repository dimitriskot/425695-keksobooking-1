'use strict';

(function () {
  window.constants = {
    ADS_COUNT: 5,
    PIN_HALF_WIDTH: 20,
    PIN_HEIGHT: 62,
    MAIN_PIN: {
      COORDS_START: {
        X: window.variables.mainPin.offsetLeft,
        Y: window.variables.mainPin.offsetTop
      },
      COORDS_LIMIT: {
        MIN_X: 0,
        MAX_X: window.variables.map.offsetWidth,
        MIN_Y: 150, // координаты оставлены по договорённости с куратором
        MAX_Y: 720 // координаты оставлены по договорённости с куратором
      },
      WIDTH: 62,
      HALF_WIDTH: 31,
      HEIGHT: 82
    },
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
    DEFAULT_AVATAR: 'img/muffin.png'
  };
})();
