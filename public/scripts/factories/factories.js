var app = angular.module("Factories",["ngResource"]);

app.factory("Room", function($resource) {
  return $resource("/api/rooms/:id", {id: "@id"}, {
    'update': {method: 'PUT'}
  });
});

app.factory("Reservation", function($resource) {
  return $resource("/api/reservations/:id", {id: "@id"}, {
    'update': {method: 'PUT'}
  });
});

app.factory("Features", function() {
  var factory = {};
  var featureArray = [
    { id: "PROJECTOR",  name: "Data projector" },
    { id: "BLACKBOARD", name: "Blackboard" },
    { id: "WHITEBOARD", name: "Whiteboard" },
    { id: "FLAPPY",     name: "Flappyboard" },
    { id: "VIDEOCONF",  name: "Video conference" }
  ];
  var features = { };

  factory.getFeatures = function () {
    if (angular.equals(features, {})) {
      featureArray.forEach(function(x) {
        features[x.id] = x.name;
      });
      return features;
    } else {
      // return cached values
      return features;
    }
  };

  factory.getFeaturesArray = function () {
    return featureArray;
  };
  factory.addFeature = function (id, name) {
    featureArray.push({id: id, name: name});
    features = {};
  };

  return factory;
});

app.factory("RoomTypes", function() {
  var factory = {};
  var typesArray = [
    { id: "MEETING",  name: "Meeting room" },
    { id: "CLASSROOM", name: "Class room" },
    { id: "AUDITORIUM", name: "Auditorium" }
  ];
  var types = { };

  factory.getRoomTypes = function () {
    if (angular.equals(types, {})) {
      typesArray.forEach(function(x) {
        types[x.id] = x.name;
      });
      return types;
    } else {
      // return cached values
      return types;
    }
  };

  factory.getRoomTypeArray = function () {
    return typesArray;
  };
  factory.addRoomType = function (id, name) {
    typesArray.push({id: id, name: name});
    types = {};
  };

  return factory;
});

app.factory("UserService", function($http) {
  var loginstate = {
    isLogged: false,
    username: null,
    id: null,
    isAdmin: false
  };

  loginstate.getUserInfo = function () {
    console.log("try get user info");

    $http.get('/api/me')
    .then(function (res) {
      if (res.status == 200) {
        // successfull login, user info in data
        var user = res.data;
        console.log("UserService: user is logged in: " + user);
        loginstate.userLoggedIn(user);
      } else {
        console.log("what happened? status: " + res.status + ", data: " + res.data);
      }
    }, function (res) {
      if (res.status == 401) {
        // not logged in
        console.log("UserService: user not logged in");
        if (loginstate.isLogged) {
          // clear login state
          loginstate.userLoggedOut();
        }
      }
      console.log("login fail, status: " + res.status);
    });
  };

  loginstate.userLoggedOut = function userLoggedOut() {
    loginstate.isLogged = false;
    loginstate.username = null;
    loginstate.name = null;
    loginstate.email = null;
    loginstate.id = null;
    loginstate.isAdmin = false;
  };

  loginstate.userLoggedIn = function userLoggedIn(user) {
    loginstate.isLogged = true;
    loginstate.username = user.username;
    loginstate.name = user.name ? user.name : user.username;
    loginstate.email = user.email;
    loginstate.id = user._id;
    loginstate.isAdmin = user.admin;
    console.log("User " + loginstate.username + " has logged in");
  };

  loginstate.getUserInfo();
  return loginstate;
});
