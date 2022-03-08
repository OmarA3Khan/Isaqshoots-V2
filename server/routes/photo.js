var express 	     = require("express");
var router  	     = express.Router();
const mediaObject  = require("../models/media.js");
const { isLoggedIn } = require('../middleware/index.js');
const upload 	= require('../middleware/multer.js');

// CLOUDINARY
var cloudinary = require("cloudinary").v2;
cloudinary.config({ 
  cloud_name: 'isaqshoots', 
  api_key: '574768211339436', 
  api_secret: '7Sv4s9lXu422nkQ6jhYSeXS542k'
});

// CREATE ROUTE / NEW Photo ROUTE - ADD MORE PHOTOS TO ALBUM
router.post("/index/:id", upload.array('image'),async function(req,res){
	if(!req.body.videoId){
		
		/* we would receive a request of file paths as array */

		let multipleUpload = new Promise(async (resolve, reject) => {
			let upload_len = req.files.length;
			let upload_res = new Array();
			console.log("upload_len : ",upload_len);
			for(let i = 0; i < upload_len; i++)
			{
				console.log("req.files[i].path : ", req.files[i].path)
				let filePath = req.files[i].path;
				await cloudinary.uploader.upload(filePath, (error, result) => {
					let image = result.secure_url;
					let imageId = result.public_id;
					let albumId = req.params.id;
					let event = false;
					let photo = true;
					let newMediaObject = {image: image, imageId: imageId, albumId: albumId, event: event, photo: photo};
					mediaObject.create(newMediaObject, function(err, newlyCreatedPhotoObject){
						if (err){
							console.log("ERROR add media to album route, cloudinary.upload error", err);
							return res.status(500).send('ERROR add media to album route, could not create new media Object');
						}
					});
					console.log("upload_res : ",upload_res);
					console.log("upload_res 2 : ",upload_res.length);
					if(i === (upload_len) - 1){
						/* resolve promise after upload is complete */
						resolve(upload_res)
					}
					else if(result){
						/*push public_ids in an array */  
						upload_res.push(result.public_id);
					}
					else if(error) {
						console.log(error);
						reject(error);
						return res.status(502).send('ERROR add media to album route, could not upload to cloudinary');
					}

				})
			} 
		})
		.then((result) => { 
			console.log(result)
			console.log("result", result);
			return res.status(200).send("from .then Successfully uploaded all media"); 
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).send('ERROR add media to album route, promise error');
		})

		let upload = await multipleUpload;
	}
	else{
		var albumId = req.params.id;
		var album = false;
		var photo = false;
		var video = true;
		var videoId = req.body.videoId;
		var newMediaObject = {videoId: videoId, album: album, photo: photo, video: video, albumId: albumId};
		mediaObject.create(newMediaObject, function(err, newlyCreatedPhotoObject){
			if (err){
				return res.status(500).send("ERROR add media to album route, couldn't create video object");
			}else{
				return res.status(200).send(newlyCreatedPhotoObject);
			}
		});
	}
});

// All photos
router.get("/index/imgs",function(req,res){
	mediaObject.find( {photo: true } , function(err, allMedia){
		if(err){
			res.status(400).send("Items not found ");
		}else{
			res.send(JSON.stringify({allMedia: allMedia},null,'\t'));
		}
	});
});

//Show All photos of an album
router.get("/index/album/:id", function(req, res){
	mediaObject.findById(req.params.id, async function(err, foundAlbum){
		if(err){
			return res.status(400).send("Items not found ");
		}else {
			mediaObject.find({albumId: req.params.id}, function(err, photos){
				if(err){
					return res.status(400).send("Items not found ");
				}else {
					const album = [];
					album.push(foundAlbum);
					const allMediaObjects = album.concat(photos);
					res.send({photos: allMediaObjects});
				}
			});
		}
	});
});

router.get("/allphotocount", (req, res) => {
	mediaObject.find({photo: true}).count( function(err, allMedia){
		if(err){
			return res.status(400).send("Items not found ");
		}else{
			return res.send({allMedia: allMedia});
		}
	});
})

module.exports = router;