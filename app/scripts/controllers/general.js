'use strict';

/**
 * @ngdoc function
 * @name angryTaxiApp.controller:GeneralCtrl
 * @description
 * # GeneralCtrl
 * Controller of the angryTaxiApp
 */
angular.module('angryTaxiApp')
  .controller('GeneralCtrl', function ($rootScope, $scope, requestApi, Notification, LocalStorage, $translate) {

    // ====
    // Ativa ou desativa o menu / mobile
    $rootScope.mobileMenuActive = false;

    $scope.toggleMobileMenu = function() {
      $rootScope.mobileMenuActive = $rootScope.mobileMenuActive === false ? true: false;
    };

    // Ativa ou desativa o menu / sobre
    $rootScope.sobreActive = false;

    $scope.toggleSobre = function() {
      $rootScope.sobreActive = $rootScope.sobreActive === false ? true: false;
    };
    // ====


    // ====
    // Cria uma denúncia
    $scope.complaint = {};

    $scope.newComplaint = function(args) {
      var params, ls_position;

      params = $scope.complaint;

      ls_position = LocalStorage.getItem('ANGRY_TX_POS');

      if (params.complaintDate) {
        params.complaintDate = params.complaintDate.split('/')[2] + '/' + params.complaintDate.split('/')[1] + '/' + params.complaintDate.split('/')[0];
      }

      if (params.myLocation === true || params.myLocation === undefined) {
        // envia o endereço de onde está o usuário
        params.reverseAddress = $scope.full_address;

        // enviar o lat/lng do usuário
        params.lat = ls_position.lat.toString();
        params.lng = ls_position.lng.toString();

        delete params.myLocation;
        delete params.address;
      } else {
        // envia o endereço digitado
        params.reverseAddress = params.address;

        // envia o lat/lng do endereço digitado
        params.lat = $scope.addressPosition[0].toString();
        params.lng = $scope.addressPosition[1].toString();

        delete params.address;
        delete params.myLocation;
      }

      if (args === 'praise') {
        params.praise = true;
        $('#modal-elogiar').modal('hide');
      } else {
        $('#modal-denunciar').modal('hide');
      }

      params.platform = 'web';

      requestApi.createComplaint(params, function(data) {
        if (data.status === 201) {
          LocalStorage.saveComplaint(data.data);
          $scope.$emit('complaint_created');
        } else {
          Notification.show('Atenção', 'Tivemos um problema para criar a sua denúncia. Por favor, tente novamente em instantes.');
        }
      });
    };
    // ====


    // ====
    // Clicar em cima de uma denúncia
    $scope.showMarker = function(id) {
      console.log(id);
    };
    // ====


    // ====
    // Envia um feedback / desktop
    $scope.feedback = {};

    $scope.submitFeedback = function() {
      var params = $scope.feedback;

      requestApi.sendFeedback(params, function(data) {
        if (data.status == 200) {
          Notification.show('Mensagem enviada', 'Obrigado pelo seu feedback.');
        } else {
          console.warn('Tivemos um problema no envio do feedback, tente novamente em alguns instantes.')
          Notification.show('Atenção', 'Tivemos um problema no envio do feedback, tente novamente em alguns instantes.');
        }
      })
    };
    // ====


     // ====
    // Internationalization
    $scope.setPortugueseLanguage = function() {
      $translate.use('pt-BR');
    }

    $scope.setEnglishLanguage = function() {
      $translate.use('en');
    }

    // ativar botão
    $scope.isEnActive = false;
    $scope.isBrActive = false;

    $scope.activeButton = function(args) {
      if (args === 'en') {
        $scope.isEnActive = !$scope.isEnActive;
        $scope.isBrActive = false;
      } else {
        $scope.isBrActive = !$scope.isBrActive;
        $scope.isEnActive = false;
      }
    }
    // ====

    $scope.$on('complaint_created', function() {
      Notification.show('Atenção!', 'Enviamos um email para você confirmar a sua denúncia :)');
    });

  });
