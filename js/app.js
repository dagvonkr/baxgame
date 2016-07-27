var app = angular.module('baxGame', ['ui.router', 'firebase']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider){

	$urlRouterProvider.otherwise('/')

    $stateProvider

      .state('main', {
        url: '/',
        templateUrl: '/views/main.html',
        controller: 'mainCtrl'
      })

})