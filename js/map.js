'use strict';
(function () {

  var pinsElement = document.querySelector('.map__pins');

  // активное состояние страницы
  var pinMain = document.querySelector('.map__pin--main');
  var adressPinMain = parseInt(pinMain.style.left, 10) + ', ' + parseInt(pinMain.style.top, 10);

  // кнопка очистить
  var btnReset = document.querySelector('.ad-form__reset');

  // функция добавляет адрес map__pin в инпут адреc
  function fillInputAddress() {
    var input = document.getElementById('address');
    input.setAttribute('value', adressPinMain);
  }

  // сброс страницы при нажатии кнопки очистить
  function onButtonClick() {
    var cards = document.querySelector('.popup');
    cards.remove();
    var pinOther = document.querySelectorAll('.pinOther');
    pinOther.forEach(function (item) {
      item.remove();
    });
    fillInputAddress();
  }

  // перемещение главного маркера
  (function () {
    pinMain.addEventListener('mousedown', function (evt) {
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
    });

  })();


  // клик на кнопку очистить
  btnReset.addEventListener('click', onButtonClick);


  // нажатие на главную метку - страница в активном состоянии
  pinMain.addEventListener('mousedown', function () {
    var ads = window.getAds();
    document.querySelector('.map').classList.remove('map--faded');
    document.querySelector('.ad-form').classList.remove('ad-form--disabled');
    window.formFields.forEach(function (item) {
      item.removeAttribute('disabled', 'disabled');
    });
    fillInputAddress();
    var pinsFragment = document.createDocumentFragment();
    for (var i = 0; i < ads.length; i++) {
      pinsFragment.appendChild(window.renderPin(ads[i]));
    }
    pinsElement.appendChild(pinsFragment);
  });

})();
