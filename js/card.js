'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var templateCard = document.querySelector('#card').content.querySelector('.map__card');
  var card = {
    closeButton: null,

    onClick: function () {
      card.closeButton.removeEventListener('click', card.onClick);
      document.removeEventListener('keydown', card.onEscape);
      window.card.closeCard();
    },

    onEscape: function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        card.onClick();
      }
    },

    renderCard: function (ad) {
      var element = templateCard.cloneNode(true);
      element.children[0].src = ad.author.avatar;
      element.querySelector('.popup__title').textContent = ad.offer.title;
      element.querySelector('.popup__text--address').textContent = ad.offer.address;
      element.querySelector('.popup__text--price').textContent = ad.offer.price + ' ₽/ночь';
      element.querySelector('.popup__type').textContent = ad.offer.type;
      element.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
      element.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

      var features = element.querySelector('.popup__features');
      if (!window.utils.include('wifi', ad.offer.features)) {
        features.removeChild(features.querySelector('.popup__feature--wifi'));
      }
      if (!window.utils.include('dishwasher', ad.offer.features)) {
        features.removeChild(features.querySelector('.popup__feature--dishwasher'));
      }
      if (!window.utils.include('parking', ad.offer.features)) {
        features.removeChild(features.querySelector('.popup__feature--parking'));
      }
      if (!window.utils.include('washer', ad.offer.features)) {
        features.removeChild(features.querySelector('.popup__feature--washer'));
      }
      if (!window.utils.include('elevator', ad.offer.features)) {
        features.removeChild(features.querySelector('.popup__feature--elevator'));
      }
      if (!window.utils.include('conditioner', ad.offer.features)) {
        features.removeChild(features.querySelector('.popup__feature--conditioner'));
      }

      element.querySelector('.popup__description').textContent = ad.offer.description;

      var photos = element.querySelector('.popup__photos');

      if (ad.offer.photos[0]) {
        photos.children[0].src = ad.offer.photos[0];
      } else {
        photos.children[0].alt = '';
      }

      if (ad.offer.photos[1]) {
        var newphotos = photos.children[0].cloneNode(true);
        newphotos.src = ad.offer.photos[1];
        photos.appendChild(newphotos);
      }

      if (ad.offer.photos[2]) {
        var newphotosLast = photos.children[0].cloneNode(true);
        newphotosLast.src = ad.offer.photos[2];
        photos.appendChild(newphotosLast);
      }

      card.closeButton = element.querySelector('.popup__close');
      card.closeButton.addEventListener('click', card.onClick);
      document.addEventListener('keydown', card.onEscape);

      return element;
    }
  };

  window.card = {
    card: card,
    closeCard: function () {
      var popup = document.querySelector('.popup');
      if (popup) {
        popup.remove();
        window.pinUnactive();
      }
    }
  };

})();
