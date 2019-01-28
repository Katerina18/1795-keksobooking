'use strict';

(function () {
  var filter = {
    TYPES: ['palace', 'flat', 'house', 'bungalo'],
    FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    priceMin: null,
    priceMax: null,
    type: null,
    rooms: null,
    guests: null,
    features: [],

    selectType: document.querySelector('#housing-type'),
    selectPrice: document.querySelector('#housing-price'),
    selectRooms: document.querySelector('#housing-rooms'),
    selectGuests: document.querySelector('#housing-guests'),
    featuresInput: document.querySelector('#housing-features'),
    checkboxWiFi: document.querySelector('#filter-wifi'),
    checkboxDisher: document.querySelector('#filter-dishwasher'),
    checkboxParking: document.querySelector('#filter-parking'),
    checkboxWasher: document.querySelector('#filter-washer'),
    checkboxElevator: document.querySelector('#filter-elevator'),
    checkboxCondition: document.querySelector('#filter-conditioner'),

    clear: function () {
      filter.priceMin = null;
      filter.priceMax = null;
      filter.type = null;
      filter.rooms = null;
      filter.guests = null;
      filter.features = [];
    },

    choose: function (ad) {
      if (ad && ad.offer) {
        var offer = ad.offer;

        var result = window.utils.isEqual(offer.type, filter.type) &&
                     window.utils.isBetween(offer.price, filter.priceMin, filter.priceMax) &&
                     window.utils.isEqual(offer.rooms, filter.rooms) &&
                     window.utils.isEqual(offer.guests, filter.guests);

        if (offer.features !== null && filter.features !== null) {
          for (var i = 0; i < filter.features.length; i++) {
            result = result & window.utils.include(filter.features[i], offer.features);
            if (!result) {
              break;
            }
          }
        }
        return result;
      }
      return false;
    },

    initial: function () {
      filter.clear();

      filter.type = window.utils.include(filter.selectType.value, filter.TYPES) ? filter.selectType.value : null;

      switch (filter.selectPrice.value) {
        case 'low':
          filter.priceMin = null;
          filter.priceMax = 10000;
          break;
        case 'middle':
          filter.priceMin = 10000;
          filter.priceMax = 50000;
          break;
        case 'high':
          filter.priceMin = 50000;
          filter.priceMax = null;
          break;
        default:
          filter.priceMin = null;
          filter.priceMax = null;
          break;
      }

      switch (filter.selectRooms.value) {
        case '1': case '2': case '3':
          filter.rooms = parseInt(filter.selectRooms.value, 10);
          break;
        default:
          filter.rooms = null;
          break;
      }

      switch (filter.selectGuests.value) {
        case '0': case '1': case '2':
          filter.guests = parseInt(filter.selectGuests.value, 10);
          break;
        default:
          filter.guests = null;
          break;
      }

      if (filter.checkboxWiFi.checked) {
        filter.features.push(filter.FEATURES[0]);
      }
      if (filter.checkboxDisher.checked) {
        filter.features.push(filter.FEATURES[1]);
      }
      if (filter.checkboxParking.checked) {
        filter.features.push(filter.FEATURES[2]);
      }
      if (filter.checkboxWasher.checked) {
        filter.features.push(filter.FEATURES[3]);
      }
      if (filter.checkboxElevator.checked) {
        filter.features.push(filter.FEATURES[4]);
      }
      if (filter.checkboxCondition.checked) {
        filter.features.push(filter.FEATURES[5]);
      }
    },

    onChange: function () {
      window.clearPins();
      filter.initial();
      window.placePins();
    }
  };

  filter.selectType.addEventListener('change', window.utils.debounce(filter.onChange));
  filter.selectPrice.addEventListener('change', window.utils.debounce(filter.onChange));
  filter.selectRooms.addEventListener('change', window.utils.debounce(filter.onChange));
  filter.selectGuests.addEventListener('change', window.utils.debounce(filter.onChange));

  window.utils.addClickListener(filter.checkboxWiFi, window.utils.debounce(filter.onChange));
  window.utils.addClickListener(filter.checkboxDisher, window.utils.debounce(filter.onChange));
  window.utils.addClickListener(filter.checkboxParking, window.utils.debounce(filter.onChange));
  window.utils.addClickListener(filter.checkboxWasher, window.utils.debounce(filter.onChange));
  window.utils.addClickListener(filter.checkboxElevator, window.utils.debounce(filter.onChange));
  window.utils.addClickListener(filter.checkboxCondition, window.utils.debounce(filter.onChange));

  window.adFilter = filter;
})();
