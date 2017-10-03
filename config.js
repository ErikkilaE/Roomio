// Configuration for RoomioApp

module.exports = {
  "database":           "mongodb://localhost/roomio",
  // Session stuff
  "secret":             "bestOrNothingSecret",
  "saveUninitialized":  false,
  "resave":             false, 
  "cookie":             {maxAge:1000*60*60*24},
  "storeCollection":    "session",
  "storeUrl":           "mongodb://localhost/sessionDb",
  "storeTtl":           60*60*24
};
