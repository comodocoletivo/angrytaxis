(function() {

  'use strict';

  function AboutCtrl() {
    var vm;

    // ====

    vm = this;

    vm.comeBack = _comeBack;

    // ====

    function _comeBack() {
      window.history.back();
    }
  }

  angular
  .module('angryTaxiApp')
  .controller('AboutCtrl', AboutCtrl);

})();
