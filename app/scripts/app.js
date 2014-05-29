'use strict';

var qtoolApp = angular.module('qtoolApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'qtoolControllers',
    'qtoolServices'
  ]);
  
qtoolApp.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AdminCtrl'
      })
       .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
}).run(function(Poller) {});
