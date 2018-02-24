'use strict';

(function () {
  var filteredAds = [];
  var maxRank = 0;
  var typeFilter = window.variables.map.querySelector('#housing-type');
  var priceFilter = window.variables.map.querySelector('#housing-price');
  var roomsFilter = window.variables.map.querySelector('#housing-rooms');
  var guestsFilter = window.variables.map.querySelector('#housing-guests');
  var featuresFilter = window.variables.map.querySelector('#housing-features').children;
  featuresFilter = Array.prototype.slice.call(featuresFilter);

  var checkTypeFilter = function () {
    if (typeFilter.value !== 'any') {
      filteredAds.map(function (filteredAd) {
        if (filteredAd.offer.type === typeFilter.value) {
          filteredAd.rank += 1;
        }
        return filteredAd;
      });
      maxRank += 1;
    }
  };

  var checkPriceFilter = function () {
    if (priceFilter.value !== 'any') {
      if (priceFilter.value === 'low') {
        filteredAds.map(function (filteredAd) {
          if (filteredAd.offer.price < '10000') {
            filteredAd.rank += 1;
          }
          return filteredAd;
        });
      } else if (priceFilter.value === 'middle') {
        filteredAds.map(function (filteredAd) {
          if (filteredAd.offer.price >= 10000 && filteredAd.offer.price <= 50000) {
            filteredAd.rank += 1;
          }
          return filteredAd;
        });
      } else if (priceFilter.value === 'high') {
        filteredAds.map(function (filteredAd) {
          if (filteredAd.offer.price >= 50000) {
            filteredAd.rank += 1;
          }
          return filteredAd;
        });
      }
      maxRank += 1;
    }
  };

  var checkRoomsFilter = function () {
    if (roomsFilter.value !== 'any') {
      filteredAds.map(function (filteredAd) {
        if (filteredAd.offer.rooms === +roomsFilter.value) {
          filteredAd.rank += 1;
        }
        return filteredAd;
      });
      maxRank += 1;
    }
  };

  var checkGuestsFilter = function () {
    if (guestsFilter.value !== 'any') {
      filteredAds.map(function (filteredAd) {
        if (filteredAd.offer.guests === +guestsFilter.value) {
          filteredAd.rank += 1;
        }
        return filteredAd;
      });
      maxRank += 1;
    }
  };

  var checkFeaturesFilter = function () {
    featuresFilter.forEach(function (feature) {
      if (feature.type === 'checkbox' && feature.checked) {
        filteredAds.map(function (filteredAd) {
          for (var i = 0; i < filteredAd.offer.features.length; i++) {
            if (filteredAd.offer.features[i] === feature.value) {
              filteredAd.rank += 1;
            }
          }
          return filteredAd;
        });
        maxRank += 1;
      }
    });
  };

  var filterAds = function () {
    filteredAds = filteredAds.filter(function (filteredAd) {
      return filteredAd.rank === maxRank;
    });
  };

  var onFilterChange = function () {
    window.adCard.closeAdCard();
    filteredAds = window.variables.ads.slice();
    checkTypeFilter();
    checkPriceFilter();
    checkRoomsFilter();
    checkGuestsFilter();
    checkFeaturesFilter();
    filterAds();
    window.pins.deletePins();
    window.pins.renderPins(filteredAds);
    filteredAds.forEach(function (filteredAd) {
      window.adCard.renderAdCard(filteredAd);
    });
    window.variables.ads.map(function (ad) {
      ad.rank = 0;
      return ad;
    });
    maxRank = 0;
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
