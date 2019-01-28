'use strict';
(function () {
  var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
  window.renderPin = function (ad) {
    var element = templatePin.cloneNode(true);
    element.classList.add('pinOther');
    element.style.top = '' + ad.location.y + 'px';
    element.style.left = '' + ad.location.x + 'px';
    var img = element.children[0];
    img.src = ad.author.avatar;
    img.alt = ad.offer.title;
    element.addEventListener('mouseup', ad.onClick);
    element.addEventListener('keydown', ad.onEnter);
    ad.bindEmement(element);
    return element;
  };
})();
