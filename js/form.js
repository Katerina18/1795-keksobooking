'use strict';

(function () {
  var form = document.querySelector('.ad-form');
  var formFields = document.querySelectorAll('.ad-form__element');
  var formFilter = document.querySelectorAll('.map__filter');
  var templateSuccess = document.querySelector('#success').content.querySelector('.success');
  var templateError = document.querySelector('#error').content.querySelector('.error');

  window.formFields = formFields;
  window.formFilter = formFilter;

  window.avatar = document.querySelector('#avatar');
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
    document.querySelector('.map__features').setAttribute('disabled', 'disabled');

    window.avatar.setAttribute('disabled', 'disabled');

    formFilter.forEach(function (item) {
      item.setAttribute('disabled', 'disabled');
    });

    // блокируем формы объявления
    formFields.forEach(function (item) {
      item.setAttribute('disabled', 'disabled');
    });

    initialForm();
  };

  // валидация формы тип жилья / цена
  function onTypeChanged(evt) {
    switch (evt.target.value) {
      case 'bungalo':
        priceInput.placeholder = 0;
        priceInput.min = 0;
        break;
      case 'flat':
        priceInput.placeholder = 1000;
        priceInput.min = 1000;
        break;
      case 'house':
        priceInput.placeholder = 5000;
        priceInput.min = 5000;
        break;
      case 'palace':
        priceInput.placeholder = 10000;
        priceInput.min = 10000;
        break;
      default:
        priceInput.placeholder = 0;
        priceInput.min = 0;
        break;
    }
  }

  function onTimeChanged(evt) {
    var timeoutInput = document.querySelector('#timeout');
    var timeinInput = document.querySelector('#timein');

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
      if (evt.keyCode === 27) {
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
      if (evt.keyCode === 27) {
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
    var avatarFile = window.getAvatarFile();
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
      if (http.status === 200) {
        showUploadMessage();
        form.reset();
        window.clearAvatarFile();
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
    if (target.value.length < 30) {
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
