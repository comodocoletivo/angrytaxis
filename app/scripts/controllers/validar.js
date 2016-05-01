'use strict';

/**
 * @ngdoc function
 * @name angryTaxiApp.controller:ValidarCtrl
 * @description
 * # ValidarCtrl
 * Controller of the angryTaxiApp
 */
angular.module('angryTaxiApp')
  .controller('ValidarCtrl', function ($scope, LocalStorage, requestApi, $routeParams, Notification) {

    var ls = LocalStorage.getItem('ANGRY_TX');

    if (ls === null) {
      console.log('ls ', ls);
      return;
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
        console.warn(data);

        if (dat.status === 200) {
          Notification.show('Denúncia confirmada com sucesso!', 'Obrigado :)');
        } else {
          Notification.show('Atenção!', 'Tivemos um problema, tente novamente em alguns instantes.');
        }
      })
    }
  });
