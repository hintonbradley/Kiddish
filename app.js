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
    // // requesting the current user
    //   req.currentUser()
    //   // then it is asking if the user is logged in or not
    //   .then(function(dbUser){
    //     if (dbUser) {
    //       // find favorite joke from db with user Id
    //       // db.Video.findAll({where: {userId: dbUser.id}})
    //         // .then(function(videos){
    //           console.log("test work!");

    //           console.log("testing session",dbUser );
    //           // this let me pass the user into the page
    //         res.redirect('user/profile');
    //       // });
    //     } else {
          console.log("hello");
         res.render('index');
      //   }
      // });
  });

// SIGN UP 
app.get("/signup", function (req, res) {
  console.log("getting signup");
  res.render("users/signup");
});


// reference signup.ejs
// this will post to the db after you click the signup button
app.post('/signup', function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    db.User.createSecure(email,password)
        .then(function(user){
          res.redirect('/login');
        });
});


// reference login.ejs
// this is for the login to account
app.get('/login', function(req,res){
    req.currentUser()
      .then(function(user){
        console.log("THIS IS THE USER INFORMATION: ", user);
        if (user) { //if already logged in, will redirect to profile page
            res.redirect('users/profile');
        } else { // if not logged in, you will be sent to login page
            res.render("users/login");
        }
    });
});

// reference login.ejs
// this is to authenticate the login
app.post('/login', function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    console.log("I'M LOGGED IN")
    db.User.authenticate(email,password)
        .then(function(dbUser){
            if(dbUser) {
              console.log("STAGE 2");
                req.login(dbUser);
                console.log("test", dbUser)
                // userId = dbUser.id
                // res.render('/users/'+ userId + '/profile')
                res.redirect('/profile');
            } else {
              console.log("STAGE 3");
                res.redirect('/login');
            }
        }); 
});

// app.get('/profile', function (req, res) {
//   req.currentUser()
//       .then(function (user) {
//         console.log(" THIS IS THE USER ID: ", user.id);
//         res.render("users/profile");

//       })

// });

// COPIED FROM JAMES' CODE FROM SEPARATE FILE:
  // Using example from CopyrightOn to perform a find method:
app.get('/profile', function(req, res) {
  req.currentUser()
    .then(function (user) {
  var userId = user.id;
  db.Video.findAll({where:{userId: userId}})
     .then(function(videos){
        console.log("THIS IS VIDEOS", videos);
        res.render('users/profile.ejs', {videos: videos});
     })
   })
});

// END OF COPIED CODE.






// <<<<<<< HEAD
// CODE CONFLICT!!! REVIEW AFTER PUSH
/////////////////////////////////////

// // app.get('/users/:id', function(req, res) {
// //   var userId = req.params.id;


//   // Using example from CopyrightOn to perform a find method:
// app.get('/users/:id', function(req, res) {
//   var userId = req.params.id;
//   db.Video.findAll({where:{userId: userId}})
// =======
// app.get('/profile', function(req,res){
//     req.currentUser()
//     .then(function (dbUser){
//       if (dbUser) {
//         db.User.findAll({where: {UserId: dbUser.id}})
//           .then(function(videos){
//             console.log("test work!");
//           res.render('user/profile', {videos: videos});
//         });
//       } else {
//        res.redirect('/login');
//       }
//     });
// });


//this is to end the session
app.delete('/logout', function(req,res){
    req.logout();
    res.redirect('/login');
});
  



// where the user submits the sign-up form
app.post("/users", function(req, res){
  // grab the user from the params
  var user = req.body.user;
  // create the new user
  db.User.
  createSecure(user.email, user.password)
    .then(function(){
      res.send("SIGN UP TODAY!");
    });
});






// **** MIKE UPDATED CODE IN HERE ****
// app.get('/users/:id', function(req, res) {
//   var userId = req.params.id;
//   db.Video.findAll({where:{email: userId}})
// // >>>>>>> 115a52978286a454d8e426f9ff99ac8f62c11123
// // END OF CONFLICT

//      .then(function(videos){
//         console.log("THIS IS VIDEOS", videos);
//         res.render('users/profile.ejs', {videos: videos});
//      })
// });
// **** END HERE ****



//     db.Video.findAll({ where: { userId: userId }})
//     .then(function(foundVideos) {
//       console.log(foundVideos);
//       res.render('users/profile.ejs', {myVideos: foundVideos});
//     })

 


//   // Using in class notes to perform a find method:
//   // db.Video.find(userId)
//   // .then(function(video) {
//   //   res.render('users/profile.ejs', {video: video,id: userId}); // We use res.render to display an EJS file instead of res.send() 
//   // });
// });

app.get('/users/videos/new', function(req, res) {
  req.currentUser()
    .then(function (user) {
  var userId = user.id;
  // var userId = req.params.id;
   res.render('users/videos/new.ejs',{userId: userId}); // We use res.render to display an EJS file instead of res.send() 
 });
});

app.get('/users/videos/:yt', function(req, res) {
  var ytVideoId = req.params.yt;
  console.log(ytVideoId);
  // var videoId=req.params.id;
  // console.log(videoId);
  // db.Video.findById(ytId)
  db.Video.findAll({where:{ytVideoId: ytVideoId}})
   .then(function(singleVideo){
      console.log("THIS IS THE VIDEO", singleVideo);
   res.render('users/videos/show.ejs',{taco: singleVideo, ytVideoId: ytVideoId}); // We use res.render to display an EJS file instead of res.send() 
 })
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
      res.redirect('/profile');
    });

  // TODO
  // Make a database
  // videos table
  // var video = new Video()
  // video.save();

});


///////////////
//PUT REQUEST//
///////////////
app.delete('/users/:id/videos/:id', function (req,res) {
  // console.log("1 test");
  var videoId = req.params.id;
  
  // console.log("2 This is the video ID: ",videoId);
  db.Video.findById(videoId)
    .then(function(foundVideo){
      var userId = foundVideo.userId;
      // console.log("This is the req.params ", userId);
      // console.log("3 Video: ", foundVideo)
      foundVideo.destroy()
      .then(function() {
        res.redirect('/profile');
      });
    });
});


app.get('/sync', function(req, res) {
  console.log("SYNC")
  db.sequelize.sync({force:true}).then(function() {
    res.send("Db was synced successfully.");
  })

});

//SETTING THE APP TO LISTEN TO LOCAL SERVER ON PORT 3000:
app.listen(3000);