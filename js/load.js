'use strict';

(function () {
  var loader = {
    URL: 'https://js.dump.academy/keksobooking/data',
    funcSuccess: null,
    funcError: null,

    load: function (onSuccess, onError) {
      loader.funcSuccess = onSuccess;
      loader.funcError = onError;

      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.timeout = 10000;

      xhr.onload = function () {
        if (xhr.status === 200) {
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
