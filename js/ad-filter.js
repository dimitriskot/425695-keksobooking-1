'use strict';

(function () {
  var filteredAds = [];
  var typeFilter = window.variables.map.querySelector('#housing-type');
  var priceFilter = window.variables.map.querySelector('#housing-price');
  var roomsFilter = window.variables.map.querySelector('#housing-rooms');
  var guestsFilter = window.variables.map.querySelector('#housing-guests');
  var featuresFilter = window.variables.map.querySelector('#housing-features').children;
  featuresFilter = Array.prototype.slice.call(featuresFilter);

  // функция проверки объявлений по фильтру типа жилья
  var checkTypeFilter = function () {
    if (typeFilter.value !== 'any') {
      filteredAds = filteredAds.filter(function (filteredAd) {
        return filteredAd.offer.type === typeFilter.value;
      });
    }
  };

  // функция проверки объявлений по фильтру цены
  var checkPriceFilter = function () {
    if (priceFilter.value !== 'any') {
      if (priceFilter.value === 'low') {
        filteredAds = filteredAds.filter(function (filteredAd) {
          return filteredAd.offer.price < '10000';
        });
      } else if (priceFilter.value === 'middle') {
        filteredAds = filteredAds.filter(function (filteredAd) {
          return filteredAd.offer.price >= 10000 && filteredAd.offer.price <= 50000;
        });
      } else if (priceFilter.value === 'high') {
        filteredAds = filteredAds.filter(function (filteredAd) {
          return filteredAd.offer.price >= 50000;
        });
      }
    }
  };

  // функция проверки объявлений по фильтру количества комнат
  var checkRoomsFilter = function () {
    if (roomsFilter.value !== 'any') {
      filteredAds = filteredAds.filter(function (filteredAd) {
        return filteredAd.offer.rooms === +roomsFilter.value;
      });
    }
  };

  // функция проверки объявлений по фильтру количества гостей
  var checkGuestsFilter = function () {
    if (guestsFilter.value !== 'any') {
      filteredAds = filteredAds.filter(function (filteredAd) {
        return filteredAd.offer.guests === +guestsFilter.value;
      });
    }
  };

  // функция проверки объявлений по фильтру удобств
  var checkFeaturesFilter = function () {
    featuresFilter.forEach(function (feature) {
      if (feature.type === 'checkbox' && feature.checked) {
        filteredAds = filteredAds.filter(function (filteredAd) {
          if (filteredAd.offer.features.includes(feature.value)) {
            var tempAd = filteredAd;
            return tempAd;
          }
          return filteredAd === tempAd;
        });
      }
    });
  };

  // событие фильтрации объявлений по выбранным параметрам
  var onFilterChange = function () {
    window.adCard.closeAdCard();
    filteredAds = window.variables.ads.slice();
    checkTypeFilter();
    checkPriceFilter();
    checkRoomsFilter();
    checkGuestsFilter();
    checkFeaturesFilter();
    window.pins.deletePins();
    window.pins.renderPins(filteredAds);
    filteredAds.forEach(function (filteredAd) {
      window.adCard.renderAdCard(filteredAd);
    });
  };

  typeFilter.addEventListener('change', onFilterChange);
  priceFilter.addEventListener('change', onFilterChange);
  roomsFilter.addEventListener('change', onFilterChange);
  guestsFilter.addEventListener('change', onFilterChange);
  featuresFilter.forEach(function (feature) {
    if (feature.type === 'checkbox') {
      feature.addEventListener('change', onFilterChange);
    }
  });
})();
