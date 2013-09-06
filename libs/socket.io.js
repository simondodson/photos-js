var server = require('../app').server;
var io = require('socket.io').listen(server);

io.configure('production', function() {
    io.enable('browser client etag');
    io.set('log level', 1);

    // Heroku doesn't support websockets yet
    // See: https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
    io.set('transports', [
        'xhr-polling',
        'jsonp-polling'
    ]);
    io.set("polling duration", 10);
});

io.configure('development', function() {
    io.set('transports', [
        'websocket'
    ]);
});

module.exports = io;

