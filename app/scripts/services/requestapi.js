'use strict';

/**
 * @ngdoc service
 * @name angryTaxiApp.requestApi
 * @description
 * # requestApi
 * Service in the angryTaxiApp.
 */
angular.module('angryTaxiApp')
  .service('requestApi', function ($http, ApiConfig) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var obj = {};
    var apiUrl = ApiConfig.API_URL;

    obj.createComplaint = function(data, callback) {
      $http.post(apiUrl + '/api/v1/complaint/', data)
        .then(function (data) {
          callback(data);
        }, function (error) {
          callback(error);
        });
    };

    obj.checkComplaint = function(params, callback) {
      return console.warn(params);

      $http.post(apiUrl + '/api/v1/complaint/' + params)
        .then(function (data) {
          callback(data);
        }, function (error) {
          callback(error);
        });
    };

    obj.getList = function(callback) {
      // $http.get(apiUrl + '/api/v1/complaint/')
      $http.get('../../scripts/markers.json')
        .then(function (result) {
          callback(result)
        }, function (error) {
          callback(error);
        });
    };

    obj.sendFeedback = function(data, callback) {
      $http.post('https://formspree.io/taxisangry@gmail.com', data, {headers: {'Accept': 'application/json'}}).then(
        function(data) { callback(data) },
        function(error) { callback(error) }
      );
    };

    return obj;
  });

