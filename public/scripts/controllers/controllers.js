var app = angular.module("Controllers", ["Factories"]);

app.controller("RoomController", function($scope, $routeParams,$rootScope, Room, Reservation, Features, RoomTypes) {
  $scope.message = ''; // status message shows whether submission succeeded

  $scope.roomId = $routeParams.roomId;

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
  // get associative array of features: id -> name
  $scope.featureOptions = Features.getFeatures();

  // get associative array of room types: id -> name
  $scope.roomTypeOptions = RoomTypes.getRoomTypes();

  $scope.getRoomById($scope.roomId);

  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io - RoomController';

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
      function() { $scope.message = "Reservation submitted successfully";},
      function(error) { $scope.message = "Reservation submission error " + error.status + " " + error.statusText;},
    );
  }
});

app.controller("RoomListController", function($scope, $rootScope, Room, Features, RoomTypes) {
  $scope.message = ''; // status message shows whether submission succeeded

  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io - RoomListController';

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
  }

  $scope.filterByFeatures = function (room, index, allrooms) {
    var requiredFeatures = $scope.advFilter.features;
    var result = true;
    if (Array.isArray(requiredFeatures)) {
      result = requiredFeatures.every(function(element, index, array) {
        return room.features.includes(element);
      });
    }
    return result;
  }

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
    console.log("searching for item with ID " + id)
    $scope.item.$get().then(
      function() { $scope.message = "Item found";},
      function(error) { $scope.message = "Query error: " + error.status + " " + error.statusText;},
    );
  };

});

app.controller("ReservationController", function($scope,$rootScope, $routeParams,Reservation) {
  $scope.message = ''; // status message shows whether submission succeeded

  $scope.reservationId = $routeParams.reservationId;

  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io - ReservationController';

  $scope.getReservationById = function (id) {
    $scope.reservation = new Reservation();
    $scope.reservation.id = id;
    console.log("searching for reservation with ID " + id)
    $scope.reservation.$get({"populate": "room"}).then(
      function() { $scope.message = "Reservation room loaded";},
      function(error) { $scope.message = "Query error: " + error.status + " " + error.statusText;},
    );
  };

  $scope.getReservationById($scope.reservationId);
});

app.controller("ReservationListController", function($scope,$rootScope,Reservation) {
  $scope.message = ''; // status message shows whether submission succeeded

  $scope.reservations = Reservation.query({"populate": "room"});
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
app.controller("AddRoomController", function($scope, $routeParams, $rootScope, Room, Features, RoomTypes) {
  $scope.message = ''; // status message shows whether submission succeeded

  $scope.features = [];
  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io - RoomAdminController';

  // get associative array of feature options for use with 'ng-repeat + checklist-model'
  $scope.featureOptions = Features.getFeatures();

  // get array of room type options for use with 'ng-options'
  $scope.roomTypeOptions = RoomTypes.getRoomTypeArray();

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

app.controller("RoomAdminController", function($scope, $routeParams, $rootScope, Room, Features, RoomTypes) {
  $scope.message = ''; // status message shows whether submission succeeded

  $scope.roomId = $routeParams.roomId;

  // get associative array of feature options for use with 'ng-repeat + checklist-model'
  $scope.featureOptions = Features.getFeatures();

  // get array of room type options for use with 'ng-options'
  $scope.roomTypeOptions = RoomTypes.getRoomTypeArray();

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
