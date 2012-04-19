steal(function() {
	var matches = window.location.href.match(/(?:websocket=)([^&#]*)/),
		url = 'http://localhost:3996',
		clientLib;

	if(matches && matches[1]) {
		if(matches[1] !== 'true') {
			url = matches[1];
		}
		clientLib = url + '/socket.io/socket.io.js';

		steal(clientLib).then(function() {
			var socket = io.connect(url);
			for(var i = 0; i < QUnit.events.length; i++) {
				(function(type) {
					QUnit.on(type, function(o) {
						socket.emit('QUnit.' + type, o);
					});
				})(QUnit.events[i]);
			}
		});
	}
});
