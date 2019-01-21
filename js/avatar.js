'use strict';
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var fileInput = document.querySelector('.ad-form__field input[type=file]');
  var preview = document.querySelector('.ad-form-header__preview img');
  var defaultAvatar = preview.src;

  var avatarFile = null;

  window.getAvatarFile = function () {
    return avatarFile;
  };

  window.clearAvatarFile = function () {
    avatarFile = null;
    preview.src = defaultAvatar;
  };

  fileInput.addEventListener('change', function () {
    showAvatarPreview(fileInput.files[0]);
  });

  function showAvatarPreview(file) {
    var fileName = file.name.toLowerCase();
    var reader = new FileReader();

    function onLoad() {
      preview.src = reader.result;
      reader.removeEventListener('load', onLoad);
      avatarFile = file;
    }

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      reader.addEventListener('load', onLoad);
      reader.readAsDataURL(file);
    }
  }

  // Drag and drop
  window.dragAvatarOverHandler = function (ev) {

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  };

  window.dropAvatarHandler = function (ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') {
          var file1 = ev.dataTransfer.items[i].getAsFile();
          if (i === 0) {
            showAvatarPreview(file1);
          }
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var j = 0; j < ev.dataTransfer.files.length; j++) {
        var file2 = ev.dataTransfer.files[j];
        if (j === 0) {
          showAvatarPreview(file2);
        }
      }
    }

    // Pass event to removeDragData for cleanup
    removeDragData(ev);
  };

  function removeDragData(ev) {

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to remove the drag data
      ev.dataTransfer.items.clear();
    } else {
      // Use DataTransfer interface to remove the drag data
      ev.dataTransfer.clearData();
    }
  }

})();
