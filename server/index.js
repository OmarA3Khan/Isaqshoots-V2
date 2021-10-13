const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('mongodb');
const mongoose = require("mongoose");
const eventObject  = require("./models/events.js");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// const posts = require('./routes/api/posts');

// app.use('/api/posts', posts);

// Handle production
// if (process.env.NODE_ENV === 'production') {
  // Static folder
//   app.use(express.static(__dirname + '/public/'));

  // Handle SPA
//   app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
// }

// INDEX ROUTE
app.get("/",function(req,res){
	eventObject.find({event: true}, function(err, allEvents){
		if(err){
			// req.flash("err", err.message);
			res.send("not working:", err);
		}else{
			res.send({events: allEvents});
		}
	});
});

// app.get("/", (req, res) => {
//   res.send("hello");
// });

var url ='mongodb+srv://isaqshoots:Loganwayne17@cluster0.u0ebe.mongodb.net/isaqshoots?retryWrites=true&w=majority'
try {
    var db = mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('success connection at :'+ url);
}
catch (error) {
    console.log('Error connection: ' + error);
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));