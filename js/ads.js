'use strict';

(function () {
  var ads = [];
  var activeId = -1;

  var map = document.querySelector('.map');

  function createAd(responseId, response) {
    var ad = {
      author: response.author,
      location: response.location,
      offer: response.offer,
      element: null,
      id: responseId,

      bindEmement: function (element) {
        ad.element = element;
      },

      onClick: function () {
        window.closeCard();
        ad.setActive();

        var input = document.querySelector('#address');
        input.setAttribute('value', ad.offer.address);

        var cardFragment = document.createDocumentFragment();
        cardFragment.appendChild(window.card.renderCard(ad));
        map.insertBefore(cardFragment, map.querySelector('.map__filters-container'));
      },

      onEnter: function (evt) {
        if (evt.keyCode === 13) {
          ad.onClick();
        }
      },

      setActive: function () {
        pinUnactive();

        if (ad.element) {
          ad.element.classList.add('map__pin--active');
          activeId = ad.id;
        } else {
          activeId = -1;
        }
      }
    };
    return ad;
  }

  function pinUnactive() {
    if (activeId >= 0 && activeId < ads.length && ads[activeId].element) {
      ads[activeId].element.classList.remove('map__pin--active');
    }
    activeId = -1;
  }

  var errorMessage = null;
  var errorButton = null;

  function onErrorButtonClick() {
    if (onDataSuccess && showErrorMessage) {
      window.load(onDataSuccess, showErrorMessage);
    }
  }

  function showErrorMessage(message) {
    if (!errorMessage) {
      // debugger;
      var template = document.querySelector('#error').content.querySelector('.error');
      errorMessage = template.cloneNode(true);
      errorMessage.firstElementChild.innerText = message;
      var promo = document.querySelector('.promo');
      var parent = promo.parentNode;
      parent.insertBefore(errorMessage, promo);

      errorButton = document.querySelector('.error__button');
      errorButton.addEventListener('click', onErrorButtonClick);
    }
  }

  function removeErrorMessage() {
    if (errorMessage) {
      errorButton.removeEventListener('click', onErrorButtonClick);
      errorMessage.remove();
      errorMessage = null;
      errorButton = null;
    }
  }

  function onDataSuccess(response) {
    try {
      for (var i = 0; i < response.length; i++) {
        var ad = createAd(i, response[i]);
        ads.push(ad);
      }

      if (ads.length !== 0) {
        removeErrorMessage();
      }
    } catch (ex) {
      ads = [];
      showErrorMessage('Data error');
    }
  }

  window.load(onDataSuccess, showErrorMessage);

  window.getAds = function () {
    return ads;
  };

  window.pinUnactive = pinUnactive;
})();
