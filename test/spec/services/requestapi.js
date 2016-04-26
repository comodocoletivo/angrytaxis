'use strict';

describe('Service: requestApi', function () {

  // load the service's module
  beforeEach(module('angryTaxiApp'));

  // instantiate service
  var requestApi;
  beforeEach(inject(function (_requestApi_) {
    requestApi = _requestApi_;
  }));

  it('should do something', function () {
    expect(!!requestApi).toBe(true);
  });

});
