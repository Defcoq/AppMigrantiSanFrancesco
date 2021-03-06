(function() {
  'use strict';
  angular.module('UserDirectory.imageservice', [])
    .factory('ImageService', ImageService);

  ImageService.$inject = ['$cordovaCamera', '$q'];

  function ImageService($cordovaCamera, $q) {
    var service = {
      getPic: getPic,
	  getPicCamera : getPicCamera
    };

    return service;

    function getPic() {
      var deffered = $q.defer(),
        options = {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 400,
          targetHeight: 400,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        deffered.resolve('data:image/jpeg;base64,' + imageData);
      }, function(err) {
        deffered.reject(err);
      });

      return deffered.promise;
    }
	
	
	
    function getPicCamera() {
      var deffered = $q.defer(),
        options = {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 400,
          targetHeight: 400,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        deffered.resolve('data:image/jpeg;base64,' + imageData);
      }, function(err) {
        deffered.reject(err);
      });

      return deffered.promise;
    }
  }

})();
