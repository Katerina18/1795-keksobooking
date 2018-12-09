'use strict';

var ADS_NUM = 8;

function randomInt(min, max) {
  return Math.floor( Math.random() * (max + 1 - min) + min );
}

function formatNumber(num, length) {
    var s = num.toString();
    while (s.length < length) {
        s = "0" + s;
    }
    return s;
}

function createAuthor(number) {
  number = parseInt(number);
  return {
    avatar: 'img/avatars/user' + formatNumber(number + 1, 2) + '.png'
  };
}

var TITLES = [
  "Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец",
  "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик",
  "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"
];

function genUnique(array, length) {
  var result = [];

  for (var i = 0; i < length; i++) {
    var j = randomInt(0, array.length - 1);

    for (var j = 0; j < length; j++) {
      if (result.includes(array[j]))
        continue;
      else {
        result.push(array[j]);
        break;
      }
    }
  }

  return result;
};

function genFeatures() {
  var FEATURES = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];

  return genUnique(FEATURES, randomInt(0, FEATURES.length));
};

function genPhotos() {
  var PHOTOS = [
    "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
  ];

  return genUnique(PHOTOS, PHOTOS.length);
};

function createOffer() {
  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;
  const CHECKIN = ['12:00', '13:00', '14:00'];
  const TYPES = ['palace', 'flat', 'house', 'bungalo'];

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
  const Y_MIN = 130;
  const Y_MAX = 630;
  return {
    x: parseInt(x),
    y: randomInt(Y_MIN, Y_MAX)
  };
}

// функция создания одного объявления
function createAd(number, title, x) {
  var ad = {
    author: createAuthor(number),
    location: createLocation(x),
    offer: createOffer()
  };

  ad.offer.address = ad.location.x.toString() + ", " + ad.location.y;
  ad.offer.title = title;
  return ad;
}

function genAds() {
  var ads = [];
  var titles = TITLES.slice();

  for (var i = 0; i < ADS_NUM; i++) {
    var j = randomInt(0, titles.length - 1);
    var title = titles[j];
    titles.splice(j, 1);
    var map_width = document.querySelector('.map__pins').clientWidth;
    var ad = createAd(i, title, randomInt(0, map_width));

    ads.push(ad);
  }

  return ads;
}

var ads = genAds();

//////////////////////////////////////////////////////////////
document.querySelector('.map').classList.remove('map--faded');

function renderPin(ad) {
  var template = document.querySelector('#pin').content.querySelector('.map__pin');
  var element = template.cloneNode(true);
  element.style.top = "" + ad.location.y + "px";
  element.style.left = "" + ad.location.x + "px";
  var img = element.children[0];
  img.src = ad.author.avatar;
  img.alt = ad.offer.title;

  return element;
}

var pinsFragment = document.createDocumentFragment();

for (var i = 0; i < ads.length; i++) {
  pinsFragment.appendChild(renderPin(ads[i]));
}

var mapElement = document.querySelector('.map');
var pinsElement = mapElement.querySelector('.map__pins');
pinsElement.appendChild(pinsFragment);

/////////////////////////////////////////

function renderCard(ad) {
  var template = document.querySelector('#card').content.querySelector('.map__card');
  var element = template.cloneNode(true);
  element.children[0].src = ad.author.avatar;
  element.querySelector('.popup__title').textContent = ad.offer.title;
  element.querySelector('.popup__text--address').textContent = ad.offer.address;
  element.querySelector('.popup__text--price').innerHTML = ad.offer.price + ' &#x20bd;<span>/ночь</span>';
  element.querySelector('.popup__type').textContent = ad.offer.type;
  element.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  element.querySelector('.popup__text--time').textContent = 'Заезд после '+ ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

  var featuresElement = element.querySelector('.popup__features');
  if (!ad.offer.features.includes('wifi'))
    featuresElement.removeChild(featuresElement.querySelector('.popup__feature--wifi'));
  if (!ad.offer.features.includes('dishwasher'))
    featuresElement.removeChild(featuresElement.querySelector('.popup__feature--dishwasher'));
  if (!ad.offer.features.includes('parking'))
    featuresElement.removeChild(featuresElement.querySelector('.popup__feature--parking'));
  if (!ad.offer.features.includes('washer'))
    featuresElement.removeChild(featuresElement.querySelector('.popup__feature--washer'));
  if (!ad.offer.features.includes('elevator'))
    featuresElement.removeChild(featuresElement.querySelector('.popup__feature--elevator'));
  if (!ad.offer.features.includes('conditioner'))
    featuresElement.removeChild(featuresElement.querySelector('.popup__feature--conditioner'));

  element.querySelector('.popup__description').textContent = ad.offer.description;

  // debugger;
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
}

var cardsFragment = document.createDocumentFragment();
for (var i = 0; i < ads.length; i++) {
  cardsFragment.appendChild(renderCard(ads[i]));
}

mapElement.insertBefore(cardsFragment, mapElement.querySelector('.map__filters-container'));
// console.log(mapElement.innerHTML);
// debugger;
