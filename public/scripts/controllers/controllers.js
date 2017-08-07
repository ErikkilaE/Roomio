var app = angular.module("Controllers", ["Factories"]);

app.controller("RoomController", function($scope, $routeParams,$rootScope, Room) {
  $scope.message = ''; // status message shows whether submission succeeded

  $scope.roomId = Number($routeParams.roomId);

  $scope.getRoomById = function (id) {
    $scope.room = new Room();
    console.log("searching for item with ID " + id)
    $scope.room.$get({id: id}).then(
      function() {
        $scope.message = "Item room";
        $rootScope.pageTitle = 'Room.io - Room: ' + $scope.room.name; },
      function(error) { $scope.message = "Query error: " + error.status + " " + error.statusText;},
    );
  };

  $scope.getRoomById($scope.roomId);

  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io - RoomController';

  //$scope.getAllRooms = function() {
  //  console.log("Getting list of rooms");
  //  $scope.rooms = Room.query();
  //  return $scope.rooms;
  //}


});

app.controller("RoomListController", function($scope, $rootScope, Room) {
  $scope.message = ''; // status message shows whether submission succeeded

  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io - RoomListController';

  $scope.rooms = Room.query();

  $scope.getAllRooms = function() {
    console.log("Getting list of rooms");
    $scope.rooms = Room.query();
    return $scope.rooms;
  }

  $scope.getRoomById = function (id) {
    $scope.item = new Room();
    $scope.item.id = id;
    console.log("searching for item with ID " + id)
    $scope.item.$get().then(
      function() { $scope.message = "Item found";},
      function(error) { $scope.message = "Query error: " + error.status + " " + error.statusText;},
    );
  };

});

app.controller("ReservationController", function($scope,$rootScope, $routeParams,Reservation) {
  $scope.message = ''; // status message shows whether submission succeeded

  $scope.reservationId = Number($routeParams.reservationId);

  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io - ReservationController';

  $scope.getReservationById = function (id) {
    $scope.reservation = new Reservation();
    $scope.reservation.id = id;
    console.log("searching for reservation with ID " + id)
    $scope.reservation.$get().then(
      function() { $scope.message = "Reservation room";},
      function(error) { $scope.message = "Query error: " + error.status + " " + error.statusText;},
    );
  };

  $scope.getReservationById($scope.reservationId);


});

app.controller("ReservationListController", function($scope,$rootScope,Reservation) {
  $scope.message = ''; // status message shows whether submission succeeded

  $scope.reservations = Reservation.query();
  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io - ReservationListController';

  $scope.getItems = function() {
    console.log("Getting list of reservations");
    $scope.reservations = Reservation.query().then(
      function() { $scope.message = "Loaded successfully";},
      function(error) { $scope.message = "Query error error " + error.status + " " + error.statusText;},
    );;
    return $scope.items;
  }
  //$scope.getItems();

});
app.controller("AddRoomController", function($scope, $routeParams, $rootScope, Room) {
  $scope.message = ''; // status message shows whether submission succeeded

  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io - RoomAdminController';

  $scope.addRoom = function() {
    $scope.message = 'Submitting item';
    console.log("RoomAdminController submit");
    var newroom = new Room();
    newroom.name = $scope.name;
    newroom.capacity = $scope.capacity;
    newroom.floor = $scope.floor;
    newroom.building = $scope.building;
    newroom.site = $scope.site;
    newroom.type = $scope.type;
    newroom.features = $scope.features;

    newroom.$save().then(
      function() { $scope.message = "Submitted successfully";},
      function(error) { $scope.message = "Submission error " + error.status + " " + error.statusText;},
    );
  }
});

app.controller("RoomAdminController", function($scope, $routeParams, $rootScope, Room) {
  $scope.message = ''; // status message shows whether submission succeeded

  $scope.roomId = Number($routeParams.roomId);

  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io - RoomAdminController';

  $scope.getRoomById = function (id) {
    $scope.room = new Room();
    $scope.room.id = id;
    console.log("searching for item with ID " + id)
    $scope.room.$get().then(
      function() { $scope.message = "Got room";},
      function(error) { $scope.message = "Query error: " + error.status + " " + error.statusText;},
    );
  };

  $scope.getRoomById($scope.roomId);

  $scope.save = function() {
    $scope.message = 'Submitting item';
    console.log("RoomAdminController submit");

    $scope.room.$save().then(
      function() { $scope.message = "Updated successfully";},
      function(error) { $scope.message = "Submission error " + error.status + " " + error.statusText;},
    );
  }
  $scope.update = function() {
    $scope.message = 'Submitting item';
    console.log("RoomAdminController submit");

    $scope.room.$update({id: $scope.roomId}).then(
      function() { $scope.message = "Updated successfully";},
      function(error) { $scope.message = "Submission error " + error.status + " " + error.statusText;},
    );
  }

});
