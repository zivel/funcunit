(function(){

	if(steal.options.instrument){
		QUnit.done(function(){
			// send to console
			if(steal.options.browser){
				steal.client.trigger("coverage", steal.instrument.compileStats());
			}
		})
	}
	
	// if there's a failed assertion, don't run the rest of this test, just fail and move on
	QUnit.log(function(data){
		if(data.result === false) {
			if(typeof FuncUnit !== "undefined"){
				FuncUnit._queue = [];
			}
			start();
		}
	})

	var evts = ['begin', 'testStart', 'testDone', 'moduleStart', 'moduleDone', 'done', 'log'],
		type,
		orig = {},
		listeners = {},
		dispatch = function(type, data) {
			if ( type in listeners ) {
				for ( var i = listeners[type].length - 1; i >= 0; i-- ) {
					listeners[type][i].call(QUnit, data);
				}
			}
		};

	/**
	 * Adds an event mechanism to QUnit.
	 *
	 *  QUnit.on('testStart', function(o) {
	 *      console.log(o);
	 *  });
	 *
	 *  @see https://github.com/spjwebster/qunit-events
	 */
	QUnit.extend( QUnit, {
		on: function(type, callback) {
			if ( false === type in listeners ) {
				listeners[type] = [];
			}
			listeners[type].push(callback);
		},
		events : evts
	});

	// Bind event handlers
	for (var i = 0; i < evts.length; i++) {
		type = evts[i];
		(function(type){
			QUnit[type] (function(data){
				if(orig[type]){
					orig[type].apply(this, arguments);
				}
				dispatch(type, data);
			});
		})(type);
	}

	if(steal.options.browser){
		// Attach to the QUnit events
		for (var i = 0; i < evts.length; i++) {
			type = evts[i];
			(function(type){
				QUnit.on(type, function(data) {
					steal.client.trigger(type, data);
				});
			})(type);
		}
	}
	
})()
