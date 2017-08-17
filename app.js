var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
var jwt = require("jsonwebtoken");
//var index = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
//app.use('/users', users);

//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});

//// error handler
//app.use(function(err, req, res, next) {
//  // set locals, only providing error in development
//  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//  // render the error page
//  res.status(err.status || 500);
//  res.render('error');
//});

var mongoose = require("mongoose");
var Room = require("./backend/models/roomSchema");
var Reservation = require("./backend/models/reservationSchema");
var User = require("./backend/models/userSchema");
mongoose.connect(config.database, {useMongoClient: true});

var rooms = [];
var counters = {room: 0, reservation: 0};

function getNewIdFor(name) {
  var c = counters[name];
  counters[name] = c + 1;
  return c;
}

function getAllRooms() {
  return rooms;
}

function getRoomById(id) {
  var r = getAllRooms();
  var l = r.length;
  for (var i = 0; i < l; i++) {
    if (id == r[i].id) {
      return r[i];
    }
  }
  // not found, error
  return false; // return what?
}

app.get("/api/rooms", function(req,res) {
  console.log("get all rooms");
  Room.find(function(err,items,count) {
    if (err) {
      console.log("Cannot find data: " + err);
      res.status(500);
      res.json();
    } else {
      res.json(items);
    }
  });
});

app.get("/api/rooms/:id", function(req,res) {
  var id = req.params.id;
  q = {};
  if (id.match(/^[0-9,a-f]{24}$/i)) {
    // id is am ObjectID
    q._id = id;
  } else {
    q.roomId = id;
  }

  Room.findOne(q, function(err,item) {
    if (err) {
      console.log("Cannot find on:" + err);
      res.status(404);
      res.json();
    } else {
      res.json(item);
    }
  });
});

app.post("/api/rooms", function(req,res) {
  console.log("Adding new room");

  var room = new Room({
    roomId: getNewIdFor('room'),
    name: req.body.name,
    description: req.body.description,
    capacity: req.body.capacity,
    floor: req.body.floor,
    building: req.body.building,
    site: req.body.site,
    type: req.body.type,
    features: req.body.features,
  });

  room.save(function(err,savedroom,count) {
    if (err) {
      console.log("Cannot save data: " + err);
      res.status(500);
      res.json();
    } else {
      res.status(201);
      res.json(savedroom);
    }
  });

});

app.put("/api/rooms/:id", function(req,res) {
  var id = req.params.id;
  console.log("Update info of room having id: " + id);
  console.log(" updated info: " + req.body)
  var updatedRoom = req.body;

  //var room = getRoomById(id);
  // ...
  console.log("get room with id " + id + " for update");
  Room.findOne({"roomId": id}, function(err,room) {
    if (err) {
      console.log("Cannot find on:" + err);
      res.status(404);
      res.json();
    } else {
      // TODO Update room with new information from request
      room.name = req.body.name;
      room.capacity = req.body.capacity;
      room.floor = req.body.floor;
      room.building = req.body.building;
      room.site = req.body.site;
      room.type = req.body.type;
      room.features = req.body.features;
      room.save(function(err,savedroom,count) {
        if (err) {
          console.log("Cannot save data: " + err);
          res.status(500);
          res.json();
        } else {
          res.status(200);
          res.json(savedroom);
        }
		  });
    }
  });
});

// -------------- Reservations --------------------

app.get("/api/reservations", function(req,res) {
  var roomid = req.query.room;
  var after = req.query.since;
  if (after) {
    after = new Date(after);
  }

  var query = Reservation.find();
  if (roomid) {
    query.where('room').equals(roomid);
  }
  if (after) {
    query.where('startTime').gte(after);
  }
  query.sort('startTime');
  query.exec(function(err,items,count) {
    if (err) {
      console.log("Cannot find data: " + err);
      res.status(500);
      res.json({message: err});
    } else {
      res.json(items);
    }
  });
});

app.get("/api/reservations/:id", function(req,res) {
  var id = req.params.id;
  console.log("get reservation with id " + id);
  Reservation.findOne({"_id": id}, function(err,item) {
    if (err) {
      console.log("Cannot find on:" + err);
      res.status(404);
      res.json({message: err});
    } else {
      res.json(item);
    }
  });
});

app.get("/api/reservations/room/:roomid", function(req,res) {
  var id = req.params.roomid;
  console.log("get reservations for room with id " + id);
  Reservation.find({"room": id}).sort('startTime').exec(function(err,items) {
    if (err) {
      console.log("Cannot find on:" + err);
      res.status(404);
      res.json({message: err});
    } else {
      res.json(items);
    }
  });

});

app.post("/api/reservations", function(req,res) {
  console.log("Adding new reservation");

  var reservation = new Reservation({
    room: req.body.room,
    description: req.body.description,
    startTime: req.body.startTime,
    lengthOfReservation: req.body.lengthOfReservation,
    //reserver: req.body.reserver,
    countOfCoffee: req.body.countOfCoffee
  });

  // TODO: check that new reservation doesn't overlap with existing reservations

  reservation.save(function(err,saved,count) {
    if (err) {
      console.log("Cannot save data: " + err);
      res.status(500);
      res.json({message: err});
    } else {
      res.status(201);
      res.json(saved);
    }
  });

});

app.put("/api/reservations/:id", function(req,res) {
  var id = req.params.id;
  console.log("Update info of reservation having id: " + id);
  var updated = req.body;

  console.log("get reservation with id " + id + " for update");
  reservation.findOne({"_id": id}, function(err,room) {
    if (err) {
      console.log("Cannot find on:" + err);
      res.status(404);
      res.json({message: err});
    } else {
      // TODO Update room with new information from request
      // TODO Allow changing room? Delete reservation and make new instead?
      reservation.room = req.body.room;
      reservation.description = req.body.description;
      // TODO if time changed, check new time doesn't overlap with existing
      // reservations
      reservation.startTime = req.body.startTime;
      reservation.lengthOfReservation = req.body.lengthOfReservation;
      // TODO if coffee order changes, inform catering
      reservation.countOfCoffee = req.body.countOfCoffee;

      reservation.save(function(err,saved,count) {
        if (err) {
          console.log("Cannot save data: " + err);
          res.status(500);
          res.json({message: err});
        } else {
          res.status(200);
          res.json(saved);
        }
      });
    }
  });
});

module.exports = app;

app.listen(3000);
