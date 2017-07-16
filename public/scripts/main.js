var app = angular.module("RoomioApp",["ngRoute","Controllers"]);

app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/rooms' , {
        templateUrl: 'views/roomlist.html',
        controller: 'RoomListController'
      }).
      when('/room/:roomId', {
        templateUrl: 'views/room.html',
        controller:  'RoomController'
      }).
      when('/addroom', {
        templateUrl: 'views/addroom.html',
        controller:  'AddRoomController'
      }).
      when('/editroom/:roomId', {
        templateUrl: 'views/editroom.html',
        controller:  'RoomAdminController'
      }).
      when('/reservation' , {
        templateUrl: 'views/reservation.html',
        controller: 'ReservationController'
      }).
      otherwise({
        redirectTo: '/'
      });
    }
]);
