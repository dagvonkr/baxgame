var app = angular.module('baxGame', ['ui.router', 'firebase', 'angular.filter']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider){

	$urlRouterProvider.otherwise('/')

    $stateProvider

      .state('main', {
        url: '/',
        templateUrl: '/views/main.html',
        controller: 'mainCtrl'
      })

      .state('info', {
        url: '/info',
        templateUrl: '/views/info.html',
        controller: 'mainCtrl'
      })

      .state('highscore', {
        url: '/highscore',
        templateUrl: '/views/highscore.html',
        controller: 'mainCtrl'
      })

})