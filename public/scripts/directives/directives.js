
app.directive("appheader", function() {
  return {
    restrict: "AC",
    templateUrl: 'templates/header.html'
  };
});

app.directive("reservationList", function () {
  return {
    restrict: "AE",
    scope: {
      reservs: "=reservations", // list of reservations
      omitroom: '@', // omit room field from list
      omituser: '@'  // omit reserver field from list
    },
    templateUrl: 'templates/reservationlist.html'
  };
});
