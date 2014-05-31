'use strict';

var qtoolServices = angular.module('qtoolServices', ['ngResource']);

qtoolServices.factory('Poller', function($http, $timeout) {
	
  	var data = { response: {}, calls: 0 };
  	var poller = function() {
    	$http.get('//localhost/qtool-api/api').then(function(r) {
    	console.log('polling')
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

qtoolServices.factory('Auth', function($resource) {
	return $resource('//localhost/qtool-api/api/auth/');

	console.log('auth');
});

