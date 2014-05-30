'use strict';

var qtoolControllers = angular.module('qtoolControllers', []);

qtoolControllers.controller('MainCtrl', function ($scope, Poller) {
		
});

qtoolControllers.controller('AdminCtrl', function ($scope, $window) {
	//init app status
	$scope.creatingNewPoll = false;
	$scope.currentTemplate = 'defaultTemplate';
	$scope.poll = {'question': '', 'answers': ['', '']};

	$scope.loginSubmit = function() {
		//FIXME temp solution
		$window.location.href ="#/admin";
	}

	// switch templates from menu clicks
	$scope.switchTemplate = function(template) {
		$scope.currentTemplate = template;
	}

	$scope.addAnswer = function() {
		if($scope.poll.answers.length < 6) {
			$scope.poll.answers.push('');	
		}
	}

	$scope.removeAnswer = function(index) {
		if($scope.poll.answers.length > 1) {
			$scope.poll.answers.splice($scope.poll.answers.indexOf($scope.poll.answers[index]), 1);
		}
	}

	$scope.moveAnswerUp = function(index) {
		togglePosition(index, 'down');
	}

	$scope.moveAnswerDown = function(index) {
		togglePosition(index, 'up');
	}

	var togglePosition = function(index, direction) {
		var newIndex = 0;
		if(direction === 'up') {
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


});