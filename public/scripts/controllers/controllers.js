var app = angular.module("Controllers", ["Factories"]);

app.controller("RoomController", function($scope, $routeParams,$rootScope, Room) {
  $scope.message = ''; // status message shows whether submission succeeded

  $scope.roomId = Number($routeParams.roomId);

  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io - RoomController';

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

app.controller("RoomListController", function($scope, $rootScope, Room) {
  $scope.message = ''; // status message shows whether submission succeeded

  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io - RoomListController';

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

app.controller("ReservationController", function($scope,$rootScope,Reservation) {
  $scope.message = ''; // status message shows whether submission succeeded

  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io - ReservationController';

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

app.controller("RoomAdminController", function($scope, $routeParams, $rootScope, Room) {
  $scope.message = ''; // status message shows whether submission succeeded

  $scope.roomId = Number($routeParams.roomId);

  // change window title (see <title ng-bind...> in index.html)
  $rootScope.pageTitle = 'Room.io - RoomAdminController';

  $scope.save = function() {
    $scope.message = 'Submitting item';
    console.log("RoomAdminController submit");
    var newitem = new Room();
    newitem.id = $scope.id;
    newitem.name = $scope.name;
    newitem.count = $scope.count;
    newitem.price = $scope.price;

    newitem.$save().then(
      function() { $scope.message = "Submitted successfully";},
      function(error) { $scope.message = "Submission error " + error.status + " " + error.statusText;},
    );
  }
});
