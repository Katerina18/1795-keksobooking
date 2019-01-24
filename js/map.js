'use strict';
(function () {
  var pinsElement = document.querySelector('.map__pins');

  // активное состояние страницы
  var pinMain = document.querySelector('.map__pin--main');
  var adressPinMain = parseInt(pinMain.style.left, 10) + ', ' + parseInt(pinMain.style.top, 10);
  var mainPinEnable = true;
  var pinMainDefaultLeft = parseInt(pinMain.style.left, 10);
  var pinMainDefaultTop = parseInt(pinMain.style.top, 10);

  // кнопка очистить
  var buttonReset = document.querySelector('.ad-form__reset');

  // функция добавляет адрес map__pin в инпут адреc
  function fillInputAddress() {
    var input = document.getElementById('address');
    input.setAttribute('value', adressPinMain);
  }

  window.closeCard = function () {
    var card = document.querySelector('.popup');
    if (card) {
      card.remove();
    }
  };

  window.removePins = function () {
    var pinOther = document.querySelectorAll('.pinOther');
    if (pinOther) {
      pinOther.forEach(function (item) {
        item.remove();
      });
    }
  };

  window.clearPins = function () {
    window.closeCard();
    window.removePins();
    mainPinEnable = true;
    pinMain.focus();
    pinMain.style.left = pinMainDefaultLeft + 'px';
    pinMain.style.top = pinMainDefaultTop + 'px';
    adressPinMain = pinMainDefaultLeft + ', ' + pinMainDefaultTop;
    fillInputAddress();
  };


  function onPinMove(evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mapWidth = document.querySelector('.map__pins').clientWidth;
      var mapHeight = document.querySelector('.map__pins').clientHeight;
      var pinWidth = pinMain.offsetWidth;
      var pinHeight = pinMain.offsetHeight;

      if (pinMain.offsetLeft - shift.x < 0) {
        shift.x = pinMain.offsetLeft;
      } else if (pinMain.offsetLeft - shift.x > mapWidth - pinWidth) {
        shift.x = pinMain.offsetLeft - (mapWidth - pinWidth);
      }

      if (pinMain.offsetTop - shift.y < 0) {
        shift.y = pinMain.offsetTop;
      } else if (pinMain.offsetTop - shift.y > mapHeight - pinHeight) {
        shift.y = pinMain.offsetTop - (mapHeight - pinHeight);
      }

      pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';
      pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';

      adressPinMain = parseInt(pinMain.style.left, 10) + ', ' + parseInt(pinMain.style.top, 10);
      fillInputAddress();
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      function onClickPreventDefault() {
        evt.preventDefault();
        pinMain.removeEventListener('click', onClickPreventDefault);
      }
      if (dragged) {
        pinMain.addEventListener('click', onClickPreventDefault);
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  window.placePins = function () {
    var PINS_NUMBER = 5;

    if (mainPinEnable) {
      mainPinEnable = false;

      var ads = window.getAds();
      document.querySelector('.map').classList.remove('map--faded');
      document.querySelector('.ad-form').classList.remove('ad-form--disabled');
      window.avatar.removeAttribute('disabled', 'disabled');
      window.formFields.forEach(function (item) {
        item.removeAttribute('disabled', 'disabled');
      });
      fillInputAddress();

      var pinsFragment = document.createDocumentFragment();
      var pinNumber = 0;

      for (var i = 0; i < ads.length; i++) {
        if (window.adFilter.filter(ads[i])) {
          pinsFragment.appendChild(window.renderPin(ads[i]));
          if (++pinNumber >= PINS_NUMBER) {
            break;
          }
        }
      }

      if (pinsFragment.length !== 0) {
        pinsElement.appendChild(pinsFragment);
      }
    }
  };

  // перемещение главного маркера
  pinMain.addEventListener('mousedown', onPinMove);

  // клик на кнопку очистить
  window.Utils.addClickListener(buttonReset, window.clearPins);

  // нажатие на главную метку - страница в активном состоянии
  window.Utils.addClickListener(pinMain, window.placePins);

  pinMain.focus();

})();
