'use strict';

var ADS_NUM = 8;

var mapElement = document.querySelector('.map');
var pinsElement = mapElement.querySelector('.map__pins');
var form = document.querySelector('.ad-form');

var TITLES = [
  'Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'
];

// форма объявления
var formFields = document.querySelectorAll('.ad-form__element');

// блокируем форму с фильтрами
var formFilter = document.querySelector('.map__filters');
formFilter.setAttribute('disabled', 'disabled');

// активное состояние страницы
var pinMain = document.querySelector('.map__pin--main');
var adressPinMain = parseInt(pinMain.style.left, 10) + ', ' + parseInt(pinMain.style.top, 10);

// инпут заголовок объявления
var headerAdInput = document.getElementById('title');

// инпут количество комнат
var roomNumber = document.getElementById('room_number');

// кнопка очистить
var btnReset = document.querySelector('.ad-form__reset');


// FUNCTION
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
      cardFragment.appendChild(renderCard(ad));
      mapElement.insertBefore(cardFragment, mapElement.querySelector('.map__filters-container'));
    }
  };
  ad.offer.address = ad.location.x.toString() + ', ' + ad.location.y;
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
    var mapWidth = document.querySelector('.map__pins').clientWidth;
    var ad = createAd(i, title, randomInt(0, mapWidth));
    ads.push(ad);
  }

  return ads;
}

var ads = genAds();

// **********************************************************

function renderPin(ad) {
  var template = document.querySelector('#pin').content.querySelector('.map__pin');
  var element = template.cloneNode(true);
  element.classList.add('pinOther');
  element.style.top = '' + ad.location.y + 'px';
  element.style.left = '' + ad.location.x + 'px';
  var img = element.children[0];
  img.src = ad.author.avatar;
  img.alt = ad.offer.title;
  element.addEventListener('mouseup', ad.onClick);
  return element;
}


// **********************
function renderCard(ad) {
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
}

// блокируем формы объявления
formFields.forEach(function (item) {
  item.setAttribute('disabled', 'disabled');
});

// функция добавляет адрес map__pin в инпут адреc
function fillInputAddress() {
  var input = document.getElementById('address');
  input.setAttribute('value', adressPinMain);
}

// валидация формы тип жилья / цена
function onSelectChanged(evt) {
  switch (evt.target.value) {
    case 'bungalo':
      priceInput.placeholder = 0;
      break;
    case 'flat':
      priceInput.placeholder = 1000;
      break;
    case 'house':
      priceInput.placeholder = 5000;
      break;
    case 'palace':
      priceInput.placeholder = 10000;
      break;
    default:
      priceInput.placeholder = 0;
      break;
  }
}

// валидация форм время заезда и выезда
function onLoad() {
  document.getElementById('timein').onchange = onTimeChanged;
  document.getElementById('timeout').onchange = onTimeChanged;
}

function onTimeChanged(evt) {
  var timeoutInput = document.getElementById('timeout');
  var timeinInput = document.getElementById('timein');

  switch (evt.target.value) {
    case '12:00':
      timeoutInput.value = '12:00';
      timeinInput.value = '12:00';
      break;
    case '13:00':
      timeoutInput.value = '13:00';
      timeinInput.value = '13:00';
      break;
    case '14:00':
      timeoutInput.value = '14:00';
      timeinInput.value = '14:00';
      break;
  }
}

// валидация форм количество комнат и мест
function disabledCapacity(dis) {
  var options = document.getElementById('capacity').getElementsByTagName('option');

  for (var i = 0; i < options.length && i < dis.length; i++) {
    options[i].disabled = dis[i];
  }
}

function modifyCapacity() {
  var capacity = document.getElementById('capacity');

  if (roomNumber.value === '1') {
    disabledCapacity([false, true, true, true]);
    capacity.value = '1';
  } else if (roomNumber.value === '2') {
    disabledCapacity([false, false, true, true]);
    capacity.value = '2';
  } else if (roomNumber.value === '3') {
    disabledCapacity([false, false, false, true]);
    capacity.value = '3';
  } else if (roomNumber.value === '100') {
    disabledCapacity([true, true, true, false]);
    capacity.value = '0';
  }
}

