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
		var oldValue = $scope.answers[index];
		var newValue = $scope.answers[(index -1)];

		$scope.answers[index] = newValue;
		$scope.answers[(index -1)] = oldValue;
	}

	$scope.moveAnswerDown = function(index) {
		var oldValue = $scope.answers[index];
		var newValue = $scope.answers[(index + 1)];

		$scope.answers[index] = newValue;
		$scope.answers[(index + 1)] = oldValue;
	}


});