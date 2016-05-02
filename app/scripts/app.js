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
  })
  .run(['$window', '$rootScope', 'Notification', function ($window, $rootScope, Notification) {

    // ====
    // Offline
    $rootScope.online = navigator.onLine;

    $window.addEventListener("offline", function () {
      $rootScope.$apply(function() {
        $rootScope.online = false;
        $rootScope.$emit('network_changed');
      });
    }, false);

    $window.addEventListener("online", function () {
      $rootScope.$apply(function() {
        $rootScope.online = true;
        $rootScope.$emit('network_changed');
      });
    }, false);

    function _setOnlineFavicon() {
      var link;

      link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = 'https://angrytaxis.com/favicon.ico';

      document.getElementsByTagName('head')[0].appendChild(link);
    }

    function _setOfflineFavicon() {
      var link;

      link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = 'https://angrytaxis.com/favicon-off.ico';

      document.getElementsByTagName('head')[0].appendChild(link);
    }

    $rootScope.$on('network_changed', function() {
      if ($rootScope.online === true) {
        Notification.show('UHUL!', 'Sua internet voltou a funcionar :)');
        _setOnlineFavicon();
      } else {
        Notification.show('OPS!', 'Você parece está com problemas de internet :(');
        _setOfflineFavicon();
      }
    })
    // ====

    // ====
    // Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js', { scope: './'})
      .then(function(reg) {
        console.log('SW registrado: ', reg);
      }).catch(function(err) {
        console.warn('Erro no registro do sw: ', err);
      });
    } else {
      console.warn('Seu navegador não suporta service worker.');
    }
    // ====

  }]);
