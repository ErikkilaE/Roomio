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
    if (angular.equals(features, {})) {
      featureArray.forEach(function(x) {
        features[x.id] = x.name;
      });
      return features;
    } else {
      // return cached values
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

app.factory("RoomTypes", function() {
  var factory = {};
  var typesArray = [
    { id: "MEETING",  name: "Meeting room" },
    { id: "CLASSROOM", name: "Class room" },
    { id: "AUDITORIUM", name: "Auditorium" }
  ];
  var types = { };

  factory.getRoomTypes = function () {
    if (angular.equals(types, {})) {
      typesArray.forEach(function(x) {
        types[x.id] = x.name;
      });
      return types;
    } else {
      // return cached values
      return types;
    }
  };

  factory.getRoomTypeArray = function () {
    return typesArray;
  };
  factory.addRoomType = function (id, name) {
    typesArray.push({id: id, name: name});
    types = {};
  };

  return factory;
});
