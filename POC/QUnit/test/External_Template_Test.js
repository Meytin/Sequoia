module("External Templates Module");
test("Check inview length", function() {
	equal( window.HUB.viewModel.inviews.length, 2 );
});

test("Check if view models started without external data", 2, function() {
	if(window.HUB.viewModel.inviews[0].isReady){
		notEqual( window.HUB.viewModel.inviews[0].innerVM, "undefined");
	}
	else{	
		equal( window.HUB.viewModel.inviews[0].isReady, false );
	}
	if(window.HUB.viewModel.inviews[1].isReady){
		notEqual( window.HUB.viewModel.inviews[1].innerVM, "undefined");
	}
	else {
		equal( window.HUB.viewModel.inviews[1].isReady, false );
	}
});

test("Check if view models async loaded external data after 1 sec", 2, function() {
	stop();
	stop();
	setTimeout(
		function() {
			equal( window.HUB.viewModel.inviews[0].isReady, true );
			equal( window.HUB.viewModel.inviews[1].isReady, true );
			start();
			start();
		
		},
		1000
	);
});


test("Check if view models async data is loaded external data after 1 sec", 4, function() {
	stop();
	stop();
	stop();
	stop();
	setTimeout(
		function() {
			notEqual( window.HUB.viewModel.inviews[0].innerVM, "undefined" );
			equal( window.HUB.viewModel.inviews[0].innerVM.name, "lV" );
			notEqual( window.HUB.viewModel.inviews[1].innerVM, "undefined" );
			equal( window.HUB.viewModel.inviews[1].innerVM.name, "rV" );
			start();
			start();
			start();
			start();
		
		},
		1000
	);
});

test("Check change view", 5, function() {
	window.HUB.viewModel.changeView();
	stop();
	stop();
	stop();
	stop();
	stop();
	setTimeout(
		function() {
			equal( window.HUB.viewModel.inviews[0].isReady, true );
			equal( window.HUB.viewModel.inviews[0].name(), 'xxxView' );
			notEqual( window.HUB.viewModel.inviews[0].innerVM, "undefined" );
			window.HUB.viewModel.changeViewBack();
			equal( window.HUB.viewModel.inviews[0].isReady, true );
			equal( window.HUB.viewModel.inviews[0].name(), 'LeftView' );
			start();
			start();
			start();
			start();
			start();
		},
		1000
	);
});
