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

qtoolApp.factory('errorInterceptor', ['$q', '$rootScope', '$location',
    function ($q, $rootScope, $location) {
        console.log('inside errorInterceptor')
        return {
            request: function (config) {
                return config || $q.when(config);
            },
            requestError: function(request){
                return $q.reject(request);
            },
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (response && response.status === 404) {
                }
                if (response && response.status >= 500) {
                }
                if (response && response.status === 401) {
                    console.log('got unauthorized , redirecting')
                    window.location = '#/login';
                }
                return $q.reject(response);
            }
        };
}]);

qtoolApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('errorInterceptor');
 /* $httpProvider.interceptors.push(['$q', function($q) {
    console.log('interceptor')
    return function(promise) {
      console.log('interceptor promise ' , promise)
      return promise.then(function(response) {
        //response.data.extra = 'Interceptor strikes back';
        return response;

      }, function(response) {
        console.log('response status ' , response)
        if (response.status === 401) {
          window.location = '#/login';
          return response;
        }
        return $q.reject(response);
      });
    }
  }]); */
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
        $rootScope.serverRoot = '//localhost';
        //$rootScope.serverRoot = 'http://185.20.139.103';
    }
]);