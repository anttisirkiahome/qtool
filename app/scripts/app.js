'use strict';

var qtoolApp = angular.module('qtoolApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'qtoolControllers',
    'qtoolServices',
    'angular.css.injector',
    'ngAnimate',
    'toaster'
  ]);

qtoolApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('errorInterceptor');

  if (!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {};
  }
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
}]);

qtoolApp.config(function ($routeProvider, $provide) {
    var rootUrl = $("#linkRoot").attr("href");
    $provide.constant('rootUrl', rootUrl);

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
       .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl'
      })
      .otherwise({
        redirectTo: '/login'
      });
});