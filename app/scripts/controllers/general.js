'use strict';

/**
 * @ngdoc function
 * @name angryTaxiApp.controller:GeneralCtrl
 * @description
 * # GeneralCtrl
 * Controller of the angryTaxiApp
 */
angular.module('angryTaxiApp')
  .controller('GeneralCtrl', function ($rootScope, $scope) {

    // ====
    // Ativa ou desativa o menu / mobile
    $rootScope.mobileMenuActive = false;

    $rootScope.toggleMobileMenu = function() {
      $rootScope.mobileMenuActive = $rootScope.mobileMenuActive === false ? true: false;
    };

    // Ativa ou desativa o menu / sobre
    $rootScope.sobreActive = false;

    $rootScope.toggleSobre = function() {
      $rootScope.sobreActive = $rootScope.sobreActive === false ? true: false;
    };
    // ====

  });
