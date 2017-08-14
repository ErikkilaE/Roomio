var mongoose = require( "mongoose" );

var Schema = mongoose.Schema;

module.exports = mongoose.model("User", new Schema({
  userId: { // user id or login
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  name: {   // Full name
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
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
