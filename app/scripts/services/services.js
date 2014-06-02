'use strict';

var qtoolServices = angular.module('qtoolServices', ['ngResource']);

qtoolServices.factory('Auth', function($resource) {
	return $resource('//localhost/qtool-api/api/auth/');
});

qtoolServices.service('AuthService', ['Auth', '$q', function(Auth, $q) {
	return {
		auth: function(user) {
			Auth.save(user);
		}
	}
}]);

