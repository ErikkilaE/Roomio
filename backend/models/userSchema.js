var mongoose = require( "mongoose" );

var Schema = mongoose.Schema;

module.exports = mongoose.model("User", new Schema({
  username: { // user id or login
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  name: {   // Full name
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  admin: { // user has admin rights
    type: Boolean,
    default: false
  },
  password: { // encrypted password
    type: String,
    required: true
  }
}));
