'use strict';

var qtoolServices = angular.module('qtoolServices', ['ngResource']);

// NOTE using factories / services hand in hand like this might not be best practice

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
				// TODO any other ways than using $rootscope to broadcast?
		}
	}
}]);

qtoolServices.factory('Poll', ['$resource', function($resource) {
	return $resource('//localhost/qtool-api/api/poll', {q: '@poll'}, {
		query: {isArray: false}, 
		update: {method:'PUT', params: {updateId: '@id', type:'@vote'}}
	});
}]);

qtoolServices.service('PollService', ['Poll', '$q', 'cssInjector', '$cookieStore',  function(Poll, $q, cssInjector, $cookieStore) {
	return {
		changeTheme: function(themeUrl) {
			cssInjector.removeAll(); 
			cssInjector.add(themeUrl);
		},
		savePoll: function(poll) {
			var d = $q.defer();
			var result = Poll.save({q:poll}, function() {
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

					// TODO why do we need to use angular.fromJson here?
					// this works, but...
					var receivedData = angular.fromJson(event.data).newPoll;

					if(receivedData.success && !receivedData.expired) {
						$scope.publishedPollAvailable = true; //this boolean is for the views ng-show
						$scope.livePoll = receivedData;

						// Handle if the user has already voted
						if($cookieStore.get('votes').indexOf(receivedData.ID) !== -1) {
							$scope.hasVoted = true; //person has already voted for this poll ID
						}  else {
							$scope.hasVoted = false;
						}
					} else {
						$scope.publishedPollAvailable = false;
					}
					$scope.$apply(); // is this a best practice? ... are there other ways?
				}
			});
			/* $scope.$watch(source.on, function() {
				source.onmessage = function(event) {

					$scope.newPollAvailable = false;
					$scope.unpublishedPollAvailable = false;
					
					var receivedData = angular.fromJson(event.data).newPoll;
					if(receivedData.success) {
						if(!receivedData.expired) {
							
							// Handle if the user has already voted
							if($cookieStore.get('votes').indexOf(receivedData.ID) !== -1) {
								$scope.hasVoted = true; //person has already voted for this poll ID
							}  else {
								$scope.hasVoted = false;
							}

							//console.log('new published poll available', receivedData)

							$scope.newPollAvailable = true;
							$scope.latestPoll = receivedData;

							for (var i = 0; i < $scope.latestPoll.answers.length; i++) {
								if($scope.latestPoll.totalVotes > 0 && $scope.latestPoll.answers[i].votes > 0) {
									$scope.latestPoll.answers[i]['barWidth'] = ($scope.latestPoll.answers[i].votes / $scope.latestPoll.totalVotes) * 100;	
								} else {
									$scope.latestPoll.answers[i]['barWidth'] = 0;
								}
							}
							
							

						} else if (receivedData.expired) {
						
							console.log('new unpoblished poll is available', receivedData)	
							$scope.unpublishedPollAvailable = true;
							//$scope.latestPoll = receivedData;
							$scope.unpublishedPoll = receivedData;
							
						}
						cssInjector.add(receivedData.theme);

					} else {
					//	console.log('no unpublished polls available')
						
					}
					
					$scope.$apply(); //this is important, so scope values are updated
				}

		  	});  */
		}
	}
}]);
