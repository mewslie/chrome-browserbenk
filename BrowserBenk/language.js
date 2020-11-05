var service1, service2, service3;

function toKanaAuto(toKanaString) {
	//var toKanaString = document.getElementById("jp").value;
	if (toKanaString.length == 0) {
		//can not accept empty string
		document.getElementById("output").innerHTML = "Can not convert empty string to kana";
	} else {
		yahooRequest(toKanaString, function(data) {
			const reading = data.getElementsByTagName("reading"); //hiragana only
			const pos = data.getElementsByTagName("pos"); //POS names (in jp)
			const kanji = data.getElementsByTagName("surface"); //original string
			const baseForm = data.getElementsByTagName("baseform"); //base form of verbs and adjectives
			//get the actual string values
			var readingText = new Array();
			var posText = new Array();
			var kanjiText = new Array();
			var baseText = new Array();
			for (i = 0; i < reading.length; i++) {
				readingText.push(reading[i].childNodes[0].nodeValue);
				posText.push(pos[i].childNodes[0].nodeValue);
				kanjiText.push(kanji[i].childNodes[0].nodeValue);
				baseText.push(baseForm[i].childNodes[0].nodeValue);
			}
			//join readingText elements to make bunsetsu
			var bunsetsu = new Array(); //bunsetsu in hiragana only
			var bunsetsuTemp = "";
			var bunsetsuKanji = new Array(); //bunsetsu in kanji/hiragana
			var bunsetsuKanjiTemp = "";
			// var bunsetsuBaseForm = new Array(); //bunsetsu with verbs/adj in base form
			// var bunsetsuBaseFormTemp = "";
			for (i = 0; i < posText.length; i++) {
				if ((["助詞","助動詞","特殊","接尾辞"].some(v => posText[i].includes(v)))) {
					if (i == 0) {
						bunsetsu.push(bunsetsuTemp);
						bunsetsuTemp = readingText[i];
						bunsetsuKanji.push(bunsetsuKanjiTemp);
						bunsetsuKanjiTemp = kanjiText[i];
					} else {
						bunsetsuTemp += readingText[i];
						bunsetsuKanjiTemp += kanjiText[i];
						// bunsetsuBaseFormTemp += baseFormText[i];	
					}
				} else {
					bunsetsu.push(bunsetsuTemp);
					bunsetsuTemp = readingText[i];
					bunsetsuKanji.push(bunsetsuKanjiTemp);
					bunsetsuKanjiTemp = kanjiText[i];
					// bunsetsuBaseForm.push(bunsetsuBaseFormTemp);
					// bunsetsuBaseFormTemp = baseFormText[i];
				}
				if (i+1 == posText.length) {
					bunsetsu.push(bunsetsuTemp);
					bunsetsuKanji.push(bunsetsuKanjiTemp);
					// bunsetsuBaseForm.push(bunsetsuBaseFormTemp);
				}
			}
			bunsetsu.shift(); //remove the first empty element
			bunsetsuKanji.shift();
			// bunsetsuBaseForm.shift();
			document.getElementById("read").value = bunsetsu.join(" ");
			document.getElementById("bunsetsu").value = bunsetsuKanji.join(" ");
			document.getElementById("base").value = baseText.join(" ");
			document.getElementById("pos").value = posText.join(" ");
		});
	}
}

function yahooRequest(requestText, callback) {
	var yhRequest = new XMLHttpRequest();
	yhRequest.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			//success
			var xmlText = yhRequest.responseXML;
			callback(xmlText);
		} else {
			//loading or error
		}
	}
	var myRequest = requestText;
	if (myRequest.length == 0) {
		//error
		alert("Can not make request to Yahoo with empty string");
	} else {
		//send request
		yhRequest.open("GET", "http://jlp.yahooapis.jp/MAService/V1/parse?appid=" + service1 + "&results=ma&response=surface,reading,pos,baseform&sentence=" + myRequest, true);
		yhRequest.withCredentials = true;
		//yhRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		yhRequest.send();
	}
}

function toAudioAuto(toAudioString) {
	//var toAudioString = (document.getElementById("tts").value.length > 0) ? document.getElementById("tts").value:document.getElementById("jp").value;
	// document.getElementById("output").innerHTML += "button pressed2";
	if (toAudioString.length == 0) {
		//can not accept empty string
		document.getElementById("output").innerHTML = "Can not convert empty string to audio";
	} else {
		//document.getElementById("tts").value = toAudioString;
		ttsRequest(toAudioString, function(data) {
			var snd = new Audio("data:audio/ogg;base64," + data.audioContent);
			snd.play();
			// document.getElementById("output").innerHTML += "Played audio";
			document.getElementById("oggString").setAttribute("data-string", data.audioContent);
		});
	}
}

