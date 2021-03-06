var app = angular.module("Controllers", ["Factories"]);

app.controller("RoomController", function($scope, $routeParams,$rootScope, Room, Reservation, Features, RoomTypes) {
  $scope.message = ''; // status message shows whether submission succeeded

  $scope.roomId = $routeParams.roomId;

  $scope.reservations = {};

  $scope.getRoomById = function (id) {
    $scope.room = new Room();
    console.log("searching for item with ID " + id);
    $scope.room.$get({id: id}).then(
      function() {
        $scope.message = "Item room";
        $rootScope.pageTitle = 'Room.io! ' + $scope.room.name;
        $scope.getReservations($scope.room._id);
       },
      function(error) { $scope.message = "Query error: " + error.status + " " + error.statusText;}
    );
  };

  $scope.getReservations = function (roomid) {
    console.log("Look for reservations for room " + roomid);
    $scope.reservations = Reservation.query({"room": roomid, "populate": "room"});
  };

  // get associative array of features: id -> name
  $scope.featureOptions = Features.getFeatures();

  // get associative array of room types: id -> name
  $scope.roomTypeOptions = RoomTypes.getRoomTypes();

  $scope.getRoomById($scope.roomId);

  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io!';

  //$scope.getAllRooms = function() {
  //  console.log("Getting list of rooms");
  //  $scope.rooms = Room.query();
  //  return $scope.rooms;
  //}
  $scope.reservation = new Reservation();

  $scope.addReservation = function() {
    $scope.message = 'Submitting reservation';
    console.log("ReservationController submit reservation");
    var newReservation = new Reservation();
    newReservation.room = $scope.room._id;
    newReservation.startTime = $scope.reservation.startTime;
    newReservation.endTime = $scope.reservation.endTime;
    //newReservation.reserver = $scope.reservation.reserver.username;
    newReservation.description = $scope.reservation.description;
    newReservation.countOfCoffee = $scope.reservation.countOfCoffee;

    newReservation.$save().then(
      function() {
        $scope.message = "Reservation submitted successfully";
        $scope.getReservations($scope.room._id);  // refresh reservation list
      },
      function(error) { $scope.message = "Reservation submission error " + error.status + " " + error.statusText;}
    );
  };
});

app.controller("RoomListController", function($scope, $rootScope, Room, Features, RoomTypes) {
  $scope.message = ''; // status message shows whether submission succeeded

  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io! Available rooms';

  // get associative array of features: id -> name
  $scope.featureOptions = Features.getFeatures();

  // get associative array of room types: id -> name
  $scope.roomTypeOptions = RoomTypes.getRoomTypes();
  // get array of room type options for use with 'ng-options'
  $scope.roomTypeArray = RoomTypes.getRoomTypeArray();

  $scope.advFilter = {features: []};
  $scope.rooms = Room.query();

  $scope.getAllRooms = function() {
    console.log("Getting list of rooms");
    $scope.rooms = Room.query();
    return $scope.rooms;
  };

  $scope.filterByFeatures = function (room, index, allrooms) {
    var requiredFeatures = $scope.advFilter.features;
    var result = true;
    if (Array.isArray(requiredFeatures)) {
      result = requiredFeatures.every(function(element, index, array) {
        return room.features.includes(element);
      });
    }
    return result;
  };

  $scope.filterByParticipants = function (room, index, allrooms) {
    var minimum = $scope.advFilter.participants;
    var result = true;
    if (minimum) {
      // include rooms with capacity >= minumum
      result = room.capacity >= minimum;
    } else {
      // not defined -> include all rooms
      result = true;
    }
    return result;
  };

  $scope.floorDistance = function (room) {
    var floor = $scope.advFilter.floor;
    if (floor) {
      return Math.abs(room.floor - floor);
    } else {
      return 0;
    }
  };

  $scope.getRoomById = function (id) {
    $scope.item = new Room();
    $scope.item.id = id;
    console.log("searching for item with ID " + id);
    $scope.item.$get().then(
      function() { $scope.message = "Item found";},
      function(error) { $scope.message = "Query error: " + error.status + " " + error.statusText;}
    );
  };

});

app.controller("ReservationController", function($scope,$rootScope, $routeParams,Reservation) {
  $scope.message = ''; // status message shows whether submission succeeded

  $scope.reservationId = $routeParams.reservationId;

  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io! - ReservationController';

  $scope.getReservationById = function (id) {
    $scope.reservation = new Reservation();
    $scope.reservation.id = id;
    console.log("searching for reservation with ID " + id);
    $scope.reservation.$get().then(
      function() { $scope.message = "Reservation room loaded";},
      function(error) { $scope.message = "Query error: " + error.status + " " + error.statusText;}
    );
  };

  $scope.getReservationById($scope.reservationId);
});

