'use strict';

var qtoolControllers = angular.module('qtoolControllers', []);

qtoolControllers.controller('MainCtrl', function ($scope, Poller) {
		$scope.data = Poller.data;
});