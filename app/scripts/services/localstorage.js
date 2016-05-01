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

      localStorage.setItem('ANGRY_TX', JSON.stringify(cmp_storage));
    };

    return obj;
  });
