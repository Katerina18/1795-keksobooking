'use strict';

(function () {
  window.Utils = {

    // Is value included in array?
    includes: function(value, array) {
      if (Array.isArray(array) && value !== null) {
        for (var i = 0; i < array.length; i++) {
          if (array[i] === value) {
            return true;
          }
        }
      }
      return false;
    },

    // value equals to mask
    // mask === null means any value
    equal: function(value, mask) {
      return mask === null || (value !== null && value === mask);
    },

    // min === null or max === null means infinity
    between: function(value, min, max) {
        return value !== null && (min === null || value >= min) && (max === null || value < max);
    }
  };
})();
