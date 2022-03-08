var express 	     = require("express");
var router  	     = express.Router();
const mediaObject  = require("../models/media.js");
const { isLoggedIn } = require('../middleware/index.js');

// All videos
router.get("/index/vids",function(req,res){
	mediaObject.find( { video: true } , function(err, allMedia){
		if(err){
			res.status(400).send("Items not found ");
		}else{
			res.send(JSON.stringify({allMedia: allMedia},null,'\t'));
		}
	});
});

router.get("/allvideocount", (req, res) => {
	mediaObject.find({video: true}).count( function(err, allMedia){
		if(err){
			return res.status(400).send("Items not found ");
		}else{
			return res.send({allMedia: allMedia});
		}
	});
})

module.exports = router;