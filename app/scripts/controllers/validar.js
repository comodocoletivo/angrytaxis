'use strict';

/**
 * @ngdoc function
 * @name angryTaxiApp.controller:ValidarCtrl
 * @description
 * # ValidarCtrl
 * Controller of the angryTaxiApp
 */
angular.module('angryTaxiApp')
  .controller('ValidarCtrl', function ($scope, LocalStorage, requestApi, $routeParams, Notification, $timeout, $location) {

    var ls = LocalStorage.getItem('ANGRY_TX');

    if (ls === null) {
      Notification.show('Atenção!', 'Ocorreu um erro, tente novamente em alguns instantes.');
    } else {
      if ($routeParams.id === ls._id) {
        _checkComplaint(ls._id);
      } else {
        Notification.show('Atenção!', 'A url parece não ser válida. Por favor, tente novamente.');
      }
    }

    function _checkComplaint(id) {
      var params = id;

      requestApi.checkComplaint(params, function(data) {
        if (data.status === 201) {
          LocalStorage.saveComplaint(data.data);
          Notification.show('Denúncia confirmada com sucesso!', 'Obrigado :)');

          $timeout(function() {
            $location.path('/');
          }, 3000);
        } else {
          Notification.show('Atenção!', 'Tivemos um problema, tente novamente em alguns instantes.');
        }
      })
    }
  });
