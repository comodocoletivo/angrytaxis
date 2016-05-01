'use strict';

describe('Directive: angryMaps', function () {

  // load the directive's module
  beforeEach(module('angryTaxiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<angry-maps></angry-maps>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the angryMaps directive');
  }));
});
