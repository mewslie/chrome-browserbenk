function purge() {
    const minMean = document.getElementById("mean").value;
    const minSd = document.getElementById("sd").value;

    //get all key/value pairs from local storage and store in cardsList
    chrome.storage.local.get(null, function(cards) {
        const allPairs = Object.entries(cards)
        for (const [key, value] of allPairs) {
            var jsonObj = JSON.parse(value);
            if (jsonObj.mean >= minMean && jsonObj.sd >= minSd) {
                chrome.storage.local.remove([key], function() {
                    var error = chrome.runtime.lastError;
                        if (error) {
                        console.error(error);
                        } else {
                            //show message
                            var parentDiv = documen.getElementById("purge-field");
                            parentDiv.className = "text-danger";
                            parentDiv.innerText = "Cards were deleted FOREVER.";
                    }
                })
            }
        }
    });
}

function dlJSON() {
    chrome.storage.local.get(null, function(cards) {
        for (var key in cards) {
            if (cards.hasOwnProperty(key)) {
                cards[key] = JSON.parse(cards[key]); //unstring it
            }
        }
        var result = JSON.stringify(cards);
        //var url = 'data:application/json,' + result;
        var url = 'data:text/json,' + result;
        chrome.downloads.download({
            url: url,
            conflictAction: "prompt",
            saveAs: true,
            filename: 'deck_backup.json'
        });
    });
}

function ldJSON() {
    var file = document.getElementById("import").files[0];
    var reader = new FileReader();
    reader.onload = function(e){
        //console.log(e.target.result);
        var fileJSON = JSON.parse(this.result);
        for (var key in fileJSON) {
            if (fileJSON.hasOwnProperty(key)) {
                fileJSON[key] = JSON.stringify(fileJSON[key]); //string it up for storage
            }
        }
        //save the file contents
        chrome.storage.local.set(fileJSON, function() {
            var error = chrome.runtime.lastError;
                if (error) {
                console.error(error);
                } else {
                    //show message
                    var parentDiv = document.getElementById("import-field");
                    parentDiv.className = "text-danger";
                    parentDiv.innerText = "Existing deck data overwritten with back-up file.";
            }
        });
    }
    reader.readAsText(file);
    file.value = ""; //clear upload field
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("import").addEventListener('change', function(e){
        var nextSibling = e.target.nextElementSibling;
        nextSibling.innerText = e.target.files[0].name;
    }, false);

    var addPurgeLink = document.getElementById('purge');
	addPurgeLink.addEventListener('click', function () {
		purge();		
	}, false);
    var addExportLink = document.getElementById('export');
	addExportLink.addEventListener('click', function () {
		dlJSON();		
	}, false);
    var addLoadLink = document.getElementById('ldjson');
	addLoadLink.addEventListener('click', function () {
		ldJSON();		
	}, false);
}, false);
