var mongoose = require( "mongoose" );

var Schema = mongoose.Schema;

module.exports = mongoose.model("ReservationItem", new Schema({
    ReservationId: Number,
    RoomId: Number,
    Description: String,
    StartTime: Date,
    LengthOfReservation: Number,
    ReserverName: String,
    Email: String,
    CountOfCoffee: Number
}));
