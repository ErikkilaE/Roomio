var app = angular.module("RoomioApp",["ngRoute","Controllers","checklist-model"]);

app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'views/login.html'
      }).
      when('/logout', {
        templateUrl: 'views/logout.html'
      }).
      when('/register', {
        templateUrl: 'views/register.html'
      }).
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
      when('/reservation/:reservationId' , {
        templateUrl: 'views/reservation.html',
        controller: 'ReservationController'
      }).
      when('/reservations' , {
        templateUrl: 'views/reservationlist.html',
        controller: 'ReservationListController'
      }).
      when('/', {
        templateUrl: 'views/login.html'
      }).
      otherwise({
        redirectTo: '/'
      });
    }
]);
