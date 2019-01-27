'use strict';

(function () {
  var card = {
    closeButton: null,

    onClick: function () {
      card.closeButton.removeEventListener('click', card.onClick);
      document.removeEventListener('keydown', card.onEscape);
      window.closeCard();
    },

    onEscape: function (evt) {
      if (evt.keyCode === 27) {
        card.onClick();
      }
    },

    renderCard: function (ad) {
      var template = document.querySelector('#card').content.querySelector('.map__card');
      var element = template.cloneNode(true);
      element.children[0].src = ad.author.avatar;
      element.querySelector('.popup__title').textContent = ad.offer.title;
      element.querySelector('.popup__text--address').textContent = ad.offer.address;
      element.querySelector('.popup__text--price').textContent = ad.offer.price + ' ₽/ночь';
      element.querySelector('.popup__type').textContent = ad.offer.type;
      element.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
      element.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

      var featuresElement = element.querySelector('.popup__features');
      if (!window.Utils.include('wifi', ad.offer.features)) {
        featuresElement.removeChild(featuresElement.querySelector('.popup__feature--wifi'));
      }
      if (!window.Utils.include('dishwasher', ad.offer.features)) {
        featuresElement.removeChild(featuresElement.querySelector('.popup__feature--dishwasher'));
      }
      if (!window.Utils.include('parking', ad.offer.features)) {
        featuresElement.removeChild(featuresElement.querySelector('.popup__feature--parking'));
      }
      if (!window.Utils.include('washer', ad.offer.features)) {
        featuresElement.removeChild(featuresElement.querySelector('.popup__feature--washer'));
      }
      if (!window.Utils.include('elevator', ad.offer.features)) {
        featuresElement.removeChild(featuresElement.querySelector('.popup__feature--elevator'));
      }
      if (!window.Utils.include('conditioner', ad.offer.features)) {
        featuresElement.removeChild(featuresElement.querySelector('.popup__feature--conditioner'));
      }

      element.querySelector('.popup__description').textContent = ad.offer.description;

      var photosElement = element.querySelector('.popup__photos');
      var photoElements = [
        photosElement.children[0],
        photosElement.children[0].cloneNode(true),
        photosElement.children[0].cloneNode(true)
      ];

      photoElements[0].src = ad.offer.photos[0];
      photoElements[1].src = ad.offer.photos[1];
      photoElements[2].src = ad.offer.photos[2];

      photosElement.appendChild(photoElements[1]);
      photosElement.appendChild(photoElements[2]);

      card.closeButton = element.querySelector('.popup__close');
      card.closeButton.addEventListener('click', card.onClick);
      document.addEventListener('keydown', card.onEscape);

      return element;
    }
  };

  window.card = card;

  window.closeCard = function () {
    var popup = document.querySelector('.popup');
    if (popup) {
      popup.remove();
      window.pinUnactive();
    }
  };
})();
