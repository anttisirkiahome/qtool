'use strict';

var qtoolControllers = angular.module('qtoolControllers', []);

qtoolControllers.controller('MainCtrl', function ($scope, Poller) {
		
});

qtoolControllers.controller('AdminCtrl', function ($scope, $window) {
	//init app status
	$scope.creatingNewPoll = false;
	$scope.currentTemplate = 'defaultTemplate';
	$scope.question = '';
	$scope.answers = [''];

	$scope.loginSubmit = function() {
		//FIXME temp solution
		$window.location.href ="#/admin";
	}

	// switch templates from menu clicks
	$scope.switchTemplate = function(template) {
		$scope.currentTemplate = template;
	}

	$scope.addAnswer = function() {
		if($scope.answers.length < 6) {
			$scope.answers.push('');	
		}
	}

	$scope.removeAnswer = function(index) {
		if($scope.answers.length > 1) {
			$scope.answers.splice($scope.answers.indexOf($scope.answers[index]), 1);
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
		var oldValue = $scope.answers[index];
		var newValue = $scope.answers[newIndex];

		$scope.answers[index] = newValue;
		$scope.answers[newIndex] = oldValue;

		
	}


});