var express 	     = require("express");
var router  	     = express.Router();
const mediaObject  	 = require("../models/media.js");
const { isLoggedIn } = require('../middleware/index.js');
const upload 		 = require('../middleware/multer.js');

// CLOUDINARY
var cloudinary = require("cloudinary").v2;
cloudinary.config({ 
  cloud_name: 'isaqshoots', 
  api_key: '574768211339436', 
  api_secret: '7Sv4s9lXu422nkQ6jhYSeXS542k'
});

// CREATE ROUTE - NEW ALBUM ROUTE
router.post("/newalbum",isLoggedIn, upload.single('image'), function(req,res){
	// var quality = parseInt(req.body.quality);
	cloudinary.uploader.upload(req.file.path, function(err, result) {
		if(err) {
			console.log(err);
			return res.status(500).send('There was an error with cloudinary uploader');
		}
		var album 		= true;
		var photo 		= false;
		var name  		= req.body.name;
		var image 		= result.secure_url;
		var imageId 	= result.public_id;
		var price 		= req.body.price;
		var description = req.body.description;
		var source 		= req.body.source;
		var newMediaObject = {album: album, photo: photo, name: name, image: image, price: price, description: description, imageId: imageId, source: source};
		mediaObject.create(newMediaObject, function(err, newlyCreatedMediaObject){
			if (err){
				return res.status(500).send('There was an error creating the object in the database');
			}else{
				res.send("done, pls refresh");
			}
		});
	});
});

// Get all albums
router.get("/index",function(req,res){
	mediaObject.find({album: true}, function(err, allEvents){
		if(err){
			res.status(400).send("Items not found ");
		}else{
			res.send(JSON.stringify({events: allEvents},null,'\t'));
		}
	});
});

// DESTROY Album OBJECT
router.delete('/index/:id', isLoggedIn, function(req, res) {
	mediaObject.findById(req.params.id, async function(err, foundAlbum) {
	  if(err) {
		return res.status(500).send("error on server side, delete album route : could not find album");
	  }
	  try {
		  var photoAlbumId = foundAlbum._id;
		  mediaObject.find({albumId: photoAlbumId},async function(err, result){
			  if(err){
				  console.log("error on server side delete album route try block find media",err);
				  return res.status(400).send("error on server side, delete album route : could not find photos of album");
			  }else{
				  for(var i = 0; i < result.length; i++){
					  if(result[i].imageId){
						  await cloudinary.uploader.destroy(result[i].imageId, function(err, result){
							  if(err){
								  console.log('ERROR delete album route cloudinary.destroy delete related photos', err);
								  return res.status(501).send("ERROR delete album route cloudinary.destroy delete related photos");
							  }else{
								  console.log("destroyed ? : ",result);
							  }
						  });
					  }
					  result[i].remove();
				  }
			  }
		  })
		  if(foundAlbum.imageId){
		  await cloudinary.uploader.destroy(foundAlbum.imageId, function(err, result){
				  if(err){
					  console.log("ERROR delete album route cloudinary.destroy",err);
					  return res.status(500).send("ERROR deleting album photo from cloudinary");
				  }else{
					  console.log("destroyed ? : ",result);
				  }
			  });
		  }
		  foundAlbum.remove();
		  console.log("Album deleted successfully!");
		  return res.status(200).send("deleted photo from cloudinary and db");
	  } catch(err) {
		  if(err) {
			console.log("error in catch detele album route", err);
			return res.status(500).send("ERROR Album could not be deleted");
		  }
		}
	});
});

router.get("/allalbumcount", (req, res) => {
	mediaObject.find({album: true}).count( function(err, allMedia){
		if(err){
			return res.status(400).send("Items not found ");
		}else{
			return res.send({allMedia: allMedia});
		}
	});
})

module.exports = router;