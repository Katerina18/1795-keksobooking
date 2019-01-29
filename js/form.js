'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var STATUS_COD_OK = 200;
  var MIN_LENGTH_TITLE = 30;
  var BUNGALO_PRICE_MIN = 0;
  var FLAT_PRICE_MIN = 1000;
  var HOUSE_PRICE_MIN = 5000;
  var PALACE_PRICE_MIN = 10000;
  var PRICE_MIN = 0;
  var TIMEOUT_FIST = '12:00';
  var TIMEIN_FIST = '12:00';
  var TIMEOUT_SECOND = '13:00';
  var TIMEIN_SECOND = '13:00';
  var TIMEOUT_THIRD = '14:00';
  var TIMEIN_THIRD = '14:00';

  var form = document.querySelector('.ad-form');
  var formFields = document.querySelectorAll('.ad-form__element');
  var formFilter = document.querySelectorAll('.map__filter');
  var templateSuccess = document.querySelector('#success').content.querySelector('.success');
  var templateError = document.querySelector('#error').content.querySelector('.error');

  window.formFields = formFields;
  window.formFilter = formFilter;

  window.avatarForm = document.querySelector('#avatar');
  var priceInput = document.querySelector('#price');
  var roomNumber = document.querySelector('#room_number');
  var accommodationType = document.querySelector('#type');
  var timein = document.querySelector('#timein');
  var timeout = document.querySelector('#timeout');

  // заголовок объявления
  var title = document.querySelector('#title');

  window.blockPage = function () {
    form.reset();
    form.classList.add('ad-form--disabled');
    document.querySelector('.map__filters').classList.add('ad-form--disabled');

    // блокируем форму с фильтрами
    document.querySelector('.map__features').disabled = true;

    window.avatarForm.disabled = true;

    formFilter.forEach(function (item) {
      item.disabled = true;
    });

    // блокируем формы объявления
    formFields.forEach(function (item) {
      item.disabled = true;
    });

    initialForm();
  };

  // валидация формы тип жилья / цена
  function onTypeChanged(evt) {
    switch (evt.target.value) {
      case 'bungalo':
        priceInput.placeholder = BUNGALO_PRICE_MIN;
        priceInput.min = BUNGALO_PRICE_MIN;
        break;
      case 'flat':
        priceInput.placeholder = FLAT_PRICE_MIN;
        priceInput.min = FLAT_PRICE_MIN;
        break;
      case 'house':
        priceInput.placeholder = HOUSE_PRICE_MIN;
        priceInput.min = HOUSE_PRICE_MIN;
        break;
      case 'palace':
        priceInput.placeholder = PALACE_PRICE_MIN;
        priceInput.min = PALACE_PRICE_MIN;
        break;
      default:
        priceInput.placeholder = PRICE_MIN;
        priceInput.min = PRICE_MIN;
        break;
    }
  }

  function onTimeChanged(evt) {
    var timeoutInput = document.querySelector('#timeout');
    var timeinInput = document.querySelector('#timein');

    switch (evt.target.value) {
      case TIMEOUT_FIST:
        timeoutInput.value = TIMEOUT_FIST;
        timeinInput.value = TIMEIN_FIST;
        break;
      case TIMEOUT_SECOND:
        timeoutInput.value = TIMEOUT_SECOND;
        timeinInput.value = TIMEIN_SECOND;
        break;
      case TIMEOUT_THIRD:
        timeoutInput.value = TIMEOUT_THIRD;
        timeinInput.value = TIMEIN_THIRD;
        break;
    }
  }

  // валидация форм количество комнат и мест
  function disabledCapacity(dis) {
    var options = document.querySelector('#capacity').getElementsByTagName('option');

    for (var i = 0; i < options.length && i < dis.length; i++) {
      options[i].disabled = dis[i];
    }
  }

  function onCapacityChanged() {
    var capacity = document.querySelector('#capacity');

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
    var element = templateSuccess.cloneNode(true);
    var promo = document.querySelector('.promo');
    var parent = promo.parentNode;
    parent.insertBefore(element, promo);

    function onSuccessEsc(evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        document.removeEventListener('keydown', onSuccessEsc);
        element.removeEventListener('click', onSuccessClick);
        element.remove();
      }
    }

    function onSuccessClick() {
      document.removeEventListener('keydown', onSuccessEsc);
      element.removeEventListener('click', onSuccessClick);
      element.remove();
    }

    document.addEventListener('keydown', onSuccessEsc);
    element.addEventListener('click', onSuccessClick);
  }

  function showErrorMessage() {
    var element = templateError.cloneNode(true);
    var promo = document.querySelector('.promo');
    var parent = promo.parentNode;
    parent.insertBefore(element, promo);

    var errorButton = document.querySelector('.error__button');
    var messageError = document.querySelector('.error');

    function onErrorEsc(evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        document.removeEventListener('keydown', onErrorEsc);
        errorButton.removeEventListener('click', onErrorClick);
        messageError.removeEventListener('click', onErrorClick);
        element.remove();
      }
    }

    function onErrorClick() {
      document.removeEventListener('keydown', onErrorEsc);
      errorButton.removeEventListener('click', onErrorClick);
      messageError.removeEventListener('click', onErrorClick);
      element.remove();
    }

    document.addEventListener('keydown', onErrorEsc);
    errorButton.addEventListener('click', onErrorClick);
    messageError.addEventListener('click', onErrorClick);
  }

  // отправляем данные на сервер
  form.addEventListener('submit', function (ev) {
    var data = new FormData(form);
    var avatarFile = window.avatar.getAvatarFile();
    var photoFiles = window.getPhotoFiles();

    if (avatarFile) {
      data.append('avatar', avatarFile, avatarFile.name);
    }

    if (photoFiles && Array.isArray(photoFiles)) {
      for (var i = 0; i < photoFiles.length; i++) {
        data.append('photo' + i, photoFiles[i], photoFiles[i].name);
      }
    }

    var http = new XMLHttpRequest();
    http.open(form.method, form.action, true);

    http.onload = function () {
      if (http.status === STATUS_COD_OK) {
        showUploadMessage();
        form.reset();
        window.avatar.clearAvatarFile();
        window.clearPhotoFiles();
        window.clearPins();
      } else {
        showErrorMessage();
      }
    };

    http.send(data);
    ev.preventDefault();
  }, false);


  // валидация формы заголовок объявления, сообщения об ошибке
  title.addEventListener('invalid', function () {
    if (title.validity.tooShort) {
      title.setCustomValidity('Минимальная длина объявления — 30 символов');
    } else if (title.validity.tooLong) {
      title.setCustomValidity('Заголовок не должен превышать 100 символов');
    } else if (title.validity.valueMissing) {
      title.setCustomValidity('Обязательное поле');
    } else {
      title.setCustomValidity('Ошибка');
    }
  });

  title.addEventListener('input', function (evt) {
    var target = evt.target;
    if (target.value.length < MIN_LENGTH_TITLE) {
      target.setCustomValidity('Минимальная длина объявления — 30 символов');
    } else if (target.value.length > 100) {
      target.setCustomValidity('Превышена максимальная длина объявления');
    } else {
      target.setCustomValidity('');
    }
  });

  // валидация input price
  priceInput.addEventListener('invalid', function () {
    if (priceInput.validity.rangeOverflow) {
      priceInput.setCustomValidity('Максимальная цена за ночь ' + priceInput.max);
    } else if (priceInput.validity.rangeUnderflow) {
      priceInput.setCustomValidity('Минимальная цена за ночь ' + priceInput.min);
    } else if (priceInput.validity.valueMissing) {
      priceInput.setCustomValidity('Обязательное поле');
    } else {
      priceInput.setCustomValidity('Ошибка');
    }
  });

  priceInput.addEventListener('input', function (evt) {
    var value = parseInt(evt.target.value, 10);

    if (value < parseInt(priceInput.min, 10)) {
      evt.target.setCustomValidity('Минимальная цена за ночь ' + priceInput.min);
    } else if (value > parseInt(priceInput.max, 10)) {
      evt.target.setCustomValidity('Максимальная цена за ночь ' + priceInput.max);
    } else {
      evt.target.setCustomValidity('');
    }
  });

  // валидация формы тип жилья / цена
  accommodationType.addEventListener('change', onTypeChanged, false);
  roomNumber.addEventListener('change', onCapacityChanged, false);
  timein.addEventListener('change', onTimeChanged, false);
  timeout.addEventListener('change', onTimeChanged, false);

  function initialForm() {
    priceInput.placeholder = 1000;
    priceInput.min = 1000;
    onCapacityChanged();
  }

  window.blockPage();
})();
