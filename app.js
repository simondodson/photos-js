/**
 * Module dependencies.
 */
var express = require('express'),
    auth = require('./libs/auth'),
    index = require('./routes'),
    gallery = require('./routes/gallery'),
    upload = require('./routes/upload'),
    http = require('http'),
    path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: process.env.SESSION_SECRET}));
app.use(auth.middleware());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

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

function protectedRoute(req, res, next) {
    if (req.loggedIn) {
        next();
    } else {
        res.status(403);
        res.render('error', {
            title: "Forbidden",
            message: "You do not have proper privileges to access this page."
        });
    }
}

app.get('/create', protectedRoute, gallery.index);
app.post('/create', protectedRoute, gallery.post);

app.get('/upload/', protectedRoute, upload.index);
app.get('/upload/callback/', protectedRoute, upload.callback);
app.get('/upload/:folder', protectedRoute, upload.index);

app.get('/', index.index);

process.on('uncaughtException', function(err) {
    console.error(err.stack);
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