function ttsRequest(requestText, callback) {
	var ttsRequest = new XMLHttpRequest();
	ttsRequest.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			//success
			var textResponse = JSON.parse(ttsRequest.responseText);
			callback(textResponse);
		} else {
			//loading or error
		}
	}
	var myRequest = requestText;
	if (myRequest.length == 0) {
		//error
		alert("Can not make request to Google TTS with empty string");
	} else {
		//send request
		var audioVoice = "ja-JP-Wavenet-A";
		//options: ja-JP-Standard-A ja-JP-Standard-B ja-JP-Standard-C ja-JP-Standard-D
		//A and B are female C and D are male
		//waveNet options: ja-JP-Wavenet-A
		var toAudioText = JSON.stringify( {
			"input": {
				"text":myRequest
			},
			"voice": {
				"languageCode":"ja-JP",
				"name":audioVoice,
				"ssmlGender":"FEMALE"
			},
			"audioConfig": {
				"audioEncoding":"MP3"
			},
		});
		ttsRequest.open("POST", "https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=" + service2, true);
		ttsRequest.send(toAudioText);
		// document.getElementById("output").innerHTML += "sent audio";
	}
}

function gTranslateAuto(toEigoString) {
	//var toEigoString = document.getElementById("jp").value;
	if (toEigoString.length == 0) {
		//can not accept empty string
		document.getElementById("output").innerHTML = "Can not convert empty string to English";
	} else {
		translateRequest(toEigoString, function(data) {
			const returned = data.translatedText;
			const rmAscii = returned.replace(/&#39;/g, "'");
			document.getElementById("tran").value = rmAscii.toLowerCase();
		});
	}
}

function translateRequest(requestText, callback) {
	var trRequest = new XMLHttpRequest();
	trRequest.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			//success
			var jsText = JSON.parse(this.responseText);
			var jasonData = jsText.data;
			var jasonTrans = jasonData.translations[0];
			callback(jasonTrans);
		} else {
			//loading or error
		}
	}
	trRequest.open("POST", "https://translation.googleapis.com/language/translate/v2?q=" + requestText + "&target=en&key=" + service3, true);
	trRequest.send();
}

function autoFill() {
	const mainText = document.getElementById("jp").value.replace(/[。.\s]+$/g, "");
	document.getElementById("jp").value = mainText;
	if (mainText.length > 0) {
		//for transcription, words and base form rows
		toKanaAuto(mainText);
		if (document.getElementById("bunsetsu").length < 3) {
			document.getElementById("output").innerHTML = "Sentence is too short!";
		} else {
			document.getElementById("read").disabled = false; //enable text input
			document.getElementById("bunsetsu").disabled = false;
			document.getElementById("base").disabled = false;
			document.getElementById("pos").disabled = false;
	
			//for audio row
			document.getElementById("audioText").value = mainText;
			document.getElementById("audioText").disabled = false; //enable text input
			ttsRequest(mainText, function(data) {
				document.getElementById("oggString").setAttribute("data-string", data.audioContent);
			}); //set initial (hidden) oggString on mainText
			document.getElementById("audioText-but").disabled = false; //enable button
			document.getElementById("audioText-speaker").classList.remove("text-muted"); //blacken speaker icon
			document.getElementById("audioText-speaker").addEventListener("click", function() {
				// document.getElementById("output").innerHTML += "button pressed1";
				toAudioAuto(document.getElementById("audioText").value);
			}, false); //add EventListener to speaker icon to play sound in audioText
	
			//for translation
			document.getElementById("tran").disabled = false; //enable text input
			gTranslateAuto(mainText);	
		}
	} else {
		//can not accept empty string
		document.getElementById("output").innerHTML = "Can not apply auto-fill on empty string";
	}
}

