var mongoose = require( "mongoose" );

var Schema = mongoose.Schema;

module.exports = mongoose.model("Room", new Schema({
  name: {
    type: String,
    required: true
  },
  roomId: {
    type: Number,
    unique: true,
    index: true
  },
  description: String,
  capacity: {
    type: Number,
    min: 1
  },
  floor: Number,
  building: String,
  site: String,
  type: { // Room type
    type: String,
    enum: ["MEETING", "CLASSROOM", "AUDITORIUM" ]
  },
  features: [String]
}));
