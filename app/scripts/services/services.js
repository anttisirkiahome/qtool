'use strict';

var qtoolServices = angular.module('qtoolServices', ['ngResource']);

qtoolServices.factory('Auth', function($resource) {
	return $resource('//localhost/qtool-api/api/auth/');
});

qtoolServices.service('AuthService', ['Auth', '$q', function(Auth, $q) {
	return {
		auth: function(user) {
			console.log('authing', user);
			Auth.save(user);
				// .. if logged id broadcast true
				// else broadcast false	
		}
	}
}]);

qtoolServices.factory('Poll', ['$resource', function($resource) {
	return $resource('//localhost/qtool-api/api/poll', {q: '@poll'}, {'query': {isArray: false}});
}]);

qtoolServices.service('PollService', ['Poll', '$q', function(Poll, $q) {
	return {
		savePoll: function(poll) {
			var d = $q.defer();
			console.log('pollservice, im sending this poll: ' , poll);
			var result = Poll.save({q:poll}, function() {
				d.resolve(result);
			});
			return d.promise;
		},
		getLatestPoll: function() {
			var d = $q.defer();
			var result = Poll.query({}, function() {
				d.resolve(result);
			});
			return d.promise;
		}
	}
}]);
