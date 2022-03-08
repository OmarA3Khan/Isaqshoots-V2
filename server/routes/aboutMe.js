var express 	     = require("express");
var router  	     = express.Router();
const aboutMeObject  = require("../models/aboutMe.js");
const { isLoggedIn } = require('../middleware/index.js');

router.get("/aboutme", (req, res) => {
	aboutMeObject.find({}, function(err, aboutMe){
		if(err){
			return res.status(400).send("Items not found ");
		}else{
			return res.send({aboutMe: aboutMe});
		}
	});
})

router.put("/aboutme",isLoggedIn,  (req, res) => {
	let id = "61f280c0e767846b27712e11"
	aboutMeObject.findById(id, async function(err, foundObject){
		if(err){
			res.status(501).send("ERROR on server side update aboutMe route");
		} else {
			foundObject.paragraphOne = req.body.paragraphOne;
			foundObject.paragraphTwo = req.body.paragraphTwo;
		}
		foundObject.save();
		return res.status(200).send("updated about")
	});
});

module.exports = router;