var express 	   	 = require("express");
var router  	   	 = express.Router();
const mediaObject  	 = require("../models/media.js");
const { isLoggedIn } = require('../middleware/index.js');
const upload 		 = require('../middleware/multer.js');
var passport 	 	 = require("passport");
const jwt 			 = require('jsonwebtoken')
const config 		 = require('../config/config')
const User 			 = require('../models/user');

// CLOUDINARY
var cloudinary = require("cloudinary").v2;
cloudinary.config({ 
  cloud_name: 'isaqshoots', 
  api_key: '574768211339436', 
  api_secret: '7Sv4s9lXu422nkQ6jhYSeXS542k'
});

// The jwtSignUser method is used for generating a jwt token
function jwtSignUser (user) {
	const ONE_WEEK = 60 * 60 * 24 * 7
	return jwt.sign(user, config.authentication.jwtSecret, {
	  expiresIn: ONE_WEEK
	})
}

router.get("/allmediacount", (req, res) => {
	mediaObject.find({}).count( function(err, allMedia){
		if(err){
			return res.status(400).send("Items not found ");
		}else{
			return res.send({allMedia: allMedia});
		}
	});
})

// UPDATE ROUTE - COMMON FOR ALL MEDIA
router.put("/index/:id",isLoggedIn, upload.single('image'), function(req, res){
	mediaObject.findById(req.params.id, async function(err, foundMedia){
		//    var quality = parseInt(req.body.quality);
		if(err){
			res.status(500).send("ERROR on server side update album route");
		} else {
				if (req.file) {
					try {
						await cloudinary.uploader.destroy(foundMedia.imageId, function(err, result){
							if(err){
								console.log("ERROR on server side update cloudinary destroy - req.file try block",err);
								return res.status(501).send("ERROR on server side update route, req.file try block - cloudinary destroy");
							}else{
								console.log("destroyed ? : ",result);
							}
						});
						var result = await cloudinary.uploader.upload(req.file.path, function(err,result){
							if(err){
								console.log("update album route req.file try cloudinary.uploader block server side error",err);
								return res.status(501).send("update album route req.file try cloudinary.uploader block server side error");
							}else{
								console.log("Update Album successfull",JSON.stringify(result, null, '\t'));
							}
						});
						foundMedia.imageId = result.public_id;
						foundMedia.image = result.secure_url;
					} catch(err) {
						return res.status(501).send("update album route req.file catch block server side error");
					}
				}
			foundMedia.name = req.body.title || foundMedia.name;
			foundMedia.description = req.body.description || foundMedia.description;
			foundMedia.album = foundMedia.album;
			foundMedia.photo = foundMedia.photo;
			foundMedia.save();
			console.log("updated foundMedia",JSON.stringify(foundMedia, null, '\t'));
			res.status(204).send(foundMedia);
		}
	});
});

// DESTROY Photo or Video object
router.delete('/index/:id/photo', isLoggedIn, function(req, res) {
	mediaObject.findById(req.params.id, async function(err, photo) {
	  if(err) {
		return res.status(500).send("error on server side, delete photo route : could not find photo");
	  }
	  try {
		  if(photo.imageId){
			  await cloudinary.uploader.destroy(photo.imageId, function(err, result){
					if(err){
						console.log('ERROR delete album route cloudinary.destroy delete related photos', err);
						return res.status(501).send("ERROR delete photo route cloudinary.destroy photo");
					}else{
						console.log("destroyed ? : ",result);
					}
				});
		  	}
		  photo.remove();
		  console.log("Media deleted successfully!");
		  return res.status(200).send("deleted photo from cloudinary and db");
		} catch(err) {
			if(err) {
				console.log("error in catch detele photo route", err);
				return res.status(500).send("ERROR photo could not be deleted");
			}
	  	}
	});
});

// ========== Register Route ======== //
router.post("/register", async function(req,res, next){
	try {
		const username = req.body.username;
		const password = req.body.password;
		const user = new User({username});
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, err => {
            if (err) return next(err);
            res.send(registeredUser);
        })
	} catch (e) {
        res.status(501).send(e);
	}
})

// ========== Login & Logout Routes ======== //
//Login Route
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    delete req.session.returnTo;
	const userJson = req.user.toJSON()
      res.status(200).send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
})

//Logout Route
router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).send('Logged Out');
})
// ========== ==================== ======== //

// router.get('/viewcount',isLoggedIn, (req,res) => {
// 	if(req.session.count){
// 		req.session.count += 1;
// 	}else {
// 		req.session.count = 1;
// 	}
// 	res.send(`you have viewd this page ${req.session.count} times`);
// })

module.exports = router;