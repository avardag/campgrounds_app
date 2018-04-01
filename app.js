var express       = require('express'),
    bodyParser    = require('body-parser'),
    mongoose      = require('mongoose'),
    seedDB        = require("./seeds"),
    passport      = require('passport'),
    localStrategy = require('passport-local'),
    session       = require('express-session'),
    methodOverride = require('method-override'),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require('./models/user');

// Requiring routes modules
var commentsRoutes     = require('./routes/comments')
var campgroundsRoutes  = require('./routes/campgrounds')
var indexRoutes        = require('./routes/index')

var app = express();

mongoose.connect("mongodb://localhost/yelp_camp_8");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

app.use(methodOverride('_method'));


// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(session({
  secret: "Keyboard cat",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// user var for front, which applies to all routes
app.use(function(req, res, next){
  // var currentUser = req.user;
  res.locals.currentUser = req.user;
  next();
});


// app.use Routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use('/campgrounds/:id/comments', commentsRoutes);




// SERVER
app.listen(3000, function(){
  console.log('Server started at port 3000...')
})