'use strict';

/**
 * @ngdoc overview
 * @name angryTaxiApp
 * @description
 * # angryTaxiApp
 *
 * Main module of the application.
 */
angular
  .module('angryTaxiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angularMoment',
    'backand',
    'ngMask',
    'ngProgress',
    'ui.bootstrap',
    'ngAnimate',
    'pascalprecht.translate'
  ])
  .config(function ($routeProvider, $locationProvider, $translateProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/complaint/:id', {
        templateUrl: 'views/main.html',
        controller: 'ValidarCtrl',
        controllerAs: 'validar'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    // ====
    // Internationalization
    $translateProvider.useStaticFilesLoader({
      files: [ {
        prefix: 'translate/',
        suffix: '.json'
      }]
    });

    // set preferred language
    $translateProvider.preferredLanguage('pt-BR');
    $translateProvider.forceAsyncReload(true);

    // remember language
    $translateProvider.useLocalStorage();
    // ====
  });
