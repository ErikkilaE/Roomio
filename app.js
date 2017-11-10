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
var simplifyString = require("simplify-string");
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var session	= require("express-session");
var mongoStore = require("connect-mongo")(session);

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

var mongoose = require("mongoose");
var Room = require("./backend/models/roomSchema");
var Reservation = require("./backend/models/reservationSchema");
var User = require("./backend/models/userSchema");
mongoose.connect(config.database, {useMongoClient: true});

// -------------------- User authentication and session handling --------------------

app.use(session({
	secret:             config.secret,
	saveUninitialized:  config.saveUninitialized,
	resave:             config.resave,
	cookie:             config.cookie,
	store:              new mongoStore({
                            collection: config.storeCollection,
                            url:        config.storeUrl,
                            ttl:        config.storeTtl})
}));

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
		console.log("next");
		return next();
	}
    res.sendStatus(401);
}

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log("serialize user:" + JSON.stringify(user));
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  console.log("deserialize user:" + _id);
  User.findById(_id, function(err, user) {
    if(err) {
      console.error('There was an error accessing the records of' +
      ' user with id: ' + _id);
      return console.log(err.message);
    }
    return done(null, user);
  });
});

passport.use(new LocalStrategy({
        usernameField: "username",
        passwordField: "password"
    },
    function(username, password, done) {
        User.findOne({ username: username, password: password }, function(err, user) {
            if (err) {
                return done(err);
            }
            /*if (!user) {
                return done(null, false, { message: 'Incorrect username!' });
            }
            if (!password)) {
                return done(null, false, { message: 'Incorrect password!' });
            }*/
            return done(null, user);
        });
  }
));

// app.post('/login-old',
//   passport.authenticate('local', { successRedirect: '/',
//                                    failureRedirect: '/#login' /*,
//                                    failureFlash: true*/ })
// );

app.post('/login', passport.authenticate('local'), function (req, res) {
    console.log("login request:" + req + ", response: " + res);
    req.user.password = undefined; // remove password from user info
    res.json(req.user);
  });

app.post("/logout", function(req,res) {
	console.log("logout");
	if(req.session) {
    req.logout();
		//req.session.destroy();
		res.status(200).send({"Message":"Success"});
	} else {
		res.status(404).send({"Message":"Failure"});
	}
});

app.post("/register", function(req,res) {
	console.log("register");
	console.log(req.body);
	var temp = new User({
		"username":req.body.username,
		"password":req.body.password,
	});

	temp.save(function(err,item){
		if (err) {
			console.log(err);
			res.status(409);
			res.json({"Message":"Failure"});
		} else {
			res.json({"username":item.username,"id":item._id});
		}
	});
});

app.use("/api", isLoggedIn, function(req,res,next) {
	next();
});

app.get("/api/me", function(req, res) {
  console.log("get info on current user");
  req.user.password = undefined; // remove password from user info
  res.json(req.user);
});

// -------------------- API to handle Rooms --------------------

// generate simplified ID for a room from room information.
function getNewIdForRoom(room) {
  var newname = simplifyString(room.name); // just simplify room name
  return newname;
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

function isObjectId(str) {
  return str ? str.match(/^[0-9,a-f]{24}$/i) : false;
}

app.get("/api/rooms/:id", function(req,res) {
  var id = req.params.id;
  q = {};
  if (isObjectId(id)) {
    // id is an ObjectID
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
    name: req.body.name,
    description: req.body.description,
    capacity: req.body.capacity,
    floor: req.body.floor,
    building: req.body.building,
    site: req.body.site,
    type: req.body.type,
    features: req.body.features,
    roomId: req.body.roomid ? req.body.roomid : getNewIdForRoom(req.body),
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
  q = {};
  if (isObjectId(id)) {
    // id is an ObjectID
    q._id = id;
  } else {
    q.roomId = id;
  }

  console.log("Update info of room having id: " + id + " by user: " + req.user.username);
  console.log(" updated info: " + req.body);
  var updatedRoom = req.body;

  console.log("get room with id " + id + " for update");
  Room.findOne(q, function(err,room) {
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

// -------------------- API to handle Reservations --------------------

app.get("/api/reservations", function(req,res) {
  var roomid = req.query.room;
  var after = req.query.since;
  var before = req.query.upto;
  var populate = req.query.populate;

  if (after) {
    after = new Date(after);
  }
  if (before) {
    before = new Date(before);
  }

  var query = Reservation.find();
  if (roomid) {
    query.where('room').equals(roomid);
  }
  if (after) {
    query.where('endTime').gt(after);
  }
  if (before) {
    query.where('startTime').lt(before);
  }
  if (populate) {
    query.populate('room'); // for now only allow populate room
    //FIXME if allow reserver population, remember to not return password!
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
  var query = Reservation.findOne({"_id": id});

  query.populate('room');
  query.populate('reserver', '-password'); // do NOT return password

  query.exec(function(err,item) {
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

  var reservation = new Reservation({
    room: req.body.room,
    description: req.body.description,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    reserver: req.user._id,
    countOfCoffee: req.body.countOfCoffee
  });
  console.log("Adding new reservation for room " + reservation.room +
    " by user " + req.user.username);

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
      reservation.endTime = req.body.endTime;
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

console.log("Roomio listening on port " + config.port);
app.listen(config.port);
