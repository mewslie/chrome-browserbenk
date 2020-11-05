document.addEventListener('DOMContentLoaded', function () {
	var addNewCardLink = document.getElementById('add');
	addNewCardLink.addEventListener('click', function () {
		//when adding a new card, open a new tab
		window.close;
		chrome.tabs.getSelected(null, function (tab) {
			chrome.tabs.create({url: 'newcard.html'});
		});
		
	}, false);
	
	var viewDeckLink = document.getElementById('deck');
	viewDeckLink.addEventListener('click', function () {
		//when looking at deck, open a new tab
		window.close;
		chrome.tabs.getSelected(null, function (tab) {
			chrome.tabs.create({url: 'deck.html'});
		});		
	}, false);

	var viewDeckLink = document.getElementById('test');
	viewDeckLink.addEventListener('click', function () {
		//when starting a test, open a new tab
		window.close;
		chrome.tabs.getSelected(null, function (tab) {
			chrome.tabs.create({url: 'test.html'});
		});		
	}, false);

	var viewDeckLink = document.getElementById('clean');
	viewDeckLink.addEventListener('click', function () {
		//when cleaning up deck, open a new tab
		window.close;
		chrome.tabs.getSelected(null, function (tab) {
			chrome.tabs.create({url: 'clean.html'});
		});		
	}, false);
}, false);