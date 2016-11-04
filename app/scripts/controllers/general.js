(function() {

  'use strict';

  function GeneralCtrl($rootScope, requestApi, Notification, LocalStorage, $translate, $http) {

    var vm;

    // ====

    vm = this;
    vm.mobileMenuActive = false;
    vm.sobreActive = false;

    vm.toggleMobileMenu = _toggleMobileMenu;
    vm.toggleSobre = _toggleSobre;
    vm.autoComplete = _autoComplete;

    vm.complaint = {};
    vm.newComplaint = _newComplaint;

    vm.feedback = {};
    vm.submitFeedback = _submitFeedback;

    vm.setPortugueseLanguage = _ptBR;
    vm.setEnglishLanguage = _enUS;
    vm.changeLanguage = _changeLanguage;

    vm.listeners = _listeners;

    // ====

    // menu mobile
    function _toggleMobileMenu() {
      vm.mobileMenuActive = vm.mobileMenuActive === false ? true: false;
    }

    // menu sobre
    function _toggleSobre() {
      vm.sobreActive = vm.sobreActive === false ? true: false;
    }

    // Autocomplete do endereço
    function _autoComplete(address) {
      return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: address,
          sensor: false,
          language: 'pt-BR'
        }
      }).then(function(response) {
        return response.data.results.map(function(item){
          vm.formatted_address = item.formatted_address;
          vm.formatted_address_location = item.geometry.location;
          return item.formatted_address;
        });
      });
    }

    // cria uma denúncia
    function _newComplaint(args) {
      var params, ls_position;

      params = vm.complaint;

      ls_position = LocalStorage.getItem('ANGRY_TX_POS');

      if (params.date) {
        params.date = params.date.split('/')[2] + '/' + params.date.split('/')[1] + '/' + params.date.split('/')[0];
      }

      if (params.myLocation === true) {
        // envia o endereço de onde está o usuário
        params.reverseAddress = vm.full_address;

        // enviar o lat/lng do usuário
        params.lat = ls_position.lat;
        params.lng = ls_position.lng;

        delete params.myLocation;
        delete params.address;
      } else {
        // envia o endereço digitado
        params.reverseAddress = vm.formatted_address;

        // envia o lat/lng do endereço digitado
        params.lat = vm.formatted_address_location.lat;
        params.lng = vm.formatted_address_location.lng;

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
          $rootScope.$emit('complaint_created');
        } else {
          Notification.show('Atenção', 'Tivemos um problema para criar a sua denúncia. Por favor, tente novamente em instantes.');
        }
      });
    }

    // envia um feedback
    function _submitFeedback() {
      var params;

      params = vm.feedback;

      requestApi.sendFeedback(params, function(data) {
        if (data.status === 200) {
          Notification.show('Mensagem enviada', 'Obrigado pelo seu feedback.');
        } else {
          Notification.show('Atenção', 'Tivemos um problema no envio do feedback, tente novamente em alguns instantes.');
        }
      })
    }

    // internacionalização
    function _ptBR() {
      $translate.use('pt-BR');
      vm.changeLanguage();
    }

    function _enUS() {
      $translate.use('en');
      vm.changeLanguage();
    }

    function _changeLanguage() {
      var ls = localStorage.getItem('NG_TRANSLATE_LANG_KEY');

      if (ls === 'en') {
        vm.isEnActive = !vm.isEnActive;
        vm.isBrActive = false;
      } else {
        vm.isBrActive = !vm.isBrActive;
        vm.isEnActive = false;
      }
    }

    // listeners
    function _listeners() {
      // denúncia criada
      $rootScope.$on('complaint_created', function() {
        var ls;

        ls = LocalStorage.getItem('ANGRY_TX');

        $rootScope.complaint_email = ls.email;

        $('#modal-instructions').modal('show');
      });
    }

    // ====

    vm.listeners();

  }

  GeneralCtrl.$inject = [
    '$rootScope',
    'requestApi',
    'Notification',
    'LocalStorage',
    '$translate',
    '$http'
  ];

  angular
  .module('angryTaxiApp')
  .controller('GeneralCtrl', GeneralCtrl);

})();
