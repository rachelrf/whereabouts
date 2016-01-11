angular.module('greenfield.services', [])
// Simplifies interaction with browser's local storage
.factory('localStorage', function($window) {
  var get = function(key) {
    return $window.localStorage.getItem(key);
  };

  var set = function(key, value) {
    return $window.localStorage.setItem(key, value);
  };

  var remove = function(key) {
    return $window.localStorage.removeItem(key);
  };

  return {
    get: get,
    set: set,
    remove: remove
  };
})
// Simplifies interaction with $http
.factory('HTTP', function($http) {
  var sendRequest = function(method, url, data) {
    var options = {
      method: method,
      url: url
    };
    if (data) {
      options.data = data;
    }
    return $http(options);
  };

  return {
    sendRequest: sendRequest
  };
})
.factory('Friends', function ($http) {

  var modifyFriend = function (user, friend, action) {
    console.log('post request to add friend', friend)
    data = {
      friend: friend,
      action: action
    }
    return $http({
      method: 'POST',
      url: '/users/' + user.name + '/friends',
      data: data
    })
    .then(function (resp) {
      return resp;
    });
  };

  var getAllFriends = function (input) {

    return $http({
      method: 'GET',
      url: '/users/' + input + '/friends',
    })
    .then(function (resp) {
      return resp;
    });
  };

  var getAllUsers = function (input) {

    return $http({
      method: 'GET',
      url: '/users',
    })
    .then(function (resp) {
      return resp;
    });
  };

  return { 
    modifyFriend: modifyFriend,
    getAllFriends: getAllFriends,
    getAllUsers: getAllUsers
  };
})
// Provides Facebook authentication-related functionality
.factory('Facebook', function() {
  // Initializes Facebook api caller (boilerplate code provided directly by Facebook)
  var initialize = function() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '993093684087607',
        xfbml      : true,
        version    : 'v2.5'
      });
    };

    (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  };

  var login = function(successCallback) {
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        console.log('---already logged in to facebook:', response);
        successCallback(response);
      }
      else {
        console.log('---attempting facebook login...');
        FB.login(function(response) {
          if (response.status === 'connected') {
            console.log('---successful facebook login:', response);
            successCallback(response);
          } else {
            console.log('---failed facebook login:', response);
          }
        });
      }
    });
  };

  var logout = function(successCallback) {
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        console.log('---attempting facebook logout...');
        FB.logout(function(response) {
          if (response.status === 'unknown') {
            console.log('---successful facebook logout:', response);
            successCallback(response);
          } else {
            console.log('---failed facebook logout:', response);
          }
        });
      } else {
        console.log('---already logged out of facebook:', response);
      }
    });
  };

  var getUserData = function(successCallback) {
    FB.api('/me', function(response) {
      //console.log('user info:', response);
      successCallback(response);
    });
  };

  // This code does not work, due to Facebook tightening access to friend lists
  // var getFriendLists = function(authResponse) {
  //   FB.api('/me/friends', function(response) {
  //     console.log("friend list:", response);
  //   });
  // };

  initialize(); // this is probably asynchronous and should be handled more appropriately

  return {
    login: login,
    logout: logout,
    getUserData: getUserData
  };
})
.factory('Auth', function($location, Facebook, HTTP, localStorage) {
  var login = function(data) {
    if (isAuth()) {
      console.log('already logged into app');
      $location.path('/home');
    } else {
      console.log('attempting app login...');
      Facebook.login(function(loginResponse) {
        Facebook.getUserData(function(userDataResponse) {
          var data = {
            accessToken: loginResponse.authResponse.accessToken,
            userName: userDataResponse.name
          };
          return HTTP.sendRequest('POST', '/auth', data)
          .then(function(response) {
            var token = response.data.token;
            if (token) {
              console.log('successful app login:', token);
              localStorage.set('flannel.token', token);
              $location.path('/home');
            } else {
              console.log('failed app login');
            }
            return response;
          });
        });
      });
    }
  };

  var logout = function() {
    if (isAuth()) {
      localStorage.remove('flannel.token');
      $location.path('/auth');
      Facebook.logout(function() {});
      console.log('logged out of app');
    } else {
      console.log('already logged out of app');
    }
  };

  var isAuth = function() {
    return !!localStorage.get('flannel.token');
  }

  return {
    login: login,
    logout: logout,
    isAuth: isAuth
  };
});