'use strict';

describe('Controller: ValidarCtrl', function () {

  // load the controller's module
  beforeEach(module('angryTaxiApp'));

  var ValidarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ValidarCtrl = $controller('ValidarCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ValidarCtrl.awesomeThings.length).toBe(3);
  });
});
