'use strict';

var qtoolApp = angular.module('qtoolApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'qtoolControllers',
    'qtoolServices',
    'angular.css.injector'
  ]);

qtoolApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.responseInterceptors.push(['$q', function($q) {
    return function(promise) {
      return promise.then(function(response) {
        response.data.extra = 'Interceptor strikes back';
        return response; 

      }, function(response) {
        if (response.status === 401) {
          window.location = '#/login';
          return response;
        }
        return $q.reject(response);
      });
    }
  }]);
  if (!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {};
  }
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
  $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
}]);

qtoolApp.config(function ($routeProvider) {
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

qtoolApp.run(['$rootScope',
    function($rootScope) {
        //$rootScope.serverRoot = '//localhost';
        $rootScope.serverRoot = 'http://185.20.139.103';
        
    }
]);