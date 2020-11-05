//displays all cards saved to chrome.storage.local
//makes use of some language.js functions for editing cards
function getDeck() {
	//clear contents first
	var cardParent = document.getElementById("deckdisplay");
	while (cardParent.hasChildNodes()) {  
	  cardParent.removeChild(cardParent.firstChild);
	}
	
	//get all data stored in chrome.storage.local
	chrome.storage.local.get(null, function(cards) {
		var allKeys = Object.keys(cards);
		var allCards = Object.values(cards);
		var allDivIds = Array.from(new Array(allKeys.length), (x,i) => "card" + i); //each card will be displayed in its own div

		if (allKeys.length == 0) {
			//there are no cards in the deck
			document.getElementById("deckdisplay").innerHTML = 'Deck is empty. <a href="newcard.html" class="card-link">Add cards now!</a>';
		} else {
			//display each card in deck
			for (var i = 0; i < allKeys.length; i++) {
				var thisDivId = allDivIds[i];
				var thisKey = allKeys[i];
				var thisCard = allCards[i];
	
				if (testJSON(thisCard)) {
					//if thisCard is a valid JSON string, parse and display thisCard and display edit and delete buttons
					thisCard = JSON.parse(thisCard);
					displayCard(thisDivId, thisKey, thisCard);
				} else {
					//if thisCard is a normal string (invalid), display thisKey and delete button only
					//see displayCard() for card display details
					//main div body
					var cardDiv = document.createElement("div");
					cardDiv.className = "card rounded-card";
					document.getElementById("deckdisplay").appendChild(cardDiv);
					var cardBodyDiv = document.createElement("div");
					cardBodyDiv.className = "card-body";
					cardBodyDiv.id = thisDivId;
					cardDiv.appendChild(cardBodyDiv);
					
					//delete button
					var controlsDiv = document.createElement("div");
					controlsDiv.className = "card-text row";
					controlsDiv.id = thisDivId + "-controls";
					cardBodyDiv.appendChild(controlsDiv);
						var delP = document.createElement("p");
						delP.className = "col text-right";
						controlsDiv.appendChild(delP);
							var cardDelete = document.createElement("button");
							cardDelete.className = "btn";
							cardDelete.innerHTML = '<i class="fas fa-trash" style="color: red;"></i>';
							// cardDelete.onclick = function() { actionCardDelete(thisDivId, thisKey); } //delete event
							cardDelete.addEventListener('click', function () {
								actionCardDelete(thisDivId, thisKey);		
							}, false); //delete event
							delP.appendChild(cardDelete);
					
					//display thisKey
					var cardTitle = document.createElement("h4");
					cardTitle.className = "card-title";
					cardTitle.id = thisDivId + "-title";
					cardTitle.textContent = thisKey;
					cardBodyDiv.appendChild(cardTitle);
					
					//display thisCard as normal string
					var cardText1 = document.createElement("p");
					cardText1.className = "card-text";
					cardText1.id = thisDivId + "-read";
					cardText1.innerHTML = thisCard;
					cardBodyDiv.appendChild(cardText1);
				}
			}
		}
	});
}

//boolean test to see if a string can be parsed into JSON object
function testJSON(text) {
	if (typeof text !== "string") {
		return false;
	}
	try {
		JSON.parse(text);
		return true;
	} catch (error) {
		return false;
	}
}

//edits a key/value pair in chrome.storage.local
async function updateCard(key, card) {
	//last minute check on key and card
	if (key.length > 0 && Object.keys(card).length > 0) {
		//all good
		await chrome.storage.local.set({[key]: JSON.stringify(card)});
	} else {
		//error
		alert("Insufficient input to edit card");
	}
}

