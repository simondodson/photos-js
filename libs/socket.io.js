var server = require('../app').server;
var io = require('socket.io').listen(server);

io.configure('production', function() {
    io.enable('browser client etag');
    io.set('log level', 1);

    io.set('transports', [
        'websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling'
    ]);
});

io.configure('development', function() {
    io.set('transports', [
        'websocket'
    ]);
});

module.exports = io;

