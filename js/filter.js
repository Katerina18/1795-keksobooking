'use strict';

(function () {
  var adFilter = {
    TYPES: ['palace', 'flat', 'house', 'bungalo'],
    FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    priceMin: null,
    priceMax: null,
    type: null,
    rooms: null,
    guests: null,
    features: [],

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
      adFilter.priceMin = null;
      adFilter.priceMax = null;
      adFilter.type = null;
      adFilter.rooms = null;
      adFilter.guests = null;
      adFilter.features = [];
    },

    filter: function (ad) {
      if (ad && ad.offer) {
        var f = adFilter;
        var o = ad.offer;

        var OK = f.type === null || o.type === null || o.type === f.type;
        OK &= f.priceMin === null || f.priceMax === null || o.price === null || (o.price >= f.priceMin && o.price < f.priceMax);
        OK &= f.rooms === null || o.rooms === null || o.rooms === f.rooms;
        OK &= f.guests === null || o.guests === null || o.guests === f.guests;

        if (o.features !== null && f.features !== null) {
          for (var i = 0; i < f.features.length; i++) {
            OK = OK && o.features.includes(f.features[i]);
          }
        }
        return OK;
      } else {
        return false;
      }
    },

    initial: function () {
      adFilter.clear();

      adFilter.type = adFilter.TYPES.includes(adFilter.selectType.value) ? adFilter.selectType.value : null;

      switch (adFilter.selectPrice.value) {
        case 'low':
          adFilter.priceMin = null;
          adFilter.priceMax = 10000;
          break;
        case 'middle':
          adFilter.priceMin = 10000;
          adFilter.priceMax = 50000;
          break;
        case 'high':
          adFilter.priceMin = 50000;
          adFilter.priceMax = null;
          break;
        default:
          adFilter.priceMin = null;
          adFilter.priceMax = null;
          break;
      }

      switch (adFilter.selectRooms.value) {
        case '1': case '2': case '3':
          adFilter.rooms = parseInt(adFilter.selectRooms.value, 10);
          break;
        default:
          adFilter.rooms = null;
          break;
      }

      switch (adFilter.selectGuests.value) {
        case '0': case '1': case '2':
          adFilter.guests = parseInt(adFilter.selectGuests.value, 10);
          break;
        default:
          adFilter.guests = null;
          break;
      }

      if (adFilter.checkboxWiFi.checked) {
        adFilter.features.push(adFilter.FEATURES[0]);
      }
      if (adFilter.checkboxDisher.checked) {
        adFilter.features.push(adFilter.FEATURES[1]);
      }
      if (adFilter.checkboxParking.checked) {
        adFilter.features.push(adFilter.FEATURES[2]);
      }
      if (adFilter.checkboxWasher.checked) {
        adFilter.features.push(adFilter.FEATURES[3]);
      }
      if (adFilter.checkboxElevator.checked) {
        adFilter.features.push(adFilter.FEATURES[4]);
      }
      if (adFilter.checkboxCondition.checked) {
        adFilter.features.push(adFilter.FEATURES[5]);
      }
    },

    onChange: function () {
      window.clearPins();
      // debugger;
      adFilter.initial();
      window.placePins();
    }
  };

  adFilter.selectType.addEventListener('change', adFilter.onChange);
  adFilter.selectPrice.addEventListener('change', adFilter.onChange);
  adFilter.selectRooms.addEventListener('change', adFilter.onChange);
  adFilter.selectGuests.addEventListener('change', adFilter.onChange);

  adFilter.checkboxWiFi.addEventListener('click', adFilter.onChange);
  adFilter.checkboxDisher.addEventListener('click', adFilter.onChange);
  adFilter.checkboxParking.addEventListener('click', adFilter.onChange);
  adFilter.checkboxWasher.addEventListener('click', adFilter.onChange);
  adFilter.checkboxElevator.addEventListener('click', adFilter.onChange);
  adFilter.checkboxCondition.addEventListener('click', adFilter.onChange);

  window.adFilter = adFilter;
})();
