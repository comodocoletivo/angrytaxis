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

    obj.createData = function(data, callback) {
      // $http.post(apiUrl + '/user/create', data, {headers: {'app_token': app_token}})
      //   .then(function (data) {
      //     callback(data);
      //   }, function (error) {
      //     callback(error);
      //   });
    };

    obj.getList = function(callback) {
      $http.get(apiUrl + '/api/v1/complaint/')
        .then(function (result) {
          callback(result)
        }, function (error) {
          callback(error);
        });
    };

    obj.sendFeedback = function(data, callback) {
      // $http.post('https://formspree.io/taxisangry@gmail.com', data, {headers: {'Accept': 'application/json'}}).then(
      //   function(data) { callback(data) },
      //   function(error) { callback(error) }
      // );
    };

    return obj;
  });

