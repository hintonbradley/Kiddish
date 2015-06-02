// Require the modules we're going to need:
var express = require("express"),
    ejs = require("ejs"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");

// Now instantiate our express app:
var app = express();

// Set the view engine to be "EJS"
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Set up body parser
app.use(bodyParser.urlencoded({extended: true}));

// Set up method override to work with POST requests that have the parameter "_method=DELETE"
app.use(methodOverride('_method'))


// CREATING GET REQUESTS:
app.get('/', function(req, res) {
   res.render('index.ejs'); // We use res.render to display an EJS file instead of res.send() 
});

app.get('/user/:id', function(req, res) {
   res.render('user/profile.ejs'); // We use res.render to display an EJS file instead of res.send() 
});

app.get('/user/:id/video/new', function(req, res) {
   res.render('user/video/new.ejs'); // We use res.render to display an EJS file instead of res.send() 
});

app.get('/user/:id/video/:id', function(req, res) {
   res.render('user/video/show.ejs'); // We use res.render to display an EJS file instead of res.send() 
});


// CREATING POST REQUEST:
app.post('/user/:id/video', function(req, res) {
	//CREATE LOGIC
	console.log(req.params)

	var videoId = event.data.videoId;
	console.log(videoId);

	// TODO
	// Make a database
	// videos table
	// var video = new Video()
	// video.save();

});


//SETTING THE APP TO LISTEN TO LOCAL SERVER ON PORT 3000:
app.listen(3000);