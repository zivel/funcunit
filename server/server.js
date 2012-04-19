var io = require('socket.io').listen(3996),
	writers = require('./writers');

io.configure(function(){
	io.enable('browser client etag');
	io.set('log level', 1);

	io.set('transports', [
		'xhr-polling'
		, 'websocket'
		, 'flashsocket'
		, 'htmlfile'
		, 'jsonp-polling'
	]);
});

io.sockets.on('connection', function (socket) {
	writers.logger(socket, process.stdout);
});
