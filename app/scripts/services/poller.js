'use strict';

var qtoolServices = angular.module('qtoolServices', ['ngResource']);

qtoolServices.factory('Poller', function($http, $timeout) {
  var data = { response: {}, calls: 0 };
  var poller = function() {
    $http.get('//localhost/qtool-backend/api.php').then(function(r) {
      data.response = r.data;
      data.calls++;
      $timeout(poller, 1000);
    });
    
  };
  poller();
  
  return {
    data: data
  };
});
