'use strict';

(function () {
  var filter = {
    TIMEOUT: 250,
    TYPES: ['palace', 'flat', 'house', 'bungalo'],
    FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    priceMin: null,
    priceMax: null,
    type: null,
    rooms: null,
    guests: null,
    features: [],

    lock: false,
    changed: false,

    selectType: document.getElementById('housing-type'),
    selectPrice: document.getElementById('housing-price'),
    selectRooms: document.getElementById('housing-rooms'),
    selectGuests: document.getElementById('housing-guests'),
    featuresInput: document.getElementById('housing-features'),
    checkboxWiFi: document.getElementById('filter-wifi'),
    checkboxDisher: document.getElementById('filter-dishwasher'),
    checkboxParking: document.getElementById('filter-parking'),
    checkboxWasher: document.getElementById('filter-washer'),
    checkboxElevator: document.getElementById('filter-elevator'),
    checkboxCondition: document.getElementById('filter-conditioner'),

    clear: function () {
      filter.priceMin = null;
      filter.priceMax = null;
      filter.type = null;
      filter.rooms = null;
      filter.guests = null;
      filter.features = [];
    },

    filter: function (ad) {
      if (ad && ad.offer) {
        var offer = ad.offer;

        var result = window.Utils.isEqual(offer.type, filter.type) &&
                     window.Utils.isBetween(offer.price, filter.priceMin, filter.priceMax) &&
                     window.Utils.isEqual(offer.rooms, filter.rooms) &&
                     window.Utils.isEqual(offer.guests, filter.guests);

        if (offer.features !== null && filter.features !== null) {
          for (var i = 0; i < filter.features.length; i++) {
            result &= window.Utils.include(filter.features[i], offer.features);
          }
        }
        return result;
      } else {
        return false;
      }
    },

    initial: function () {
      filter.clear();

      filter.type = window.Utils.include(filter.selectType.value, filter.TYPES) ? filter.selectType.value : null;

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

    changeNoneLock: function () {
      window.clearPins();
      filter.initial();
      window.placePins();
      filter.changed = false;
    },

    onChange: function () {
      filter.changed = true;

      if (!filter.lock) {
        filter.lock = true;
        filter.changeNoneLock();

        setTimeout(function () {
          filter.lock = false;

          if (filter.changed) {
            filter.changeNoneLock();
          }
        }, filter.TIMEOUT);
      }
    }
  };

  filter.selectType.addEventListener('change', filter.onChange);
  filter.selectPrice.addEventListener('change', filter.onChange);
  filter.selectRooms.addEventListener('change', filter.onChange);
  filter.selectGuests.addEventListener('change', filter.onChange);

  window.Utils.addClickListener(filter.checkboxWiFi, filter.onChange);
  window.Utils.addClickListener(filter.checkboxDisher, filter.onChange);
  window.Utils.addClickListener(filter.checkboxParking, filter.onChange);
  window.Utils.addClickListener(filter.checkboxWasher, filter.onChange);
  window.Utils.addClickListener(filter.checkboxElevator, filter.onChange);
  window.Utils.addClickListener(filter.checkboxCondition, filter.onChange);

  window.adFilter = filter;
})();
