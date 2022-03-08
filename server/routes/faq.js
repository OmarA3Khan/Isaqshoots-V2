var express 	     = require("express");
var router  	     = express.Router();
const Faq            = require('../models/faq');
const { isLoggedIn } = require('../middleware/index.js');

router.get("/faq", function(req, res) {
	Faq.find( {} , function(err, allFaq){
		if(err){
			res.status(400).send("Items not found ");
		}else{
			res.send({Faq: allFaq});
		}
	});
})

router.post("/faq", isLoggedIn, function(req,res){
	var question = req.body.question;
	var answer = req.body.answer;
	var newFaq = {question : question, answer : answer};
	Faq.create(newFaq, function(err, newlyCreatedFaq){
		if(err){
			return res.status(500).send("There was an error creating the Faq object");
		}else{
			res.status(200).send("faq created");
		}
	});
});

router.put("/faq/:id", isLoggedIn, function(req,res){
	Faq.findById(req.params.id, function(err, foundFaq){
		if(err){
			return res.status(500).send("There was an error updating the Faq object");
		}else{
			foundFaq.question = req.body.question || foundFaq.question;
			foundFaq.answer = req.body.answer || foundFaq.answer;
            foundFaq.save();
            res.status(200).send("faq updated");
		}
	});
});

router.delete("/faq/:id", isLoggedIn, function(req, res){
	Faq.findByIdAndRemove(req.params.id, function(err){
		if(err){
			return res.status(500).send("There was an error deleting the Faq object");
		}else{
			return res.status(200).send("faq deleted");
		}
	});
});

router.get("/allfaqcount", (req, res) => {
	Faq.find({}).count( function(err, allMedia){
		if(err){
			return res.status(400).send("Items not found ");
		}else{
			return res.send({allMedia: allMedia});
		}
	});
})

module.exports = router;