'use strict';

/**
 * @ngdoc function
 * @name angryTaxiApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angryTaxiApp
 */
angular.module('angryTaxiApp')
  .controller('AboutCtrl', function ($scope) {

    // seta uma clase para a transição das páginas.
    // $scope.pageClass = 'page-about';

    $scope.comeBack = function() {
      window.history.back();
    };

  });
