// Require the modules we're going to need:
var express = require("express"),
    ejs = require("ejs"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    //Creating models to define how data is to be stored:
	db = require("./models");

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

app.get('/users/:id', function(req, res) {
   res.render('users/profile.ejs'); // We use res.render to display an EJS file instead of res.send() 
});

app.get('/users/:id/videos/new', function(req, res) {
	var userId = req.params.id;
   res.render('users/videos/new.ejs',{userId: userId}); // We use res.render to display an EJS file instead of res.send() 
});

app.get('/users/:id/videos/:id', function(req, res) {
   res.render('users/videos/show.ejs'); // We use res.render to display an EJS file instead of res.send() 
});


// CREATING POST REQUEST:
app.post('/users/:id/videos', function(req, res) {
	//CREATE LOGIC
	console.log(req.params);
	console.log(req.body);
	var video = req.body.video;

	db.Video.create({
      // ...the user id will be taken from whoever the current user who's logged in at the time...
      userId: req.params.id,
      // and the rest of the data will be taken from the form field from the album.ejs file. (Remember that favorite is equal to req.body.favorite, and everything that comes after is referring to the specific key:value pair in the ejs file.)
      title: video.title,
      description: video.description,
      ytVideoId: video.ytVideoId
    }).then(function() {
      res.redirect('/users/'+req.params.id);
    });

	// TODO
	// Make a database
	// videos table
	// var video = new Video()
	// video.save();

});


//SETTING THE APP TO LISTEN TO LOCAL SERVER ON PORT 3000:
app.listen(3000);

