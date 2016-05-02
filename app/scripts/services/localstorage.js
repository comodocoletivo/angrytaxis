'use strict';

/**
 * @ngdoc service
 * @name angryTaxiApp.LocalStorage
 * @description
 * # LocalStorage
 * Service in the angryTaxiApp.
 */
angular.module('angryTaxiApp')
  .service('LocalStorage', function ($rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var obj = {};
    var cmp_storage = {};
    var user_position = {};
    var fake_position = {};
    var save_markers = {};

    obj.getItem = function (key) {
      return JSON.parse(localStorage.getItem(key));
    };

    obj.saveComplaint = function (obj) {
      cmp_storage._id = obj._id;
      cmp_storage.authorized = obj.authorized;

      cmp_storage.title = obj.title;
      cmp_storage.email = obj.email;
      cmp_storage.complaintTime = obj.complaintTime;
      cmp_storage.carID = obj.carID;
      cmp_storage.lat = obj.lat;
      cmp_storage.lng = obj.lng;
      cmp_storage.reverseAddress = obj.reverseAddress;
      cmp_storage.complaintDate = obj.complaintDate;
      cmp_storage.praise = obj.praise;
      cmp_storage.platform = obj.platform;

      localStorage.setItem('ANGRY_TX', JSON.stringify(cmp_storage));
    };

    obj.saveUserPosition = function (obj) {
      user_position.lat = obj.coords.latitude;
      user_position.lng = obj.coords.longitude;
      user_position.timestamp = obj.coords.timestamp;

      localStorage.setItem('ANGRY_TX_POS', JSON.stringify(user_position));
    };

    obj.saveFakePosition = function (obj) {
      fake_position.lat = obj.latitude;
      fake_position.lng = obj.longitude;

      localStorage.setItem('ANGRY_TX_POS', JSON.stringify(fake_position));
    };

    obj.saveMarkers = function (obj) {
      save_markers._id = obj._id;
      save_markers.title = obj.title;
      save_markers.lat = obj.lat;
      save_markers.lng = obj.lng;
      save_markers.praise = obj.praise;

      localStorage.setItem('ANGRY_TX_PINS', JSON.stringify(save_markers));
    };

    return obj;
  });
