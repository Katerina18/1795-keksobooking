'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms

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
        if (keyupEvent.keyCode === 13) {
          element.click();
        }
      });
    },

    debounce: function (callback) {
      var lastTimeout = null;

      return function () {
        var parameters = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          callback.apply(null, parameters);
        }, DEBOUNCE_INTERVAL);
      };
    }
  };
})();
