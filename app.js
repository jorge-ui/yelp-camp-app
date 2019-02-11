//======================================================================================================================================
// SETUP
//======================================================================================================================================

// INCLUDE MODULES
//=============================================
var express               = require("express"),
    expressSession        = require('express-session'),
    methodOverride        = require('method-override'),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    seedDB                = require("./seeds"),
    passport              = require('passport'),
    LocalStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    http                  = require('http');
    flash                 = require('connect-flash');

// Wipe database and refill it with new seed data
// seedDB();

// DATABASE SETUP
//============================================= 
    // Connect mongoose to mongodb
        // Local
        //mongoose.connect("mongodb://localhost:27017/Yelp_Camp", { useNewUrlParser: true });
        // MongoDB Atlas
        console.log(process.env.DATABASEURL);
        mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
    // Include mongoose models
    var Campground = require("./models/campground"),
        User       = require("./models/user"),
        Comment    = require("./models/comment");

// APP SETUP
//=============================================
    // Define app
    app = express();
    // Use method-override
    app.use(methodOverride('_method'));
    // Use connect-flash
    app.use(flash());
    // Use body parser
    app.use(bodyParser.urlencoded({extended: true}));
    // View files as ".ejs"
    app.set('view engine', 'ejs');
    // Serve the "public" directory
    app.use(express.static("./public"));
    // Use express-session
    app.use(expressSession({
        secret: 'Sample string to generate unique session key',
        resave: false,
        saveUninitialized: false
     }));

// PASSPORT SETUP
//=============================================
     app.use(passport.initialize());
     app.use(passport.session());
     passport.serializeUser(User.serializeUser());
     passport.deserializeUser(User.deserializeUser());

     // STRATEGY definition(s)
        // 'local'
        passport.use(new LocalStrategy(User.authenticate()));

// CUSTOM MIDDLEWARES
//=============================================

    // define currentUser and sotre in res.locals
    app.use(function(req, res, next) {
        res.locals.currentUser = req.user;
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
        next();
    });

//======================================================================================================================================
// ROUTES
//======================================================================================================================================


// Require routes
var indexRoutes = require('./routes/index');
var campgroundsRoutes = require('./routes/campgrounds');
var commentsRoutes =require('./routes/comments');

// Define routes
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/comments', commentsRoutes);

 
//======================================================================================================================================
// Local & Web

    let PORT = process.env.PORT;
    let localHost = false;

    if (PORT == null || PORT == "") {
        PORT = 1234;
        localHost = true;
    }
    
    app.listen(PORT, process.env.IP, () => {
        console.log('Yelp Camp app started.');
        if (localHost) {
            // require('open')('http://localhost:' + PORT);
        }
    });