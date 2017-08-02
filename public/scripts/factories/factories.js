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
