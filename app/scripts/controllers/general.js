'use strict';

/**
 * @ngdoc function
 * @name angryTaxiApp.controller:GeneralCtrl
 * @description
 * # GeneralCtrl
 * Controller of the angryTaxiApp
 */
angular.module('angryTaxiApp')
  .controller('GeneralCtrl', function ($rootScope, $scope, requestApi, Notification, LocalStorage, $translate, $http) {

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
    // Autocomplete do endereço
    $scope.autoComplete = function(address) {
      return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: address,
          sensor: false,
          language: 'pt-BR'
        }
      }).then(function(response){
        return response.data.results.map(function(item){
          $scope.formatted_address = item.formatted_address;
          $scope.formatted_address_location = item.geometry.location;
          return item.formatted_address;
        });
      });
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

      if (params.myLocation === true) {
        // envia o endereço de onde está o usuário
        params.reverseAddress = $scope.full_address;

        // enviar o lat/lng do usuário
        params.lat = ls_position.lat.toString();
        params.lng = ls_position.lng.toString();

        delete params.myLocation;
        delete params.address;
      } else {
        // envia o endereço digitado
        params.reverseAddress = $scope.formatted_address;

        // envia o lat/lng do endereço digitado
        params.lat = $scope.formatted_address_location.lat.toString();
        params.lng = $scope.formatted_address_location.lng.toString();

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

      return console.warn(params);

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
      _changeLanguage();
    }

    $scope.setEnglishLanguage = function() {
      $translate.use('en');
      _changeLanguage();
    }

    // ativar botão
    function _changeLanguage() {
      var ls = localStorage.getItem('NG_TRANSLATE_LANG_KEY');

      if (ls === 'en') {
        $scope.isEnActive = !$scope.isEnActive;
        $scope.isBrActive = false;
      } else {
        $scope.isBrActive = !$scope.isBrActive;
        $scope.isEnActive = false;
      }
    }
    // ====

    // ====
    // Iniciando as funções
    $scope.$on('complaint_created', function() {
      var ls = LocalStorage.getItem('ANGRY_TX');

      $rootScope.complaint_email = ls.email;

      $('#modal-instructions').modal('show');
    });

    _changeLanguage();
    // ====

  });
