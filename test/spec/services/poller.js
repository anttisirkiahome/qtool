'use strict';

describe('Service: poller', function () {

  // load the service's module
  beforeEach(module('qtoolApp'));

  // instantiate service
  var poller;
  beforeEach(inject(function (_poller_) {
    poller = _poller_;
  }));

  it('should do something', function () {
    expect(!!poller).toBe(true);
  });

});
