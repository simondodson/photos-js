/**
 * Module dependencies.
 */
var express = require('express'),
    index = require('./routes'),
    gallery = require('./routes/gallery'),
    login = require('./routes/login'),
    logout = require('./routes/logout'),
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
app.use(function(req, res, next){
    if (req.session.user && req.session.user.isAuthenticated === true) {
        app.locals.isAuthenticated = true;
    }
    next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
}

app.locals = {
    siteTitle: 'Photos.js',
    company: 'Photos.js'
};

// Super crude auth
function isAuthenticated (req, res, next) {
    if (req.session.user && req.session.user.isAuthenticated === true) {
        next();
    } else {
        res.send('<h1>403 Forbidden</h1>', 403);
    }
}

if ('development' == app.get('env')) {
    app.locals.isAuthenticated = true;
    function isAuthenticated(req, res, next) {
        next();
    }
}
app.get('/login', login.index);
app.post('/login', login.post);
app.get('/logout', logout.index);

app.get('/create', isAuthenticated, gallery.index);
app.post('/create', isAuthenticated, gallery.post);

app.get('/upload/', isAuthenticated, upload.index);
app.get('/upload/callback/', isAuthenticated, upload.callback);
app.get('/upload/:folder', isAuthenticated, upload.index);

app.get('/', index.index);

process.on('uncaughtException', function(err) {
    console.error(err.stack);
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
