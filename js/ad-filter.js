'use strict';

(function () {
  var filteredAds = [];
  var typeFilter = window.variables.map.querySelector('#housing-type');
  var priceFilter = window.variables.map.querySelector('#housing-price');
  var roomsFilter = window.variables.map.querySelector('#housing-rooms');
  var guestsFilter = window.variables.map.querySelector('#housing-guests');
  var featuresFilter = window.variables.map.querySelector('#housing-features').children;
  featuresFilter = Array.prototype.slice.call(featuresFilter);
  var FILTER_ANY = 'any';
  var PRICE_LEVELS = {
    low: 'low',
    middle: 'middle',
    high: 'high'
  };

  // функция проверки объявлений по фильтру типа жилья
  var checkTypeFilter = function (adCollection) {
    if (typeFilter.value === FILTER_ANY) {
      return adCollection;
    }
    return adCollection.filter(function (ad) {
      return ad.offer.type === typeFilter.value;
    });
  };

  // функция проверки объявлений по фильтру цены
  var checkPriceFilter = function (adCollection) {
    switch (priceFilter.value) {
      case PRICE_LEVELS.low:
        return adCollection.filter(function (ad) {
          return ad.offer.price < 10000;
        });
      case PRICE_LEVELS.middle:
        return adCollection.filter(function (ad) {
          return ad.offer.price >= 10000 && ad.offer.price <= 50000;
        });

      case PRICE_LEVELS.high:
        return adCollection.filter(function (ad) {
          return ad.offer.price >= 50000;
        });
      default:
        return adCollection;
    }
  };

  // функция проверки объявлений по фильтру количества комнат
  var checkRoomsFilter = function (adCollection) {
    if (roomsFilter.value === FILTER_ANY) {
      return adCollection;
    }
    return adCollection.filter(function (ad) {
      return ad.offer.rooms === +roomsFilter.value;
    });
  };

  // функция проверки объявлений по фильтру количества гостей
  var checkGuestsFilter = function (adCollection) {
    if (guestsFilter.value === FILTER_ANY) {
      return adCollection;
    }
    return adCollection.filter(function (ad) {
      return ad.offer.guests === +guestsFilter.value;
    });
  };

  // функция сравнения массивов удобств
  var compareFeatures = function (ad) {
    var tempFilterFeatures;
    tempFilterFeatures = featuresFilter.filter(function (feature) {
      return feature.type === 'checkbox' && feature.checked;
    });
    var count = 0;
    for (var i = 0; i < ad.offer.features.length; i++) {
      for (var j = 0; j < tempFilterFeatures.length; j++) {
        if (ad.offer.features[i] === tempFilterFeatures[j].value) {
          count++;
        }
      }
    }
    if (count === tempFilterFeatures.length) {
      return ad;
    }
    return false;
  };

  // функция проверки объявлений по фильтру удобств
  var checkFeaturesFilter = function (adCollection) {
    return adCollection.filter(function (ad) {
      return ad === compareFeatures(ad);
    });
  };

  // событие фильтрации объявлений по выбранным параметрам
  var onFilterChange = function () {
    window.adCard.closeAdCard();
    filteredAds = window.variables.ads.slice();
    filteredAds = checkTypeFilter(filteredAds);
    filteredAds = checkPriceFilter(filteredAds);
    filteredAds = checkRoomsFilter(filteredAds);
    filteredAds = checkGuestsFilter(filteredAds);
    filteredAds = checkFeaturesFilter(filteredAds);
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
