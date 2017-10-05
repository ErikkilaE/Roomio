// Configuration for RoomioApp

module.exports = {
  "database":           process.env.DB_URI || "mongodb://localhost/roomio",
  "port":               process.env.PORT || 3000,
  // Session stuff
  "secret":             "bestOrNothingSecret",
  "saveUninitialized":  false,
  "resave":             false,
  "cookie":             {maxAge:1000*60*60*24},
  "storeUrl":           process.env.SESSIONDB_URI || "mongodb://localhost/sessionDb",
  "storeCollection":    process.env.SESSION_COLLECTION || "session",
  "storeTtl":           60*60*24
};
