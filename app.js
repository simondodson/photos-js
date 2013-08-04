/**
 * Module dependencies.
 */
var express = require('express'),
    flash = require('connect-flash'),
    http = require('http'),
    mongoose = require('mongoose'),
    passport = require('./libs/passport'),
    path = require('path');

var index = require('./routes'),
    login = require('./routes/login'),
    logout = require('./routes/logout'),
    gallery = require('./routes/gallery'),
    upload = require('./routes/upload');

// Connect to the database
mongoose.connect(process.env.MONGOHQ_URL);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({secret: process.env.SESSION_SECRET}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {

    // Don't cache pages if logged in
    if (req.isAuthenticated()) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    }

    // Add global variables
    app.locals.isAuthenticated = req.isAuthenticated();
    app.locals.user = req.user;

    // Add the flash messages to the global variables
    app.locals.flash = [];
    var flashTypes = [ 'info', 'success', 'error' ];
    for (var i in flashTypes) {
        var type = flashTypes[i];
        var message = req.flash(type);
        if (message.length > 0) {
            // Convert the flash type into a bootstrap alert type
            var alertClass;
            if (type == 'error') {
                alertClass = 'danger';
            } else {
                alertClass = type;
            }

            app.locals.flash.push({
                type: alertClass,
                message: message
            });
        }
    }

    next();
});
app.use(app.router);

process.on('uncaughtException', function(err) {
    console.log(err.stack);
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
}

// Set the global variables
app.locals = {
    siteTitle: 'Photos.js',
    company: 'Photos.js'
};

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.status(403);
    res.render('error', {
        title: "Forbidden",
        message: "You do not have proper privileges to access this page."
    });
}

app.get('/login', login.index);
app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), login.post);
app.get('/logout', logout.index);

app.get('/create', ensureAuthenticated, gallery.index);
app.post('/create', ensureAuthenticated, gallery.post);
app.get('/delete/:gallery', ensureAuthenticated, gallery.delete);

app.get('/upload/callback/', ensureAuthenticated, upload.callback);
app.get('/upload/:folder', ensureAuthenticated, upload.index);

app.get('/', index.index);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
