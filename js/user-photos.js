'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var PRECEDING_POSITION = 2;

  var avatarChooser = document.querySelector('#avatar');
  var photoChooser = document.querySelector('#images');
  var draggedItem = null;
  var position = null;
  var oldPhoto = null;

  var getUserImages = function (file, evt) {
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        if (evt.target === avatarChooser) {
          window.variables.avatarPreview.src = reader.result;
        } else {
          var photo = document.createElement('img');
          window.variables.photoPreview.classList.add('images__preview');
          window.variables.photoPreview.appendChild(photo);
          photo.classList.add('user-photo');
          photo.src = reader.result;
        }
      });
      reader.readAsDataURL(file);
    }
  };

  var getUserAvatar = function (evt) {
    var file = avatarChooser.files[0];
    getUserImages(file, evt);
  };

  var getUserPhotos = function (evt) {
    var file = photoChooser.files[photoChooser.files.length - 1];
    getUserImages(file, evt);
  };

  avatarChooser.addEventListener('change', getUserAvatar);

  photoChooser.addEventListener('change', getUserPhotos);

  window.variables.photoPreview.addEventListener('dragstart', function (evt) {
    draggedItem = evt.target;
  });

  window.variables.photoPreview.addEventListener('dragenter', function (evt) {
    evt.preventDefault();
  });

  window.variables.photoPreview.addEventListener('dragover', function (evt) {
    evt.preventDefault();
  });

  window.variables.photoPreview.addEventListener('drop', function (evt) {
    position = draggedItem.compareDocumentPosition(evt.target);
    oldPhoto = window.variables.photoPreview.replaceChild(draggedItem, evt.target);
    if (position === PRECEDING_POSITION) {
      window.variables.photoPreview.insertBefore(oldPhoto, draggedItem.nextSibling);
    } else {
      window.variables.photoPreview.insertBefore(oldPhoto, draggedItem);
    }
    evt.preventDefault();
  });
})();
