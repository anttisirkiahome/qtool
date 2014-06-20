'use strict';

var qtoolControllers = angular.module('qtoolControllers', []);

qtoolControllers.controller('MainCtrl', function ($scope, Poller) {
		
});

qtoolControllers.controller('LoginCtrl', function ($scope, $rootScope, AuthService) {
	$scope.login = function(user) {
		AuthService.auth(user);
	}
});

qtoolControllers.controller('AdminCtrl', function ($scope, $window, AuthService, PollService) {
	console.log('hello, this is adminctrl')

	$scope.newPollAvailable = false;

	//this.auth();
	
	//init app status
	$scope.createStatus = {
		'creatingNewPoll': true
	}

	$scope.currentTemplate = 'defaultTemplate';
	$scope.showGenericError = false;
	$scope.newPollAvailable = false;
	$scope.genericError = 'Kyselyn luonti epäonnistu, yritä uudestaan hetken kuluttua.';
	var defaultPoll = {
		'question': '', 
		'duration': '01:30', 
		'answers': ['', ''], 
		'theme': 'default'
	};

	//use angular.copy so defaultPoll stays unaffected
	$scope.poll = angular.copy(defaultPoll); 

	var delta = 15;

	var source = new EventSource("//localhost/qtool-api/poller.php");
	$scope.pollStatus = {};

	$scope.$watch(source.on, function() {
		source.onmessage = function(event) {	
			
			if(angular.fromJson(event.data).j % 2 === 0) {
				$scope.newPollAvailable = true;
				/*PollService.getLatestPoll().then(function(data) {
					console.log('got this poll back ' , data);
				});*/
				
			} else {
				$scope.newPollAvailable = false;
			}

			$scope.$apply(); //this is important, so scope values are updated
		}
  	});

	var auth = function() {
		console.log('calling auth function');
		//AuthService.auth(user);
	}

	$scope.logout = function() {
		console.log('clicked logout')

		// call log out
		window.location = "#/login";
	}

	$scope.erasePoll = function() {
		$scope.poll = angular.copy(defaultPoll); 
	}

	// switch templates from menu clicks
	$scope.switchTemplate = function(template) {
		$scope.currentTemplate = template;
	}

	$scope.addAnswer = function(event) {
		event.preventDefault();
		if($scope.poll.answers.length < 6) {
			$scope.poll.answers.push('');	
		}
	}

	$scope.removeAnswer = function(index, event) {
		event.preventDefault();
		if($scope.poll.answers.length > 1) {
			$scope.poll.answers.splice($scope.poll.answers.indexOf($scope.poll.answers[index]), 1);
		}
	}

	$scope.togglePosition = function(direction, index, event) {
		event.preventDefault();
		var newIndex = 0;
		if(direction === 'down') {
			newIndex = index + 1;
		} else {
			newIndex = index - 1;
		}
		var oldValue = $scope.poll.answers[index];
		var newValue = $scope.poll.answers[newIndex];

		$scope.poll.answers[index] = newValue;
		$scope.poll.answers[newIndex] = oldValue;
	}

	$scope.createPoll = function() {
		$scope.showGenericError = false;
		console.log('poll to be sent : ' , $scope.poll)
		PollService.savePoll($scope.poll).then(function(data) {
			if(data.success) {
				$scope.poll = data.poll;
				$scope.switchTemplate('createdPoll');
			} else {
			 	$scope.showGenericError = true;
			}
		});
	}

	$scope.publishPoll = function() {
		console.log('publishing poll')

		//if success
		//$scope.switchTemplate('defaultTemplate');
	}

	$scope.changeTime = function(direction, event) {
		event.preventDefault();
		var diff = 0;

		if(direction == 'up') {
			diff = diff + delta; 
		} else if( direction == 'down') {
			diff = diff - delta;
		}

		var timeInSeconds = parseInt($scope.poll.duration.split(':')[1]) + parseInt($scope.poll.duration.split(':')[0]) * 60 + diff;
		var tempMinutes = parseInt(timeInSeconds / 60);
		var tempSeconds = timeInSeconds % 60;

		if(tempSeconds <= 0) {
			tempSeconds = 0;
		}

		$scope.poll.duration = tempMinutes * 60 + tempSeconds;
		
		// you could stringify the rest, but let's take an easy route.. 
		if(tempMinutes < 10) {
			tempMinutes = '0' + tempMinutes;
		}
		if(tempSeconds == 0) {
			tempSeconds = '0' + tempSeconds;
		}
		if(tempMinutes == 0 && tempSeconds == 0) {
			tempSeconds = delta;
		}
		
		$scope.poll.duration = tempMinutes + ':' + tempSeconds;
	}



});