app.controller("ReservationListController", function($scope,$rootScope,Reservation) {
  $scope.message = ''; // status message shows whether submission succeeded

  $scope.reservations = Reservation.query({"populate": "room"});
  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io! - ReservationListController';

});
app.controller("AddRoomController", function($scope, $routeParams, $rootScope, Room, Features, RoomTypes) {
  $scope.message = ''; // status message shows whether submission succeeded

  $scope.features = [];
  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io! Add room';

  $scope.room = new Room();

  // get associative array of feature options for use with 'ng-repeat + checklist-model'
  $scope.featureOptions = Features.getFeatures();

  // get array of room type options for use with 'ng-options'
  $scope.roomTypeOptions = RoomTypes.getRoomTypeArray();

  $scope.addRoom = function() {
    $scope.message = 'Submitting item';
    console.log("RoomAdminController submit");

    $scope.room.$save().then(
      function() { $scope.message = "Submitted successfully";},
      function(error) { $scope.message = "Submission error " + error.status + " " + error.statusText;}
    );
  };
});

app.controller("RoomAdminController", function($scope, $routeParams, $rootScope, Room, Features, RoomTypes) {
  $scope.message = ''; // status message shows whether submission succeeded

  $scope.roomId = $routeParams.roomId;

  // get associative array of feature options for use with 'ng-repeat + checklist-model'
  $scope.featureOptions = Features.getFeatures();

  // get array of room type options for use with 'ng-options'
  $scope.roomTypeOptions = RoomTypes.getRoomTypeArray();

  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io! Edit room details';

  $scope.getRoomById = function (id) {
    $scope.room = new Room();
    $scope.room.id = id;
    console.log("searching for item with ID " + id);
    $scope.room.$get().then(
      function() {
        $scope.message = "Got room";
        $rootScope.pageTitle = 'Room.io! ' + $scope.room.name + " - Edit room details";
      },
      function(error) { $scope.message = "Query error: " + error.status + " " + error.statusText;}
    );
  };

  $scope.getRoomById($scope.roomId);

  $scope.save = function() {
    $scope.message = 'Submitting item';
    console.log("RoomAdminController submit");

    $scope.room.$save().then(
      function() { $scope.message = "Updated successfully";},
      function(error) { $scope.message = "Submission error " + error.status + " " + error.statusText;}
    );
  };
  $scope.update = function() {
    $scope.message = 'Submitting item';
    console.log("RoomAdminController submit");

    $scope.room.$update({id: $scope.roomId}).then(
      function() { $scope.message = "Updated successfully";},
      function(error) { $scope.message = "Submission error " + error.status + " " + error.statusText;}
    );
  };

});

app.controller("LoginController", function($scope, $routeParams, $rootScope, $http, UserService, $location) {
  $scope.username = '';
  $scope.password = '';
  $scope.message = '';

  $scope.login = function () {
    console.log("try login with username/password:" + $scope.username + "/" + $scope.password);

    $http.post('/login', {username: $scope.username, password: $scope.password})
    .then(function loginSuccess(res) {

      if (res.status == 200) {
        // successfull login, user info in data
        user = res.data;
        console.log("login success, user: " + user);
        $scope.message = "login ok, username: " + user.username + ", password: " + user.password + ", admin? " + user.admin;
        UserService.userLoggedIn(user);
        $scope.reset();
        $location.path('/').replace();
      } else {
        console.log("what happened? status: " + res.status + ", data: " + res.data);
        $scope.message = "what happened? status: " + res.status + ", data: " + res.data;
      }
    }, function loginError(res) {
      //var errdata = res.data;
      console.log("login fail, status: " + res.status);
      $scope.message = "login fail, status: " + res.status;
    });
  };

  $scope.reset = function () {
    // reset login/register form
    $scope.username = '';
    $scope.password = '';
  };

  $scope.logout = function () {
    console.log("try logout");
    $http.post('/logout', {})
    .then(function logoutSuccess(res) {
      if (res.status == 200) {
        // successfull login, user info in data
        console.log("logout success");
        UserService.userLoggedOut();
        $location.path('/').replace();
      } else {
        console.log("what happened? status: " + res.status + ", data: " + res.data);
        $scope.message = "what happened? status: " + res.status + ", data: " + res.data;
      }
    }, function logoutError(res) {
      //var errdata = res.data;
      console.log("login fail, status: " + res.status);
      $scope.message = "login fail, status: " + res.status;
    });
  };

  $scope.register = function () {
    console.log("try register with username/password:" + $scope.username + "/" + $scope.password);

    $http.post('/register', {username: $scope.username, password: $scope.password})
    .then(function registerSuccess(res) {

      if (res.status == 200) {
        // successfull register, user info in data
        user = res.data;
        console.log("register success, user: " + user);
        $scope.message = "login ok, username: " + user.username + ", password: " + user.password + ", admin? " + user.admin;
        //UserService.userLoggedIn(user);
        $scope.reset();
        $location.path('/login').replace();
      } else {
        console.log("what happened? status: " + res.status + ", data: " + res.data);
        $scope.message = "what happened? status: " + res.status + ", data: " + res.data;
      }
    }, function registerError(res) {
      //var errdata = res.data;
      console.log("login fail, status: " + res.status);
      $scope.message = "login fail, status: " + res.status;
    });
  };


});

app.controller("HomeController", function($scope, $routeParams, $rootScope, UserService, Reservation) {
  $scope.isLoggedIn = function () {
    return UserService.isLogged;
  };
  $scope.user = UserService;
  $scope.message = 'home';
  $scope.reservations = {};
  if ($scope.isLoggedIn()) {
    $scope.reservations = Reservation.query({"reserver": $scope.user.id, "populate": "room"});
  }

});
