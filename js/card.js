'use strict';

(function () {
  window.renderCard = function (ad) {
    var template = document.querySelector('#card').content.querySelector('.map__card');
    var element = template.cloneNode(true);
    element.children[0].src = ad.author.avatar;
    element.querySelector('.popup__title').textContent = ad.offer.title;
    element.querySelector('.popup__text--address').textContent = ad.offer.address;
    element.querySelector('.popup__text--price').innerHTML = ad.offer.price + ' &#x20bd;<span>/ночь</span>';
    element.querySelector('.popup__type').textContent = ad.offer.type;
    element.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    element.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    var featuresElement = element.querySelector('.popup__features');
    if (!ad.offer.features.includes('wifi')) {
      featuresElement.removeChild(featuresElement.querySelector('.popup__feature--wifi'));
    }
    if (!ad.offer.features.includes('dishwasher')) {
      featuresElement.removeChild(featuresElement.querySelector('.popup__feature--dishwasher'));
    }
    if (!ad.offer.features.includes('parking')) {
      featuresElement.removeChild(featuresElement.querySelector('.popup__feature--parking'));
    }
    if (!ad.offer.features.includes('washer')) {
      featuresElement.removeChild(featuresElement.querySelector('.popup__feature--washer'));
    }
    if (!ad.offer.features.includes('elevator')) {
      featuresElement.removeChild(featuresElement.querySelector('.popup__feature--elevator'));
    }
    if (!ad.offer.features.includes('conditioner')) {
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

    return element;
  };
})();