//display card (localstorage key) in a div with id
function displayCard(id, key, card) {
	//cards are wrapped in
	//	a card div
	//		a card body [id=id]
	//			a control div [id=id+"-controls"]
	//			a title h4 [id=id+"-title"]
	//			a contents div [id=id+"-contents"]
	//				a text1a p [id=id+"-read"]
	//				a text1b p [id=id+"-bunsetsu"]
	//				a text1c p [id=id+"-base"]
	//				a text2 p [id=id+"-tran"]
	//				a text3 p [id=id+"-audio"]
	//				a text4 p [id=id+"-stat"]
	var cardDiv = document.createElement("div");
	cardDiv.className = "card rounded-card border-primary";
	document.getElementById("deckdisplay").appendChild(cardDiv);
	var cardBodyDiv = document.createElement("div");
	cardBodyDiv.className = "card-body";
	cardBodyDiv.id = id;
	cardDiv.appendChild(cardBodyDiv);
	
	//the edit and delete buttons are wrapped in
	//	a control div [id=id+"-controls"]
	//		a p for editing
	//		a p for deleting
	var controlsDiv = document.createElement("div");
	controlsDiv.className = "card-text row";
	controlsDiv.id = id + "-controls";
	cardBodyDiv.appendChild(controlsDiv);
		var editP = document.createElement("p");
		editP.className = "col text-left";
		controlsDiv.appendChild(editP);
			var editButton = document.createElement("button");
			editButton.className = "btn";
			editButton.innerHTML = '<i class="fas fa-edit text-primary"></i>';
			// editButton.onclick = function() { displayCardEdit(id, key, card); } //edit event
			editButton.addEventListener('click', function () {
				displayCardEdit(id, key, card);
			}, false); //edit event
			editP.appendChild(editButton);
		var delP = document.createElement("p");
		delP.className = "col text-right";
		controlsDiv.appendChild(delP);
			var cardDelete = document.createElement("button");
			cardDelete.className = "btn";
			cardDelete.innerHTML = '<i class="fas fa-trash text-danger"></i>';
			// cardDelete.onclick = function() { actionCardDelete(id, key); } //delete event
			cardDelete.addEventListener('click', function () {
				actionCardDelete(id, key);
			}, false); //delete event
			delP.appendChild(cardDelete);

	//the title of the card is displayed in an h4 element
	//	a h4 [id=id+"-title"]
	var cardTitle = document.createElement("h4");
	cardTitle.className = "card-title";
	cardTitle.id = id + "-title";
	cardTitle.innerText = key;
	cardBodyDiv.appendChild(cardTitle);
	
	//the contents are then in their own div
	//	a div [id=id+"-contents"]
	var cardContents = document.createElement("div");
	cardContents.className = "card-text";
	cardContents.id = id + "-contents";
	cardBodyDiv.appendChild(cardContents);

	//the card values are displayed in their own p elements
	//	a p for reading [id=id+"-read"]
	//	a p for bunsetsu [id=id+"-bunsetsu"]
	//	a p for base [id=id+"-base"]
	//	a p for pos [id=id+"-pos"]
	//	a p for translation [id=id+"-tran"]
	//	a p for audio [id=id+"-audio"]
	//		a button for play audio
	//	a p for card statistics [id=id+"-stat"]
	var cardText1a = document.createElement("p");
	cardText1a.className = "card-text";
	cardText1a.id = id + "-read";
	cardText1a.innerText = card.read;
	cardContents.appendChild(cardText1a); //the reading
	var cardText1b = document.createElement("p");
	cardText1b.className = "card-text";
	cardText1b.id = id + "-bunsetsu";
	cardText1b.innerText = card.bunsetsu;
	cardContents.appendChild(cardText1b); //the bunsetsu
	var cardText1c = document.createElement("p");
	cardText1c.className = "card-text";
	cardText1c.id = id + "-base";
	cardText1c.innerText = card.base;
	cardContents.appendChild(cardText1c); //the base
	var cardText1d = document.createElement("p");
	cardText1d.className = "card-text";
	cardText1d.id = id + "-pos";
	cardText1d.innerText = card.pos;
	cardContents.appendChild(cardText1d); //the pos
	var cardText2 = document.createElement("p");
	cardText2.className = "card-text";
	cardText2.id = id + "-tran";
	cardText2.innerText = card.tran;
	cardContents.appendChild(cardText2); //the translation
	var cardText3 = document.createElement("p");
	cardText3.className = "card-text";
	cardText3.id = id + "-audio";
	cardContents.appendChild(cardText3);
		var cardAudio = document.createElement("button");
		cardAudio.className = "btn";
		cardAudio.innerHTML = '<i class="fas fa-volume-up"></i>';
		// cardAudio.onclick = function() {
		// 	var snd = new Audio("data:audio/ogg;base64," + card.audio);
		// 	snd.play();
		// };
		cardAudio.addEventListener('click', function () {
			var snd = new Audio("data:audio/ogg;base64," + card.audio);
			snd.play();
		}, false);
		cardText3.appendChild(cardAudio); //the audio
		var cardAudioText = document.createElement("span");
		cardAudioText.innerText = card.audioText;
		cardText3.appendChild(cardAudioText);
	if ('mean' in card) {
		var cardText4 = document.createElement("p");
		cardText4.className = "card-text text-center";
		cardText4.id = id + "-stat";
		const sdPrint = Math.round(card.sd * 10) / 10;
		cardText4.innerText = "This card is level " + Math.floor(card.mean) + " and accuracy " + sdPrint + ".";
		cardContents.appendChild(cardText4); //the stats
	}
	return(true);
}

