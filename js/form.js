'use strict';

(function () {
  var buttonSubmit = document.querySelector('.ad-form__submit');

  var form = document.querySelector('.ad-form');
  window.avatar = document.getElementById('avatar');

  // форма объявления
  var formFields = document.querySelectorAll('.ad-form__element');
  window.formFields = formFields;

  // блокируем форму с фильтрами
  var formFilter = document.querySelector('.map__filters');
  formFilter.setAttribute('disabled', 'disabled');

  // инпут заголовок объявления
  var headerAdInput = document.getElementById('title');

  // инпут количество комнат
  var roomNumber = document.getElementById('room_number');

  window.avatar.setAttribute('disabled', 'disabled');

  // блокируем формы объявления
  formFields.forEach(function (item) {
    item.setAttribute('disabled', 'disabled');
  });

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
    buttonSubmit.appendChild(element);
    window.onMessageEscPress = function (evt) {
      if (evt.keyCode === 27) {
        element.remove();
        document.removeEventListener('keydown', window.onMessageEscPress);
      }
    };
    document.addEventListener('keydown', window.onMessageEscPress);

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
    var promo = document.querySelector('.promo');
    var parent = promo.parentNode;
    parent.insertBefore(element, promo);
    function onMessageEscPress(evt) {
      if (evt.keyCode === 27) {
        element.remove();
        document.removeEventListener('keydown', onMessageEscPress);
      }
    }
    document.addEventListener('keydown', onMessageEscPress);

    var errorButton = document.querySelector('.error__button');
    function onErrorButtonClick() {
      element.remove();
      errorButton.removeEventListener('click', onErrorButtonClick);
    }
    errorButton.addEventListener('click', onErrorButtonClick);

    var messageError = document.querySelector('.error');
    function onElementRemove() {
      element.remove();
      messageError.removeEventListener('click', onElementRemove);
    }
    messageError.addEventListener('click', onElementRemove);
  }

  // отправляем данные на сервер
  form.addEventListener('submit', function (ev) {
    var data = new FormData(form);
    var file = window.getAvatarFile();
    if (file) {
      data.append('avatar', file, file.name);
    }

    var http = new XMLHttpRequest();
    http.open(form.method, form.action, true);
    http.onload = function () {
      if (http.status === 200) {
        showUploadMessage();
        form.reset();
        window.clearAvatarFile();
      } else {
        showErrorMessage();
      }
    };
    http.send(data);
    ev.preventDefault();
  }, false);


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

  // изменения инпутов время заезда и выезда
  document.addEventListener('DOMContentLoaded', onLoad, false);

  // клик на инпуты количество комнат и мест
  roomNumber.addEventListener('change', modifyCapacity);
  document.addEventListener('DOMContentLoaded', modifyCapacity, false);

})();
