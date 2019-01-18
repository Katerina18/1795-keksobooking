'use strict';

(function () {
  var ads = [];
  var mapElement = document.querySelector('.map');

  function createAd(response) {
    var ad = {
      author: response.author,
      location: response.location,
      offer: response.offer,
      onClick: function () {
        window.closeCard();

        var input = document.getElementById('address');
        input.setAttribute('value', ad.offer.address);

        var cardFragment = document.createDocumentFragment();
        cardFragment.appendChild(window.card.renderCard(ad));
        mapElement.insertBefore(cardFragment, mapElement.querySelector('.map__filters-container'));
      }
    };
    return ad;
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
        var ad = createAd(response[i]);
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
})();
