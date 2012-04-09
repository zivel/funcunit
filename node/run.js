var phantom = require('phantom');

var url = process.argv[2];
url += '?steal[browser]=phantomjs&steal[startFiles]=funcunit/node/client.js';

console.log(url);

phantom.create(function(ph){
	ph.createPage(function(page){
		page.set('onConsoleMessage', function(msg, line, file){
			// console.log(msg, file + ':' + line);
		});
		page.set('onAlert', function(msg){
			var evt = JSON.parse(msg);
			if(evt.trigger){
				console.log(evt.trigger, evt.data);
				// events[evt.trigger](data);
				if(evt.trigger == 'done'){
					ph.exit();
				}
			}
		});
		page.open(url, function(){
			// console.log('!!!!!!!!!!!!!!!!!!!!!!');
		});
	});
});