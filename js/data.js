'use strict';

(function () {
  var ADS_NUM = 8;
  var TITLES = [
    'Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
    'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'
  ];
  var mapElement = document.querySelector('.map');

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  }

  function formatNumber(num, length) {
    var s = num.toString();
    while (s.length < length) {
      s = '0' + s;
    }
    return s;
  }

  function createAuthor(number) {
    number = Math.floor(number);
    return {
      avatar: 'img/avatars/user' + formatNumber(number + 1, 2) + '.png'
    };
  }

  function genUnique(array, length) {
    var result = [];
    var copy = array.slice();

    for (var i = 0; i < length; i++) {
      var n = copy.length;
      var j = Math.floor(randomInt(0, n - 1));
      result.push(copy[j]);

      if (n < 1.5) {
        break;
      } else {
        copy.splice(j, 1);
      }
    }

    return result;
  }

  function genFeatures() {
    var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

    return genUnique(FEATURES, randomInt(0, FEATURES.length));
  }

  function genPhotos() {
    var PHOTOS = [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ];
    var result = genUnique(PHOTOS, PHOTOS.length);
    return result;
  }

  function createOffer() {
    var PRICE_MIN = 1000;
    var PRICE_MAX = 1000000;
    var CHECKIN = ['12:00', '13:00', '14:00'];
    var TYPES = ['palace', 'flat', 'house', 'bungalo'];

    return {
      title: '',
      address: '',
      price: randomInt(PRICE_MIN, PRICE_MAX),
      type: TYPES[randomInt(0, TYPES.length - 1)],
      rooms: randomInt(1, 5),
      guests: randomInt(1, 100),
      checkin: CHECKIN[randomInt(0, CHECKIN.length - 1)],
      checkout: CHECKIN[randomInt(0, CHECKIN.length - 1)],
      features: genFeatures(),
      description: '',
      photos: genPhotos()
    };
  }

  function createLocation(x) {
    var Y_MIN = 130;
    var Y_MAX = 630;
    return {
      x: Math.floor(x),
      y: randomInt(Y_MIN, Y_MAX)
    };
  }

  // функция создания одного объявления
  function createAd(number, title, x) {
    var ad = {
      author: createAuthor(number),
      location: createLocation(x),
      offer: createOffer(),
      onClick: function () {
        var input = document.getElementById('address');
        input.setAttribute('value', ad.offer.address);

        var cardFragment = document.createDocumentFragment();
        cardFragment.appendChild(window.renderCard(ad));
        mapElement.insertBefore(cardFragment, mapElement.querySelector('.map__filters-container'));
      }
    };
    ad.offer.address = ad.location.x.toString() + ', ' + ad.location.y;
    ad.offer.title = title;
    return ad;
  }

  window.genAds = function () {
    var ads = [];
    var titles = TITLES.slice();

    for (var i = 0; i < ADS_NUM; i++) {
      var j = randomInt(0, titles.length - 1);
      var title = titles[j];
      titles.splice(j, 1);
      var mapWidth = document.querySelector('.map__pins').clientWidth;
      var ad = createAd(i, title, randomInt(0, mapWidth));
      ads.push(ad);
    }
    return ads;
  };
})();
