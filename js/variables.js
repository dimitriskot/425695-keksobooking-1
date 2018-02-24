'use strict';

(function () {
  window.variables = {
    map: document.querySelector('.map'),
    mainPin: document.querySelector('.map__pin--main'),
    fieldsets: document.querySelectorAll('fieldset'),
    adCardTemplate: document.querySelector('template').content.querySelector('.map__card'),
    fragment: document.createDocumentFragment(),
    pinTemplate: document.querySelector('template').content.querySelector('.map__pin'),
    noticeForm: document.querySelector('.notice__form'),
    ads: [],
    adsOnMap: []
  };
})();
