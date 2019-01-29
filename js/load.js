'use strict';

(function () {
  var STATUS_COD_OK = 200;
  var TIMEOUT = 10000;
  var RESPONSE_TYPE = 'json';
  var loader = {
    URL: 'https://js.dump.academy/keksobooking/data',
    funcSuccess: null,
    funcError: null,

    load: function (onSuccess, onError) {
      loader.funcSuccess = onSuccess;
      loader.funcError = onError;

      var xhr = new XMLHttpRequest();
      xhr.responseType = RESPONSE_TYPE;
      xhr.timeout = TIMEOUT;

      xhr.onload = function () {
        if (xhr.status === STATUS_COD_OK) {
          if (loader.funcSuccess) {
            loader.funcSuccess(xhr.response);
          }
        } else {
          if (loader.funcError) {
            loader.funcError('Ошибка соединения с сервером ' + xhr.status + '\n' + xhr.statusText);
          }
        }
      };

      xhr.addEventListener('error', function () {
        if (loader.funcError) {
          loader.funcError('Нет соединения с сервером');
        }
      });

      xhr.addEventListener('timeout', function () {
        if (loader.funcError) {
          loader.funcError('Ошибка соединения с сервером\nTimeout Error');
        }
      });

      try {
        xhr.open('GET', loader.URL, true);
        xhr.send();
      } catch (ex) {
        if (loader.funcError) {
          loader.funcError('Нет соединения с сервером');
        }
      }
    }
  };

  window.load = loader.load;

})();
