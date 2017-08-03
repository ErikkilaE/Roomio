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
mongoose.connect(config.database);

var rooms = [];
var reservations = [];
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

function getAllReservations() {
    return reservations;
}

function getReservationById(id) {
    var r = getAllReservations();
    var l = r.length;
    for (var i = 0; i < l; i++) {
	if (id == r[i].id) {
	    return r[i];
	}
    }
    // not found, error
    return false; // return what?
}

function getReservationsByRoom(roomid) {
    var r = getAllReservations();
    var l = r.length;
    for (var i = 0; i < l; i++) {
      if (roomid == r[i].room) {
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
    console.log("get room with id " + id);
    Room.findOne({"roomId": id}, function(err,item) {
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
        // TODO save updated info to DB
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
    	}
		});
});

app.get("/api/reservations", function(req,res) {
    console.log("get all reservations");
    var reservations = getAllReservations();
    res.json(reservations);
});


app.get("/api/reservations/:id", function(req,res) {
    var id = req.params.id;
    console.log("get reservation with id " + id);
    var reservation = getReservationById(id);

    // TODO


    // Item found
    if (reservation) {
	     // Response: one reservation
       res.json(reservation);
    } else {
      // Item not found, return HTTP error code 404
      res.status(404);
      res.json();
    }
});

app.get("/api/reservations/room/:roomid", function(req,res) {
    var id = req.params.roomid;
    console.log("get reservations for room with id " + id);
    var reservations = getReservationsByRoom(id);

    // TODO error if room not found
    // Response: array of reservations
    // reservations found
    res.json(reservations);
});

app.post("/api/reservations", function(req,res) {
    console.log("Adding new reservation");
    var reservation = {};
    reservation = req.body;
    // TODO
    //reservation.id = req.body.id; // Id autogenerated from by DB?
    //reservation.name = req.body.name;
    reservation.id = getNewIdFor('reservation');
    // ...

    // TODO check that reservation doesn't overlap with other reservations

    // TODO save new reservation to DB
    reservations.push(reservation);
    // TODO get new reservation from DB with filled in default or autogenerated IDs
    //      (reservationID), etc.
    res.json(reservation);
    // TODO If adding to DB fails, send HTTP error message (4xx / 5xx)
});

app.put("/api/reservations/:id", function(req,res) {
    var id = req.params.id;
    console.log("Update info of reservation having id: " + id);

    var reservation = getReservationById(id);
    // TODO Update room with new information from request
    //reserve.name = req.body.name;
    // ...

    // TODO check for overlapping reservations

    // TODO get new room from DB with filled in default or autogenerated IDs
    //      (roomID), etc.
    res.json(reservation);
    // TODO If adding to DB fails, send HTTP error message (4xx / 5xx)
});


module.exports = app;

app.listen(3000);
