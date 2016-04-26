'use strict';

/**
 * @ngdoc service
 * @name angryTaxiApp.requestApi
 * @description
 * # requestApi
 * Service in the angryTaxiApp.
 */
angular.module('angryTaxiApp')
  .service('requestApi', function ($http, Backand) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var obj = {};

    obj.createData = function(data, callback) {
      var url = $http ({
        method: 'POST',
        url: Backand.getApiUrl() + '/1/objects/request?returnObject=true',
        data: data // object
      });

      url.then(function(value) {
        callback(value);
      }, function(reason) {
        callback(reason);
      });
    };

    obj.getList = function(callback) {
      var url =  $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/objects/request',
        params: {
          pageSize: 20,
          pageNumber: 1,
          filter: [],
          sort: ''
        }
      });

      url.then(function(value) {
        callback(value);
      }, function(reason) {
        callback(reason);
      });
    };

    obj.socket = function(callback) {
      Backand.on('items_updated', function (data) {
        //Get the 'items' object that have changed
        callback(data);
      });
    }

    return obj;
  });

