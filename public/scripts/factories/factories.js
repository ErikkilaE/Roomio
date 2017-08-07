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
    if (features == {}) {
      // return cached values
      return features;
    } else {
      featureArray.forEach(function(x) {
        features[x.id] = x.name;
      });
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
