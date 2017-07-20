var mongoose = require( "mongoose" );

var Schema = mongoose.Schema;

module.exports = mongoose.model("Reservation", new Schema({
  reservationId: {
    type: Number,
    unique: true,
    index: true
  },
  room: { // references rooms
    type: Schema.Types.ObjectId,
    ref: "Room"
  },
  description: String,
  startTime: Date,
  lengthOfReservation: {
    type: Number,
    min: 1
  },
  reserver: { // who reserved room
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  countOfCoffee: {
    type: Number,
    min: 0
  }
}));
