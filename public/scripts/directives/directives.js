
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
      reservs: "=reservations"
    },
    templateUrl: 'templates/reservationlist.html'
  };
});