function displayCardEdit(id, key, card) {
	//remove edit buttons from all other cards
	var editButtons = document.querySelectorAll('[id$="-controls"]');
	editButtons.forEach(function(value, index) {
		if (value.id != id + "-controls") {
			editButtons[index].remove();
		}
	});
	
	//replace id-controls edit button with save button
	var existingControls = document.getElementById(id + "-controls");
	while (existingControls.hasChildNodes()) {  
	  existingControls.removeChild(existingControls.firstChild);
	} //remove all controls first
	var newSaveButton = document.createElement("button");
	newSaveButton.className = "btn btn-success";
	newSaveButton.innerText = "Save Changes";
	// newSaveButton.onclick = function() {
	// 	card.read = document.getElementById(id + "-newRead").value;
	// 	card.bunsetsu = document.getElementById(id + "-newBunsetsu").value;
	// 	card.base = document.getElementById(id + "-newBase").value;
	// 	card.pos = document.getElementById(id + "-newPos").value;
	// 	card.tran = document.getElementById(id + "-newTran").value;
	// 	card.audioText = document.getElementById(id + "-newAudioText").value;
	// 	card.audio = document.getElementById(id + "-oggString").getAttribute("data-string");
	// 	actionSaveEdits(id, key, card);
	// } //save edit event by parsing all input values
	newSaveButton.addEventListener('click', function () {
		card.read = document.getElementById(id + "-newRead").value;
		card.bunsetsu = document.getElementById(id + "-newBunsetsu").value;
		card.base = document.getElementById(id + "-newBase").value;
		card.pos = document.getElementById(id + "-newPos").value;
		card.tran = document.getElementById(id + "-newTran").value;
		card.audioText = document.getElementById(id + "-newAudioText").value;
		card.audio = document.getElementById(id + "-oggString").getAttribute("data-string");
		actionSaveEdits(id, key, card);
	}, false);
	var newCancelButton = document.createElement("button");
	newCancelButton.className = "btn btn-warning ml-4";
	newCancelButton.innerText = "Cancel";
	// newCancelButton.onclick = function() { getDeck(); } //cancel "edit cards" event by reloading the deck
	newCancelButton.addEventListener('click', function() {
		getDeck();
	}); //cancel "edit cards" event by reloading the deck
	//add new buttons to existingControls
	var editP = document.createElement("p");
	editP.className = "col text-left";
	existingControls.appendChild(editP);
	editP.appendChild(newSaveButton);	
	editP.appendChild(newCancelButton);

	//replace id-read, id-bunsetsu, id-base, id-tran and id-audio with input fields
	var newReadInput = document.createElement("input");
	newReadInput.className = "form-control";
	newReadInput.setAttribute("type", "text");
	newReadInput.id = id + "-newRead";
	newReadInput.name = "newRead";
	var existingRead = document.getElementById(id + "-read");
	newReadInput.defaultValue = existingRead.innerText;
	existingRead.innerText = "";
	existingRead.appendChild(newReadInput); //replace text in p for reading [id=id+"-read"] with input [id=id+"-newRead"]
	var newBunsetsuInput = document.createElement("input");
	newBunsetsuInput.className = "form-control";
	newBunsetsuInput.setAttribute("type", "text");
	newBunsetsuInput.id = id + "-newBunsetsu";
	newBunsetsuInput.name = "newBunsetsu";
	var existingBunsetsu = document.getElementById(id + "-bunsetsu");
	newBunsetsuInput.defaultValue = existingBunsetsu.innerText;
	existingBunsetsu.innerText = "";
	existingBunsetsu.appendChild(newBunsetsuInput); //replace text in p for reading [id=id+"-bunsetsu"] with input [id=id+"-newBunsetsu"]
	var newBaseInput = document.createElement("input");
	newBaseInput.className = "form-control";
	newBaseInput.setAttribute("type", "text");
	newBaseInput.id = id + "-newBase";
	newBaseInput.name = "newBase";
	var existingBase = document.getElementById(id + "-base");
	newBaseInput.defaultValue = existingBase.innerText;
	existingBase.innerText = "";
	existingBase.appendChild(newBaseInput); //replace text in p for reading [id=id+"-base"] with input [id=id+"-newBase"]
	var newPosInput = document.createElement("input");
	newPosInput.className = "form-control";
	newPosInput.setAttribute("type", "text");
	newPosInput.id = id + "-newPos";
	newPosInput.name = "newPos";
	var existingPos = document.getElementById(id + "-pos");
	newPosInput.defaultValue = existingPos.innerText;
	existingPos.innerText = "";
	existingPos.appendChild(newPosInput); //replace text in p for reading [id=id+"-pos"] with input [id=id+"-newPos"]
	//replace id-tran
	var newTranInput = document.createElement("input");
	newTranInput.className = "form-control";
	newTranInput.setAttribute("type", "text");
	newTranInput.id = id + "-newTran";
	newTranInput.name = "newTran";
	var existingTran = document.getElementById(id + "-tran");
	newTranInput.defaultValue = existingTran.innerText;
	existingTran.innerText = "";
	existingTran.appendChild(newTranInput); //replace text in p for translation [id=id+"-tran"] with input [id=id+"-newTran"]
	//replace id-audio
	var newAudioInputGroup = document.createElement("div");
	newAudioInputGroup.className = "input-group";
	var existingAudio = document.getElementById(id + "-audio");
	existingAudio.innerHTML = "";
	existingAudio.appendChild(newAudioInputGroup);
		var newAudioPrepend = document.createElement("div");
		newAudioInputGroup.appendChild(newAudioPrepend);
		newAudioPrepend.className = "input-group-prepend";
			var newAudioButton = document.createElement("button");
			newAudioButton.className = "btn";
			newAudioButton.id = id + "-audioText-but";
			newAudioButton.innerHTML = '<i class="fas fa-volume-up" id="audioText-speaker"></i>';
			// newAudioButton.onclick = function() {
			// 	ttsRequest(document.getElementById(id + "-newAudioText").value, function(data) {
			// 		var snd = new Audio("data:audio/ogg;base64," + data.audioContent);
			// 		snd.play();
			// 		document.getElementById(id + "-oggString").setAttribute("data-string", data.audioContent);
			// 	});
			// };
			newAudioButton.addEventListener('click', function() {
				ttsRequest(document.getElementById(id + "-newAudioText").value, function(data) {
					var snd = new Audio("data:audio/ogg;base64," + data.audioContent);
					snd.play();
					document.getElementById(id + "-oggString").setAttribute("data-string", data.audioContent);
				});
			});
			newAudioPrepend.appendChild(newAudioButton);
		var newAudioInput = document.createElement("input");
		newAudioInput.className = "form-control";
		newAudioInput.setAttribute("type", "text");
		newAudioInput.id = id + "-newAudioText";
		newAudioInput.name = "newAudioText";
		newAudioInput.defaultValue = card.audioText;
		newAudioInputGroup.appendChild(newAudioInput); //replace text in p for audio [id=id+"-audio"] with div containing [id=id+"-newAudioText"]
		var newAudioOgg = document.createElement("div");
		newAudioOgg.id = id + "-oggString";
		newAudioOgg.setAttribute("data-string", card.audio);
		newAudioInputGroup.appendChild(newAudioOgg);
}

