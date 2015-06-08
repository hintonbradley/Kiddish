// Require the modules we're going to need:
var express = require("express"),
    ejs = require("ejs"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),

    db = require("./models"),
    session = require("express-session"),
    app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

// Set up body parser
app.use(bodyParser.urlencoded({extended: true}));

// Set up method override to work with POST requests that have the parameter "_method=DELETE"
app.use(methodOverride('_method'))

// This defines req.session
app.use(session({
  secret: 'super secret',
  resave: false,
  saveUninitialized: true
}))

// this is the login/logout session
app.use("/", function (req, res, next) {
  req.login = function (user) {
    req.session.userId = user.id;
  };

  req.currentUser = function () {
    return db.User.
      find({
        where: {
          id: req.session.userId

       }
      }).
      then(function (user) {
        req.user = user;
        // console.log("testing session",req.user );
        return user;
      })
  };

  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  }

  next(); 
});


// CREATING GET REQUESTS:
app.get('/', function(req, res) {
         res.render('index');
  });

// SIGN UP 
app.get("/signup", function (req, res) {
  console.log("getting signup");
  res.render("users/signup");
});

// SIGN UP POST
app.post('/signup', function(req,res){
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    db.User.createSecure(email,password)
        .then(function(user){
          res.redirect('/login');
        });
});

//LOGIN
app.get('/login', function(req,res){
    req.currentUser()
      .then(function(user){
        console.log("THIS IS THE USER INFORMATION: ");
        if (user) { //if already logged in, will redirect to profile page
            res.redirect('users/profile');
        } else { // if not logged in, you will be sent to login page
            res.render("users/login");
        }
    });
});

//LOGIN POST
app.post('/login', function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    console.log("I'M LOGGED IN")
    db.User.authenticate(email,password)
        .then(function(dbUser){
            if(dbUser) {
                req.login(dbUser);
                // userId = dbUser.id
                // res.render('/users/'+ userId + '/profile')
                res.redirect('/profile');
            } else {
                res.redirect('/login');
            }
        }); 
});

//PROFILE
app.get('/profile', function(req, res) {
  req.currentUser()
    .then(function (user) {
  var userId = user.id;
  db.Video.findAll({where:{userId: userId}})
     .then(function(videos){
        console.log("THIS IS VIDEOS");
        res.render('users/profile.ejs', {videos: videos});
     })
   })
});


//SESSION DELETION
app.delete('/logout', function(req,res){
    req.logout();
    res.redirect('/login');
});


//NEW VIDEO
app.get('/users/videos/new', function(req, res) {
  req.currentUser()
    .then(function (user) {
  var userId = user.id;
  // var userId = req.params.id;
   res.render('users/videos/new.ejs',{userId: userId}); // We use res.render to display an EJS file instead of res.send() 
 });
});

//SHOW VIDEO
app.get('/users/videos/:yt', function(req, res) {
  var ytVideoId = req.params.yt;
  console.log(ytVideoId);
  db.Video.findAll({where:{ytVideoId: ytVideoId}})
   .then(function(singleVideo){
   res.render('users/videos/show.ejs', {singleVideo: singleVideo, ytVideoId: ytVideoId}); // We use res.render to display an EJS file instead of res.send() 
 })
});



//NEW VIDEO POST:
app.post('/users/:id/videos', function(req, res) {
  console.log("just posted video");
  var video = req.body.video;

  db.Video.create({
      // ...the user id will be taken from whoever the current user who's logged in at the time...
      userId: req.params.id,
      // and the rest of the data will be taken from the form field from the album.ejs file. (Remember that favorite is equal to req.body.favorite, and everything that comes after is referring to the specific key:value pair in the ejs file.)
      title: video.title,
      description: video.description,
      ytVideoId: video.ytVideoId
    }).then(function() {
      res.redirect('/profile');
    });
});

//VIDEO DELETE
app.delete('/users/:id/videos/:id', function (req,res) {
  // console.log("1 test");
  var videoId = req.params.id;
  
  // console.log("2 This is the video ID: ",videoId);
  db.Video.findById(videoId)
    .then(function(foundVideo){
      var userId = foundVideo.userId;

      foundVideo.destroy()
      .then(function() {
        res.redirect('/profile');
      });
    });
});


app.get('/sync', function(req, res) {
  // console.log("SYNC")
  db.sequelize.sync({force:true}).then(function() {
    res.send("Db was synced successfully.");
  })
});

//SETTING THE APP TO LISTEN TO LOCAL SERVER ON PORT 3000:
app.listen(process.env.PORT || 3000)