var mongoose = require( "mongoose" );

var Schema = mongoose.Schema;

module.exports = mongoose.model("RoomItem", new Schema({
    Name: String,
    RoomId: Number,
    Capacity: Number,
    Floor: Number,
    Building: String,
    Site: String,
    Type: RoomType,
    Features: Feature[]
}));