//delete the key/value pair in storage, delete DOM elements and display removed message
function actionCardDelete(divId, key) {
	chrome.storage.local.remove([key], function() {
		var error = chrome.runtime.lastError;
			if (error) {
	        console.error(error);
			} else {
				//remove DOM card body contents
				var parentDiv = document.getElementById(divId);
				while (parentDiv.hasChildNodes()) {  
					parentDiv.removeChild(parentDiv.firstChild);
				}
				var clearTitle = document.createElement("h4");
				clearTitle.className = "card-title text-danger";
				clearTitle.innerText = "Card is deleted FOREVER.";
				parentDiv.appendChild(clearTitle);
		}
	});
}

//save over value for a given key
function actionSaveEdits(id, key, card) {
	//rouchly check inputs
	var stripChars = /[。.\s]+$/g;
	card.read = card.read.replace(stripChars, "");
	card.bunsetsu = card.bunsetsu.replace(stripChars, "");
	card.base = card.base.replace(stripChars, "");
	card.pos = card.pos.replace(stripChars, "");
	card.tran = card.tran.replace(stripChars, "");
	card.audioText = card.audioText.replace(stripChars, "");
	if (card.read.length == 0 || card.bunsetsu.length == 0 || card.base.length == 0 || card.tran.length == 0 || card.audioText.length == 0) {
		alert("Some card data is missing");
		return false;
	}
	//use card.audioText to update card.audio and then save card
	ttsRequest(card.audioText, function(audioJSON) {
		if (audioJSON.length == 0) {
			alert("Unable to get tts audio");
		} else {
			card.audio = audioJSON.audioContent;
			updateCard(key, card);
			//on successful edit, remove DOM card body contents
			var parentDiv = document.getElementById(id);
			while (parentDiv.hasChildNodes()) {  
				parentDiv.removeChild(parentDiv.firstChild);
			}
			var clearTitle = document.createElement("h4");
			clearTitle.className = "card-title text-success"
			clearTitle.innerText = "Changes saved. Reload page to see edited card.";
			parentDiv.appendChild(clearTitle);
		}
	})
}

//when page is loaded, display cards from chrome.storage.local
window.addEventListener("load", function() {
	getDeck();
}, false);

//chrome.storage.local.get(null, function(result) { console.log(result); });