'use strict';

var qtoolControllers = angular.module('qtoolControllers', []);

qtoolControllers.controller('MainCtrl', function ($scope, Poller) {
		
});

qtoolControllers.controller('AdminCtrl', function ($scope, $window) {
	//init app status
	$scope.creatingNewPoll = false;
	$scope.currentTemplate = 'defaultTemplate';

	$scope.loginSubmit = function() {
		//FIXME temp solution
		$window.location.href ="#/admin";
	}

	// switch templates from menu clicks
	$scope.switchTemplate = function(template) {
		$scope.currentTemplate = template;
	}

});