function showUploadMessage() {
  var template = document.querySelector('#success').content.querySelector('.success');
  var element = template.cloneNode(true);
  var btn = document.querySelector('.ad-form__submit');
  btn.appendChild(element);
  function onMessageEscPress(evt) {
    if (evt.keyCode === 27) {
      element.remove();
      document.removeEventListener('keydown', onMessageEscPress);
    }
  }
  document.addEventListener('keydown', onMessageEscPress);

  function onElementRemove() {
    element.remove();
    messageOk.removeEventListener('click', onElementRemove);
  }
  var messageOk = document.querySelector('.success');
  messageOk.addEventListener('click', onElementRemove);
}


function showErrorMessage() {
  var template = document.querySelector('#error').content.querySelector('.error');
  var element = template.cloneNode(true);
  var btn = document.querySelector('.ad-form__submit');
  btn.appendChild(element);
  function onMessageEscPress(evt) {
    if (evt.keyCode === 27) {
      element.remove();
      document.removeEventListener('keydown', onMessageEscPress);
    }
  }
  document.addEventListener('keydown', onMessageEscPress);

  var btnEsc = document.querySelector('.error__button');
  function onErrorButtonClick() {
    element.remove();
    btnEsc.removeEventListener('click', onErrorButtonClick);
  }
  btnEsc.addEventListener('click', onErrorButtonClick);

  var messageError = document.querySelector('.error');
  function onElementRemove() {
    element.remove();
    messageError.removeEventListener('click', onElementRemove);
  }
  messageError.addEventListener('click', onElementRemove);
}

// сброс страницы при нажатии кнопки очистить
function onButtonClick() {
  var cards = document.querySelector('.map__card');
  cards.remove();
  var pinOther = document.querySelectorAll('.pinOther');
  pinOther.forEach(function (item) {
    item.remove();
  });
  fillInputAddress();
  btnReset.removeEventListener('click', onButtonClick);
}


// EventListener
// отправляем данные на сервер
form.addEventListener('submit', function (ev) {
  var data = new FormData(form);
  var http = new XMLHttpRequest();
  http.open(form.method, form.action, true);
  http.onload = function () {
    if (http.status === 200) {
      showUploadMessage();
      form.reset();
    } else {
      showErrorMessage();
    }
  };
  http.send(data);
  ev.preventDefault();
}, false);

// нажатие на главную метку - страница в активном состоянии
pinMain.addEventListener('mouseup', function () {
  document.querySelector('.map').classList.remove('map--faded');
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');
  formFields.forEach(function (item) {
    item.removeAttribute('disabled', 'disabled');
  });
  fillInputAddress();
  var pinsFragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    pinsFragment.appendChild(renderPin(ads[i]));
  }
  pinsElement.appendChild(pinsFragment);
});

// валидация формы заголовок объявления, сообщения об ошибке
headerAdInput.addEventListener('invalid', function () {
  if (headerAdInput.validity.tooShort) {
    headerAdInput.setCustomValidity('Минимальная длина объявления — 30 символов');
  } else if (headerAdInput.validity.tooLong) {
    headerAdInput.setCustomValidity('Заголовок не должен превышать 100 символов');
  } else if (headerAdInput.validity.valueMissing) {
    headerAdInput.setCustomValidity('Обязательное поле');
  } else {
    headerAdInput.setCustomValidity('');
  }
});

headerAdInput.addEventListener('input', function (evt) {
  var target = evt.target;
  if (target.value.length < 30) {
    target.setCustomValidity('Минимальная длина объявления — 30 символов');
  } else {
    target.setCustomValidity('');
  }
});

// валидация input price
var priceInput = document.getElementById('price');
priceInput.addEventListener('invalid', function () {
  if (priceInput.validity.rangeOverflow) {
    priceInput.setCustomValidity('Максимальное значение — 1 000 000');
  } else if (priceInput.validity.valueMissing) {
    priceInput.setCustomValidity('Обязательное поле');
  } else {
    priceInput.setCustomValidity('');
  }
});

priceInput.addEventListener('input', function (evt) {
  var target = evt.target;
  if (target.validity.rangeOverflow) {
    target.setCustomValidity('Максимальное значение — 1 000 000');
  } else {
    target.setCustomValidity('');
  }
});

// валидация формы тип жилья / цена
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('type').onchange = onSelectChanged;
}, false);

// клик на кнопку очистить
btnReset.addEventListener('click', onButtonClick);

// изменения инпутов время заезда и выезда
document.addEventListener('DOMContentLoaded', onLoad, false);

// клик на инпуты количество комнат и мест
roomNumber.addEventListener('change', modifyCapacity);
document.addEventListener('DOMContentLoaded', modifyCapacity, false);
