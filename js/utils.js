'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms
  var ENTER_KEYCODE = 13;

  window.utils = {
    // проверяем есть ли значение в массиве
    include: function (value, array) {
      if (Array.isArray(array) && value !== null) {
        for (var i = 0; i < array.length; i++) {
          if (array[i] === value) {
            return true;
          }
        }
      }
      return false;
    },

    // value равно mask, mask === null (любое значение)
    isEqual: function (value, mask) {
      return mask === null || (value !== null && value === mask);
    },

    isBetween: function (value, min, max) {
      return value !== null && (min === null || value >= min) && (max === null || value < max);
    },

    addClickListener: function (element, onEvent) {
      element.addEventListener('click', onEvent);
      element.addEventListener('keyup', function (keyupEvent) {
        if (keyupEvent.keyCode === ENTER_KEYCODE) {
          element.click();
        }
      });
    },

    debounce: function (callback) {
      var timeoutId = null;

      return function () {
        if (typeof timeoutID === 'number') {
          window.clearTimeout(timeoutId);
        }

        timeoutId = window.setTimeout(function () {
          callback.apply(null, arguments);
        }, DEBOUNCE_INTERVAL);
      };
    }
  };
})();
