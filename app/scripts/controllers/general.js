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

    $rootScope.toggleMobileMenu = function() {
      $rootScope.mobileMenuActive = $rootScope.mobileMenuActive === false ? true: false;
    };

    // Ativa ou desativa o menu / sobre
    $rootScope.sobreActive = false;

    $rootScope.toggleSobre = function() {
      $rootScope.sobreActive = $rootScope.sobreActive === false ? true: false;
    };
    // ====


    // ====
    // Cria uma denúncia
    $scope.complaint = {};

    $scope.newComplaint = function() {
      // $scope.progressbar.start();

      var params = $scope.complaint;

      // botão de aconteceu agora
      if (params.now == true) {
        params.date = new Date().getTime();
        delete params.now;
      }

      if (params.complaintDate) {
        params.complaintDate = params.complaintDate.split('/')[2] + '/' + params.complaintDate.split('/')[1] + '/' + params.complaintDate.split('/')[0];
      }

      if (params.myLocation === true || params.myLocation === undefined) {
        // envia o endereço de onde está o usuário
        params.reverseAddress = $scope.full_address;

        // enviar o lat/lng do usuário
        params.lat = $scope.userPositionObj.lat.toString();
        params.lng = $scope.userPositionObj.lng.toString();

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

      $('#modal-denunciar').modal('hide');

      requestApi.createComplaint(params, function(data) {
        if (data.status === 201) {
          $scope.$emit('complaint_created');
          LocalStorage.saveComplaint(data.data);

          // $scope.progressbar.complete();
          Notification.show('Denúncia criada com sucesso!', 'Enviamos um email para você confirmar a sua denúncia :)');
        } else {
          // $scope.progressbar.complete();
          Notification.show('Atenção', 'Tivemos um problema para criar a sua denúncia. Por favor, tente novamente em instantes.');
        }

      });
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

  });
