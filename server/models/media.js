var mongoose = require("mongoose");

var mediaSchema = new mongoose.Schema({
	name : String,
	image : String, // image src
	imageId: String, // cloudinary id
	price : String,
	videoId : String, // if video, id
	description : String,
	album: Boolean, // if album cover photo, true
	photo: Boolean, // if photo, true
	video: Boolean, //if video, true
	albumId: String, // if photo, set parent album id
});

module.exports = mongoose.model("media", mediaSchema);