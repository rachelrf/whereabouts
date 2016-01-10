angular.module('greenfield', [
  'greenfield.auth',
  'greenfield.event',
  'greenfield.friends',
  'greenfield.home',
  'ngRoute'])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/auth/auth.html',
      controller: 'AuthController'
    })
    .when('/auth', {
      templateUrl: 'app/auth/auth.html',
      controller: 'AuthController'
    })
    .when('/home', {
      templateUrl: 'app/home/home.html',
      controller: 'HomeController',
      authenticate: true
    })
    .when('/event', {
      templateUrl: 'app/event/event.html',
      controller: 'EventController',
      authenticate: true
    })
    .when('/friends', {
      templateUrl: 'app/friends/friends.html',
      controller: 'FriendsController',
      authenticate: true
    })
    .when('/logout', {
      templateUrl: 'app/auth/auth.html',
      controller: 'AuthController'
    })
    .otherwise( {
      templateUrl: 'app/auth/auth.html',
      controller: 'AuthController',
      authenticate: true
    });

})

.run(function () {

});
