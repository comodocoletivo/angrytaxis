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
  .config(function ($routeProvider, BackandProvider, $locationProvider, $translateProvider) {
      // backand service
      BackandProvider.setAppName('angrytaxi');
      BackandProvider.setSignUpToken('2a1c2dcb-704b-4702-ba00-1aca118dede2');
      BackandProvider.setAnonymousToken('502f185a-4fa3-4d8a-82cb-6c7dc35300ce');
      // BackandProvider.runSocket(true);

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
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

    var translationsEN = {
      "ABOUT": "about",
      "FEEDBACK": "feedback",
      "DENOUNCE": "denounce",
      "LAST_COMPLAINTS": "last complaints",
      "ALL_RIGHTS_RESERVED": "All rights reserved",
      "PASSENGERS": "for passengers",
      "ALL_RIGHTS_RESERVED_COMPLETE": "All rights reserved for passengers",
      "ENGLISH_BUTTON": "English",
      "PORTUGUESE_BUTTON": "Portuguese",
      "SHARE": "Share"
    };

    var translationspt_BR = {
      "ABOUT": "sobre",
      "FEEDBACK": "feedback",
      "DENOUNCE": "denunciar",
      "LAST_COMPLAINTS": "últimas denúncias",
      "ALL_RIGHTS_RESERVED": "Todos os direitos reservados",
      "PASSENGERS": "para os passageiros",
      "ALL_RIGHTS_RESERVED_COMPLETE": "Todos os direitos reservados para os passageiros",
      "ENGLISH_BUTTON": "Inglês",
      "PORTUGUESE_BUTTON": "Português",
      "SHARE": "Compartilhe"
    };


    $translateProvider.translations('en', translationsEN);
    $translateProvider.translations('pt-BR', translationspt_BR);

    // set preferred language
    $translateProvider.preferredLanguage('pt-BR');

    // remember language
    $translateProvider.useLocalStorage();
    // ====
  });
