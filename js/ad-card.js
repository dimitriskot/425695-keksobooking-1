'use strict';

(function () {
  var HOUSE_DICT = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  // получение характеристик жилища
  var getFeatures = function (adNumber, element) {
    for (var j = 0; j < adNumber.offer.features.length; j++) {
      var item = document.createElement('li');
      item.classList.add('feature');
      item.classList.add('feature--' + adNumber.offer.features[j]);
      window.variables.fragment.appendChild(item);
      element.querySelector('.popup__features').appendChild(window.variables.fragment);
    }
  };

  // генерация карточки объявления
  var renderAdCard = function (adNumber) {
    var adCard = window.variables.adCardTemplate.cloneNode(true);
    adCard.querySelector('h3').textContent = adNumber.offer.title;
    adCard.querySelector('small').textContent = adNumber.offer.address;
    adCard.querySelector('.popup__price').textContent = adNumber.offer.price + String.fromCharCode(8381) + '/ночь';
    adCard.querySelector('.popup__type').textContent = HOUSE_DICT[adNumber.offer.type];
    var typeInfo = adNumber.offer.rooms + ' для ' + adNumber.offer.guests;
    adCard.querySelector('.popup__type-info').textContent = (adNumber.offer.guests === 1) ? typeInfo + ' гостя' : typeInfo + ' гостей';
    adCard.querySelector('.popup__check').textContent = 'Заезд после ' + adNumber.offer.checkin + ', выезд до ' + adNumber.offer.checkout;
    getFeatures(adNumber, adCard);
    adCard.querySelector('.popup__description').textContent = adNumber.offer.description;
    adCard.querySelector('.popup__avatar').src = adNumber.author.avatar;
    return adCard;
  };

  // создание карточки объявления
  var getAdCard = function (number) {
    window.variables.fragment.appendChild(renderAdCard(window.variables.ads[number]));
    window.variables.map.appendChild(window.variables.fragment);
    // создание события закрытия окна информации по клику и по нажатию на Enter
    var closeAdCardButton = window.variables.map.querySelector('.popup__close');
    closeAdCardButton.addEventListener('click', closeCurrentAdCard);
    closeAdCardButton.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.constants.ENTER_KEYCODE) {
        closeCurrentAdCard(event);
      }
    });
  };

  // закрытие карточки объявления
  var closeAdCard = function () {
    if (document.querySelector('.map__card')) {
      var mapCard = document.querySelector('.map__card');
      window.variables.map.removeChild(mapCard);
    }
  };

  // закрытие текущей карточки объявления
  var closeCurrentAdCard = function (event) {
    closeAdCard();
    window.pins.deactivatePin();
    document.removeEventListener('keydown', window.pins.onPinEscPress);
    event.stopPropagation();
  };

  window.adCard = {
    render: renderAdCard,
    display: getAdCard,
    hide: closeAdCard,
    hideCurrent: closeCurrentAdCard
  };
})();
