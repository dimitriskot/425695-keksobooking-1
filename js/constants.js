'use strict';

(function () {
  window.constants = {
    ADS_COUNT: 5,
    PIN_HALF_WIDTH: 20,
    PIN_HEIGHT: 62,
    MAIN_PIN: {
      COORDS_START: {
        x: window.variables.mainPin.offsetLeft,
        y: window.variables.mainPin.offsetTop
      },
      COORDS_LIMIT: {
        MIN_X: 0,
        MAX_X: 1200,
        MIN_Y: 150,
        MAX_Y: 500
      },
      WIDTH: 62,
      HALF_WIDTH: 31,
      HEIGHT: 82
    },
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
    OK_STATUS: 200
  };
})();
