'use strict';

var qtoolServices = angular.module('qtoolServices', ['ngResource']);

qtoolServices.factory('Auth', function($resource) {
	return $resource('//localhost/qtool-api/api/auth/', {}, {
		query: {isArray: false}
	});
});

qtoolServices.factory('Themes', function($resource) {
	console.log('this is themes factory')
	return $resource('//localhost/qtool-api/api/poll/themes/', {}, {
		query: {isArray: true}
	});
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
	return $resource('//localhost/qtool-api/api/poll', {q: '@poll'}, {
		query: {isArray: false}, 
		update: {method:'PUT', params: {updateId: '@id', type:'@vote'}}
	});
}]);

qtoolServices.service('PollService', ['Poll', '$q', 'cssInjector', function(Poll, $q, cssInjector) {
	return {
		savePoll: function(poll) {
			var d = $q.defer();
			console.log('pollservice, im sending this poll: ' , poll);
			var result = Poll.save({q:poll}, function() {
				d.resolve(result);
			});
			return d.promise;
		},
		publishPoll: function(id, duration) {
			var d = $q.defer();
			console.log('pollservice, im updating this poll: ' , id, duration);
			var result = Poll.update({updateId:id, duration:duration}, function() {
				console.log('updated this' , d.resolve(result))
				d.resolve(result);

			});
			return d.promise;
		},
		vote: function(id) {
			var d = $q.defer();
			var result = Poll.update({updateId:id, type: 'vote'}, function() {
				console.log('updated this' , d.resolve(result))
				d.resolve(result);
			});
			return d.promise;
		},
		getLatestPoll: function($scope, source) {
			$scope.$watch(source.on, function() {
				source.onmessage = function(event) {
					$scope.newPollAvailable = false;
					$scope.unpublishedPollAvailable = false;
			
					//console.log('response ' , event.data)
					var receivedData = angular.fromJson(event.data).newPoll;
					if(receivedData.success) {
						if(!receivedData.expired) {
							console.log('new published poll available', receivedData)

							$scope.newPollAvailable = true;
							$scope.latestPoll = receivedData;

							for (var i = 0; i < $scope.latestPoll.answers.length; i++) {
								if($scope.latestPoll.totalVotes > 0 && $scope.latestPoll.answers[i].votes > 0) {
									$scope.latestPoll.answers[i]['barWidth'] = ($scope.latestPoll.answers[i].votes / $scope.latestPoll.totalVotes) * 100;	
								} else {
									$scope.latestPoll.answers[i]['barWidth'] = 0;
								}
							}
		
							cssInjector.add(receivedData.theme);

						} else if (receivedData.expired) {
							console.log('new poll is available', receivedData)	
							$scope.unpublishedPollAvailable = true;
							$scope.latestPoll = receivedData;
							
						}
						

					} else {
					//	console.log('no unpublished polls available')
						
					}
					
					$scope.$apply(); //this is important, so scope values are updated
				}

		  	});  
		}
	}
}]);
