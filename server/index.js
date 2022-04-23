const express 		= require('express');
const bodyParser 	= require('body-parser');
const cors 			= require('cors');
const mongodb 		= require('mongodb');
const mongoose 		= require("mongoose");
const session 		= require('express-session');
const passport 		= require('passport');
const LocalStrategy = require('passport-local');
const User 			= require('./models/user');
const app 			= express();

// Requiring Routes here
let aboutMeRoutes  = require("./routes/aboutMe");
let albumsRoutes   = require("./routes/albums");
let	indexRoutes    = require("./routes/index");
let	faqRoutes  	   = require("./routes/faq");
let	photoRoutes    = require("./routes/photo");
let	videosRoutes   = require("./routes/videos");

require('dotenv').config()

app.use(bodyParser.json());

var corsOptions = {
	credentials: true,
	origin: ['http://localhost:5000', 'http://localhost:8080', 'http://localhost:8081']
}

// use cors options
app.use(cors(corsOptions));

// === SESSION CONFIG ===== //
app.use(session({
	secret: process.env.PASSPORT_secret,
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		expires: Date.now + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}));

// === PASSPORT CONFIG ===== //
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// CLOUDINARY
var cloudinary = require("cloudinary").v2;
cloudinary.config({ 
  cloud_name: 'isaqshoots', 
  api_key: process.env.CLOUDINARY_api_key, 
  api_secret: process.env.CLOUDINARY_api_secret
});

// var url ='mongodb+srv://isaqshoots:Loganwayne17@cluster0.u0ebe.mongodb.net/isaqshoots?retryWrites=true&w=majority'
var url = process.env.DATABASEURL;
var URL_local = "mongodb://localhost:27017/isaqshoots";
try {
    var db = mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('success connection at :'+ process.env.DATABASEURL);
}
catch (error) {
    console.log('Error connection: ' + error);
}

// using routes
app.use('^/api',aboutMeRoutes);
app.use('^/api',albumsRoutes);
app.use('^/api',indexRoutes);
app.use('^/api',faqRoutes);
app.use('^/api',photoRoutes);
app.use('^/api',videosRoutes);

// process.env.NODE_ENV = 'production'

// Handle production
if (process.env.NODE_ENV === 'production') {
	// Static folder
	app.use(express.static(__dirname + '/public/'));
  
	// Handle SPA
	app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
  }

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port} NODE_ENV= ${process.env.NODE_ENV} `));