function validateNewCard() {
	//get all text
	var jpString = document.getElementById("jp").value;
	var audioTextString = document.getElementById("audioText").value;
	var audioString = document.getElementById("oggString").getAttribute("data-string");
	var readString = document.getElementById("read").value;
	var bunsetsuString = document.getElementById("bunsetsu").value;
	var baseString = document.getElementById("base").value;
	var posString = document.getElementById("pos").value;
	var tranString = document.getElementById("tran").value;
	//remove unnecessary characters
	var stripChars = /[。.\s]+$/g;
	jpString = jpString.replace(stripChars, "");
	audioTextString = audioTextString.replace(stripChars, "");
	readString = readString.replace(stripChars, "");
	bunsetsuString = bunsetsuString.replace(stripChars, "");
	baseString = baseString.replace(stripChars, "");
	posString = posString.replace(stripChars, "");
	tranString = tranString.replace(stripChars, "");

	//check for empty strings
	var empty = 0;
	if (jpString.length == 0) {
		empty = 1;
	} else if (audioTextString.length == 0) {
		empty = 1;
	} else if (audioString.length == 0) {
		empty = 1;
	} else if (readString.length == 0) {
		empty = 1;
	} else if (bunsetsuString.length == 0) {
		empty = 1;
	} else if (baseString.length == 0) {
		empty = 1;
	} else if (posString.length == 0) {
		empty = 1;	
	} else if (tranString.length == 0) {
		empty = 1;
	}

	//check for japanese
	var japanese = 1;
	if (!isJapanese(jpString)) {
		japanese = 0;
	} else if (!isJapanese(audioTextString)) {
		japanese = 0;
	}
	
	//save in chrome.storage.local
	if (!empty & japanese) {
		var newCard = {
			"audioText": audioTextString,
			"audio": audioString,
			"read": readString,
			"bunsetsu": bunsetsuString,
			"base": baseString,
			"pos": posString,
			"tran": tranString
		};
		actionNewCard(jpString, newCard);
	} else {
		document.getElementById("output").innerHTML = 'Invalid input. Please check the fields again!';
	}
	
	return false;	
}

async function actionNewCard(key, newCard) {
	//save newCard with key
	await chrome.storage.local.get({[key]: 0}, function(card) {
		if (card[key] == 0) {
			// const mainText = document.getElementById("jp");
			//if newCard doesn't exist add to local storage, display message and wipe inputs
			chrome.storage.local.set({[key]: JSON.stringify(newCard)});
			document.getElementById("output").innerHTML = 'Saved new card. View it in <a href="deck.html">the deck</a>.';
			document.getElementById("jp").removeAttribute("disabled"); //enable text input
			// ttsRequest(mainText, function(data) {
			// 	document.getElementById("oggString").setAttribute("data-string", data.audioContent);
			// }); //set initial (hidden) oggString on mainText
			document.getElementById("jp").disabled = true; //disable everything
			document.getElementById("audioText").disabled = true;
			document.getElementById("audioText-but").disabled = true;
			document.getElementById("read").disabled = true;
			document.getElementById("bunsetsu").disabled = true;
			document.getElementById("base").disabled = true;
			document.getElementById("pos").disabled = true;
			document.getElementById("tran").disabled = true;
		} else {
			document.getElementById("output").innerHTML = 'This card is already saved. Check <a href="deck.html">the deck</a>.';
		}
	})

}

//boolean test to see if string contains Japanese characters
function isJapanese(text) {
	var pHiragana = "[\\u3041-\\u3096\\u309D-\\u309F]|\\uD82C\\uDC01|\\uD83C\\uDE00";
	var pKatakana = "[\\u30A1-\\u30FA\\u30FD-\\u30FF\\u31F0-\\u31FF\\u32D0-\\u32FE\\u3300-\\u3357\\uFF66-\\uFF6F\\uFF71-\\uFF9D]|\\uD82C\\uDC00";
	var pHan = "[\\u2E80-\\u2E99\\u2E9B-\\u2EF3\\u2F00-\\u2FD5\\u3005\\u3007\\u3021-\\u3029\\u3038-\\u303B\\u3400-\\u4DB5\\u4E00-\\u9FD5\\uF900-\\uFA6D\\uFA70-\\uFAD9]|[\\uD840-\\uD868\\uD86A-\\uD86C\\uD86F-\\uD872][\\uDC00-\\uDFFF]|\\uD869[\\uDC00-\\uDED6\\uDF00-\\uDFFF]|\\uD86D[\\uDC00-\\uDF34\\uDF40-\\uDFFF]|\\uD86E[\\uDC00-\\uDC1D\\uDC20-\\uDFFF]|\\uD873[\\uDC00-\\uDEA1]|\\uD87E[\\uDC00-\\uDE1D]";
	var rx = new RegExp("([\\w-]|" + pHiragana + "|" + pKatakana + "|" + pHan + ")+");
	return rx.test(text);
}

function loadServices() {
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		var fileContents = JSON.parse(this.response);
		service1 = fileContents.yahoo;
		service2 = fileContents.googletts;
		service3 = fileContents.googletrans;
	};
	xhr.open('GET', chrome.extension.getURL('settings/services.json'), true);
	xhr.send();
}

document.addEventListener('DOMContentLoaded', function () {
	loadServices();

	var addAutoFillLink = document.getElementById('autofill');
	if (document.body.contains(addAutoFillLink)) {
		addAutoFillLink.addEventListener('click', function () {
			autoFill();		
		}, false);	
	}
	
	var addValidationLink = document.getElementById('validatecard');
	if (document.body.contains(addValidationLink)) {
		addValidationLink.addEventListener('click', function () {
			validateNewCard();
		}, false);
	}
}, false);

//document.getElementById("eigo").value = testResponse.audioContent;
