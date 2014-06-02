'use strict';

var qtoolControllers = angular.module('qtoolControllers', []);

qtoolControllers.controller('MainCtrl', function ($scope, Poller) {
		
});

qtoolControllers.controller('AdminCtrl', function ($scope, $window, AuthService) {
	AuthService.auth();
	//init app status
	$scope.creatingNewPoll = false;
	$scope.currentTemplate = 'defaultTemplate';
	$scope.poll = {'question': '', 'duration': 0, 'answers': ['', '']};
	$scope.duration = '01:30';
	var delta = 15;

	$scope.login = function() {
		console.log('clicked login')
		var user = {'username':$scope.user.username, 'password':$scope.user.password};
		AuthService.auth(user);
		window.location = "#/admin";
	}

	$scope.loginSubmit = function() {
		//FIXME temp solution
		$window.location.href ="#/admin";
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
		console.log('poll to be sent : ' , $scope.poll)
	}

	$scope.changeTime = function(direction, event) {
		event.preventDefault();
		var diff = 0;

		if(direction == 'up') {
			diff = diff + delta; 
		} else if( direction == 'down') {
			diff = diff - delta;
		}

		var timeInSeconds = parseInt($scope.duration.split(':')[1]) + parseInt($scope.duration.split(':')[0]) * 60 + diff;
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
		
		$scope.duration = tempMinutes + ':' + tempSeconds;
	}



});