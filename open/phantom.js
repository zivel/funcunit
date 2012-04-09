var phantom = require('phantom');

var url = process.argv[2];
url += '?steal[browser]=phantomjs&steal[startFiles]=funcunit/node/client.js';

console.log(url);

phantom.create(function(ph){
	ph.createPage(function(page){
		page.set('onConsoleMessage', function(msg, line, file){
			if(msg && msg.indexOf('__EVT' === 0)){
				try{
					var evt = JSON.parse(msg.substring(5));
					if(evt.trigger){
						events[evt.trigger](evt.data);
						if(evt.trigger == 'done'){
							ph.exit();
						}
					}
				}catch(e){}
			} else {
				// console.log(msg);
			}
		});
		page.open(url, function(){
			// console.log('!!!!!!!!!!!!!!!!!!!!!!');
		});
	});
});
var results = {},
	currentModule,
	currentTest,
	events = {
		begin: function(data){
			
		},
		testDone: function(data){
			var test = results[currentModule].tests[data.name];
			test.failed = data.failed;
			test.total = data.total;
		},
		log: function(data){
			results[currentModule].tests[currentTest].logs.push(data);
			console.log((data.result ? '    [x] ' : '    [ ] ') + data.message);
		},
		testStart: function(data){
			currentTest = data.name;
			results[currentModule].tests[currentTest] = {
				logs: []
			};
			console.log('  '+data.name);
		},
		moduleStart: function(data){
			currentModule = data.name;
			results[currentModule] = {
				tests: {}
			};
			console.log("\n", data.name);
		},
		moduleDone: function(data){
			var module = results[currentModule];
			module.failed = data.failed;
			module.total = data.total;
		},
		done: function(data){
			var nbrFailed = 0, 
				failed = [],
				nbrPassed = 0,
				moduleName,
				module,
				testName,
				failed, 
				test;
			
			for(moduleName in results){
				module = results[moduleName];
				for(testName in module.tests){
					test = module.tests[testName];
					if(test.failed > 0){
						nbrFailed ++;
						failed.push({
							module: moduleName,
							test: testName
						});
					} else {
						nbrPassed ++;	
					}
				}
			}
			
			console.log('')
			if(nbrFailed > 0){
				console.log('FAILURES')
				for(var i=0; i<failed.length; i++){
					failed = failed[i];
					console.log('  '+(i+1)+') module: '+failed.module+', test: '+failed.test);
				}
			} else {
				console.log('PASSED')
			}
			console.log(nbrPassed+' passed, '+nbrFailed+' failed')
		}
	}