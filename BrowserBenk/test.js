//display the iter'th item in cards in order
function displayTest(cards, order, types, iter) {
    //clear testdisplay first
    const cardParent = document.getElementById("testdisplay");
    while (cardParent.hasChildNodes()) {  
        cardParent.removeChild(cardParent.firstChild);
    }

    //establish which test to display
    const thisCardInd = order[iter];
    const thisCard = cards[thisCardInd];
    const thisType = types[iter];
    // console.log("no. " + iter + "; type " + thisType + "; card no. " + thisCardInd);

    //tests are contained in testdisplay and wrapped in
	//	a card div
	//		a card-body [thisCard.jp]
	//			a card-title h4
	//			a card-text p
	const cardDiv = document.createElement("div");
	cardDiv.className = "card rounded-card";
	document.getElementById("testdisplay").appendChild(cardDiv);
	const cardBodyDiv = document.createElement("div");
    cardBodyDiv.className = "card-body";
    cardBodyDiv.id = thisCard.jp;
    cardDiv.appendChild(cardBodyDiv);

    //display answer depending on thisType
    switch (thisType) {
        case 0:
            // console.log("test0");
            var answers = readingsMultichoice(cards, thisCardInd); //5 randomly ordered answers, 1 correct
            // console.log("got answers test0 " + answers.length);
            var answersIds = initializeTest0(thisCard, answers); //display the question and answers, div ids of answers
            // console.log("rendered test0");
            setOnclick(answersIds, cards, order, types, iter,); //set the onclick action of each answer
            // console.log("set actions test0");
            break;
        case 1:
            // console.log("test1");
            var answers = kanjiMultichoice(cards, thisCardInd); //5 randomly ordered answers, 1 correct
            // console.log("got answers test1 " + answers.length);
            var answersIds = initializeTest1(thisCard, answers); //display the question and answers, div ids of answers
            // console.log("rendered test1");
            setOnclick(answersIds, cards, order, types, iter); //set the onclick action of each answer
            // console.log("set actions test1");
            break;
        case 2:
            // console.log("test2");
            var answers = kanjiMultichoice(cards, thisCardInd); //5 randomly ordered answers, 1 correct
            // console.log("got answers test2 " + answers.length);
            var answersIds = initializeTest2(thisCard, answers); //display the question and answers, div ids of answers
            // console.log("rendered test2");
            setOnclick(answersIds, cards, order, types, iter); //set the onclick action of each answer
            // console.log("set actions test2");
            break;
        case 3:
            // console.log("test3");
            var bunsetsuLength = thisCard.bunsetsu.split(" ");
            var missingNum = randomInteger(1, Math.floor(bunsetsuLength.length / 2));
            var answers = bunsetsuMultichoice(cards, thisCardInd, missingNum); //select random parts of sentence
            // console.log("got answers test3 " + answers.length);
            var qa = getQA(thisCard, answers);
            var answersIds = initializeTest3(thisCard, qa, answers); //display the question and answers, div ids of answers
            // console.log("rendered test3");
            setOnclick(answersIds, cards, order, types, iter, qa); //set the onclick action of each answer
            // console.log("set actions test3");
            break;
        case 4:
            // console.log("test4");
            var bunsetsuLength = thisCard.bunsetsu.split(" ");
            var missingNum = randomInteger(Math.floor(bunsetsuLength.length / 2), bunsetsuLength.length - 1);
            var answers = bunsetsuMultichoice(cards, thisCardInd, missingNum); //select random parts of sentence
            // console.log("got answers test4 " + answers.length);
            var qa = getQA(thisCard, answers);
            var answersIds = initializeTest3(thisCard, qa, answers); //display the question and answers, div ids of answers
            // console.log("rendered test4");
            setOnclick(answersIds, cards, order, types, iter, qa); //set the onclick action of each answer
            // console.log("set actions test4");
            break;
        case 5:
            // console.log("test5");
            var answers = bunsetsuSentence(cards, thisCardInd); //break up all parts of sentence
            // console.log("got answers test5 " + answers.length);
            var answersIds = initializeTest4(thisCard, answers); //display the question and answers, div ids of answers
            // console.log("rendered test5");
            setOnclick(answersIds, cards, order, types, iter); //set the onclick action of each answer
            // console.log("set actions test5");
            break;
        case 6:
            // console.log("test6");
            var answers = bunsetsuSentence(cards, thisCardInd); //break up all parts of sentence
            // console.log("got answers test6 " + answers.length);
            var answersIds = initializeTest5(thisCard, answers); //display the question and answers, div ids of answers
            // console.log("rendered test6");
            setOnclick(answersIds, cards, order, types, iter); //set the onclick action of each answer
            // console.log("set actions test6");
            break;
        default:
            cardBodyDiv.innerText = "No test: thisType is " + thisType;
    }
}


//run test0: kanji/english -> multichoice readings, returns the div ids with answers
function initializeTest0(thisCard, answers) {
    //display the kanji/english in card-title and card-text
    var kanjiTitle = document.createElement("h4");
    kanjiTitle.className = "card-title mt-4 mb-4";
    kanjiTitle.innerText = thisCard.jp;
    document.getElementById(thisCard.jp).appendChild(kanjiTitle);
    var eigoP = document.createElement("p");
    eigoP.className = "card-text mt-4 mb-4";
    eigoP.innerText = thisCard.tran;
    document.getElementById(thisCard.jp).appendChild(eigoP);

    //display question and answers
    var questP = document.createElement("p");
    questP.className = "card-text font-weight-bold mt-5";
    questP.innerText = "What is the correct reading?";
    document.getElementById(thisCard.jp).appendChild(questP);
    var choiceDiv = document.createElement("div");
    choiceDiv.className = "list-group";
    document.getElementById(thisCard.jp).appendChild(choiceDiv);

    //display the choices and return their ids
    const choiceList = new Array();
    for (i = 0; i < answers.length; i++) {
        var choice = document.createElement("a");
        choice.className = "list-group-item list-group-item-action list-group-item-dark";
        choice.innerText = answers[i];
        choice.href = "javascript:;";
        choice.id = "choice"+(i+1);
        choiceDiv.appendChild(choice);
        choiceList.push("choice"+(i+1));
    }
    return choiceList;
}

//run test1: english -> multichoice kanji, returns the div ids with answers
function initializeTest1(thisCard, answers) {
    //display the english in card-title and card-text
    var eigoTitle = document.createElement("h4");
    eigoTitle.className = "card-title mt-4 mb-4";
    eigoTitle.innerText = thisCard.tran;
    document.getElementById(thisCard.jp).appendChild(eigoTitle);

    //display question and answers
    var questP = document.createElement("p");
    questP.className = "card-text font-weight-bold mt-5";
    questP.innerText = "What is the correct Japanese text?";
    document.getElementById(thisCard.jp).appendChild(questP);
    var choiceDiv = document.createElement("div");
    choiceDiv.className = "list-group";
    document.getElementById(thisCard.jp).appendChild(choiceDiv);

    //display the choices and return their ids
    const choiceList = new Array();
    for (i = 0; i < answers.length; i++) {
        var choice = document.createElement("a");
        choice.className = "list-group-item list-group-item-action list-group-item-dark";
        choice.innerText = answers[i];
        choice.href = "javascript:;";
        choice.id = "choice"+(i+1);
        choiceDiv.appendChild(choice);
        choiceList.push("choice"+(i+1));
    }
    return choiceList;
}

//run test2: audio -> multichoice kanji, returns the div ids with answers
function initializeTest2(thisCard, answers) {
    //display the english in card-title and card-text
    var audioTitle = document.createElement("p");
    audioTitle.className = "card-title mt-4 mb-4";
    audioTitle.innerText = "Click to play audio";
    document.getElementById(thisCard.jp).appendChild(audioTitle);

    var audioButton = document.createElement("p");
    audioButton.className = "card-text text-center display-4 mt-3";
    audioButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    audioButton.addEventListener('click', function() {
        var snd = new Audio("data:audio/ogg;base64," + thisCard.audio);
        snd.play();
    });
    document.getElementById(thisCard.jp).appendChild(audioButton); //the audio

    //display question and answers
    var questP = document.createElement("p");
    questP.className = "card-text font-weight-bold mt-5";
    questP.innerText = "What is the correct Japanese text?";
    document.getElementById(thisCard.jp).appendChild(questP);
    var choiceDiv = document.createElement("div");
    choiceDiv.className = "list-group";
    document.getElementById(thisCard.jp).appendChild(choiceDiv);

    //display the choices and return their ids
    const choiceList = new Array();
    for (i = 0; i < answers.length; i++) {
        var choice = document.createElement("a");
        choice.className = "list-group-item list-group-item-action list-group-item-dark";
        choice.innerText = answers[i];
        choice.href = "javascript:;";
        choice.id = "choice"+(i+1);
        choiceDiv.appendChild(choice);
        choiceList.push("choice"+(i+1));
    }
    return choiceList;
}

//run test3,4,5: missing kanji -> multichoice kanji parts partial sentence, returns the div ids with answers
function initializeTest3(thisCard, qa, answers) {
     //display the japanese and english in card-title and card-text
     var jpTitle = document.createElement("h4");
     jpTitle.id = "question";
     jpTitle.className = "card-title mt-4 mb-4";
     jpTitle.innerText = qa[0].join("");
     document.getElementById(thisCard.jp).appendChild(jpTitle);
     var englishText = document.createElement("div");
     englishText.className = "card-text";
     englishText.innerText = thisCard.tran;
     document.getElementById(thisCard.jp).appendChild(englishText);
 
     //display question and answers [top choices ie clicked "on", bottom choices ie clicked "off"]
     var questP = document.createElement("p");
     questP.className = "card-text font-weight-bold mt-5";
     questP.innerText = "Fill in the gaps";
     document.getElementById(thisCard.jp).appendChild(questP);
     var displayInput = document.createElement("div");
     displayInput.className = "card-text rounded-answers";
     displayInput.id = "top-choices";
     //displayInput.setAttribute("style", "white-space: pre-wrap;");
     document.getElementById(thisCard.jp).appendChild(displayInput);
     var choiceDiv = document.createElement("div");
     choiceDiv.className = "card-text";
     choiceDiv.id = "bottom-choices";
     document.getElementById(thisCard.jp).appendChild(choiceDiv);

    //display the choices in the bottom by default
    const choiceList = new Array();
    for (i = 0; i < answers.length; i++) {
        var choice = document.createElement("button");
        choice.className = "btn";
        choice.innerText = answers[i];
        choice.id = "choice"+(i+1);
        choiceDiv.appendChild(choice);
        choiceList.push("choice"+(i+1));
    }
    return choiceList;
}

//run test4: audio -> multichoice kanji parts full sentence, returns the div ids with answers
function initializeTest4(thisCard, answers) {
    //display the play button in card-title and card-text
    var audioTitle = document.createElement("p");
    audioTitle.className = "card-title mt-4 mb-4";
    audioTitle.innerText = "Click to play audio";
    document.getElementById(thisCard.jp).appendChild(audioTitle);

    var audioButton = document.createElement("p");
    audioButton.className = "card-text text-center display-4 mt-3";
    audioButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    audioButton.addEventListener('click', function() {
        var snd = new Audio("data:audio/ogg;base64," + thisCard.audio);
        snd.play();
    });
    document.getElementById(thisCard.jp).appendChild(audioButton); //the audio
    var answerDisplay = document.createElement("div");
    answerDisplay.className = "card-text mt-4 mb-4";
    answerDisplay.id = "question";
    document.getElementById(thisCard.jp).appendChild(answerDisplay);

     //display question and answers [top choices ie clicked "on", bottom choices ie clicked "off"]
     var questP = document.createElement("p");
     questP.className = "card-text font-weight-bold mt-5";
     questP.innerText = "Input words in the order you hear them";
     document.getElementById(thisCard.jp).appendChild(questP);
     var displayInput = document.createElement("div");
     displayInput.className = "card-text rounded-answers";
     displayInput.id = "top-choices";
     //displayInput.setAttribute("style", "white-space: pre-wrap;");
     document.getElementById(thisCard.jp).appendChild(displayInput);
     var choiceDiv = document.createElement("div");
     choiceDiv.className = "card-text";
     choiceDiv.id = "bottom-choices";
     document.getElementById(thisCard.jp).appendChild(choiceDiv);

    //display the choices in the bottom by default
    const choiceList = new Array();
    for (i = 0; i < answers.length; i++) {
        var choice = document.createElement("button");
        choice.className = "btn";
        choice.innerText = answers[i];
        choice.id = "choice"+(i+1);
        choiceDiv.appendChild(choice);
        choiceList.push("choice"+(i+1));
    }
    return choiceList;
}

//run test5: english -> multichoice kanji parts full sentence, returns the div ids with answers
function initializeTest5(thisCard, answers) {
    //display the english in card-title and card-text
    var eigoTitle = document.createElement("h4");
    eigoTitle.className = "card-title mt-4 mb-4";
    eigoTitle.innerText = thisCard.tran;
    document.getElementById(thisCard.jp).appendChild(eigoTitle);
    var answerDisplay = document.createElement("div");
    answerDisplay.className = "card-text mt-4 mb-4";
    answerDisplay.id = "question";
    document.getElementById(thisCard.jp).appendChild(answerDisplay);

    //display question and answers [top choices ie clicked "on", bottom choices ie clicked "off"]
    var questP = document.createElement("p");
    questP.className = "card-text font-weight-bold mt-5";
    questP.innerText = "Input words in order";
    document.getElementById(thisCard.jp).appendChild(questP);
    var displayInput = document.createElement("div");
    displayInput.className = "card-text rounded-answers";
    displayInput.id = "top-choices";
    //displayInput.setAttribute("style", "white-space: pre-wrap;");
    document.getElementById(thisCard.jp).appendChild(displayInput);
    var choiceDiv = document.createElement("div");
    choiceDiv.className = "card-text";
    choiceDiv.id = "bottom-choices";
    document.getElementById(thisCard.jp).appendChild(choiceDiv);

   //display the choices in the bottom by default
   const choiceList = new Array();
   for (i = 0; i < answers.length; i++) {
       var choice = document.createElement("button");
       choice.className = "btn";
       choice.innerText = answers[i];
       choice.id = "choice"+(i+1);
       choiceDiv.appendChild(choice);
       choiceList.push("choice"+(i+1));
   }
   return choiceList;
}

//make 5 multichoice readings; correct, closely correct, sort of correct, wrong1, wrong2
function readingsMultichoice(cards, thisCardInd) {
    const correctCard = cards[thisCardInd];
    const wrongCards = cards.filter(function(x) { return x !== correctCard; })
    //the correct answer
    const correct = correctCard.read;
    //check answer length; if the correct answer is too short, can't permute it
    const pseudo = correct.split(" ");
    if (pseudo.length < 4) {
        //but if correct only has 3 bunsetsu, then there are not enough for permutating a close answer
        //so make four random readings from wrongCards
        const r4 = randomPair(wrongCards.length-1, 4);
        var wrongs = r4.map(function(val) {
            const wrongStr = wrongCards[val].read;
            const wrongSpl = wrongStr.split(" ");
            if (wrongSpl.length < 3) {
                return wrongStr;
            } else {
                const wrongEle = randomPair(wrongSpl.length-1, 2);
                const wrongArray = wrongEle.map(function(val) { return wrongSpl[val]; });
                return wrongArray.join("");
            }
        });
        wrongs.push(correct);
        return shuffleArray(wrongs);
    } else {
        //the correct answer with two random readings swapped
        const r1 = randomPair(pseudo.length-1, 2);
        [pseudo[r1[0]], pseudo[r1[1]]] = [pseudo[r1[1]], pseudo[r1[0]]];
        //make the permuted reading; can't be the same as correct or pseudo
        var permuted = [...pseudo];
        while (permuted.join(" ") == pseudo.join(" ") || permuted.join(" ") == correct) {
            permuted = shuffleArray(permuted);
        }
        //then make two random readings from wrongCards
        const r2 = randomPair(wrongCards.length-1, 2);
        const wrong1 = wrongCards[r2[0]].read;
        const wrong2 = wrongCards[r2[1]].read;
        return shuffleArray([correct, pseudo.join(" "), permuted.join(" "), wrong1, wrong2]);
    }    
}

//make 5 multichoice kanji
function kanjiMultichoice(cards, thisCardInd) {
    const correctCard = cards[thisCardInd];
    const wrongCards = cards.filter(function(x) { return x !== correctCard; })
    //the correct answer
    const correct = correctCard.bunsetsu;
    const correctString = correctCard.jp;
    //the correct answer with two bunsetsu swapped
    const pseudo = correct.split(" ");
    if (pseudo.length < 4) {
        //but if correct only has 3 bunsetsu, then there are not enough for permutating a close answer
        //so make four random readings from wrongCards
        const r4 = randomPair(wrongCards.length-1, 4);
        var wrongs = r4.map(function(val) {
            const wrongStr = wrongCards[val].bunsetsu;
            const wrongSpl = wrongStr.split(" ");
            if (wrongSpl.length < 3) {
                return wrongStr;
            } else {
                const wrongEle = randomPair(wrongSpl.length-1, 2);
                const wrongArray = wrongEle.map(function(val) { return wrongSpl[val]; });
                return wrongArray.join("");
            }
        });
        wrongs.push(correctString);
        return shuffleArray(wrongs);
    } else {
        while (pseudo.join(" ") == correct) {
            var r1 = randomPair(pseudo.length-1, 2);
            [pseudo[r1[0]], pseudo[r1[1]]] = [pseudo[r1[1]], pseudo[r1[0]]];    
        }
        //the correct answer randomly permuted; can't be the same as correct or pseudo
        var permuted = [...pseudo];
        while (permuted.join(" ") == pseudo.join(" ") || permuted.join(" ") == correct) {
            permuted = shuffleArray(permuted);    
        }
        //two random readings from wrongCards
        const r2 = randomPair(wrongCards.length-1, 2);
        const wrong1 = wrongCards[r2[0]].jp;
        const wrong2 = wrongCards[r2[1]].jp;
        return shuffleArray([correctString, pseudo.join(""), permuted.join(""), wrong1, wrong2]);
    }
}

//make n*4 multichoice bunsetsu
function bunsetsuMultichoice(cards, thisCardInd, n) {
    const correctCard = cards[thisCardInd];
    const wrongCards = cards.filter(function(x) { return x !== correctCard; });
    //select the parts to fill in
    const correct = correctCard.bunsetsu.split(" ");
    const correctRead = correctCard.read.split(" ");
    if (n >= correct.length) {
        n = correct.length-1;
    } //at a minimum n needs to be less than the number of bunsetsu
    const correctAnswers = shuffleArray(correct).slice(0, n);
    //select n*4 wrong answers from wrongCards
    var wrongAnswers = new Array();
    var wrongRead = new Array();
    // console.log("bunsetsumultichoice start")
    while (wrongAnswers.length <= n*4) {
        const randCard = wrongCards[randomInteger(0,wrongCards.length-1)];
        const randBunsetsu = randCard.bunsetsu.split(" ");
        const randReading = randCard.read.split(" ");
        const selectInd = randomInteger(0,randBunsetsu.length-1);
        const selectAnswer = randBunsetsu[selectInd];
        const selectReading = randReading[selectInd];
        if (!wrongAnswers.includes(selectAnswer) && !correct.includes(selectAnswer) && !wrongRead.includes(selectReading) && !correctRead.includes(selectReading)) {
            wrongAnswers.push(selectAnswer);
            wrongRead.push(selectReading);
        }
    }
    // console.log(correctAnswers);
    // console.log(wrongAnswers);
    return shuffleArray(correctAnswers.concat(wrongAnswers));
}

//make n+5 multichoice bunsetsu
function bunsetsuSentence(cards, thisCardInd) {
    const correctCard = cards[thisCardInd];
    const wrongCards = cards.filter(function(x) { return x !== correctCard; });
    //select the parts to fill in
    const correctAnswers = correctCard.bunsetsu.split(" ");
    const correctRead = correctCard.read.split(" ");
    //select correctAnswers*2 wrong answers from wrongCards
    var wrongAnswers = new Array();
    var wrongRead = new Array();
    // console.log("bunsetsusentence start")
    while (wrongAnswers.length <= correctAnswers.length + 5) {
        const randCard = wrongCards[randomInteger(0,wrongCards.length-1)];
        const randBunsetsu = randCard.bunsetsu.split(" ");
        const randReading = randCard.read.split(" ");
        const selectInd = randomInteger(0,randBunsetsu.length-1);
        const selectAnswer = randBunsetsu[selectInd];
        const selectReading = randReading[selectInd];
        if (!wrongAnswers.includes(selectAnswer) && !correctAnswers.includes(selectAnswer) && !wrongRead.includes(selectReading) && !correctRead.includes(selectReading)) {
            wrongAnswers.push(selectAnswer);
        }
    }
    // console.log("bunsetsusentence end")
    return shuffleArray(correctAnswers.concat(wrongAnswers));
}

//make qa for test3
function getQA(thisCard, answers) {
    var thisBunsetsu = thisCard.bunsetsu.split(" ");
    var thisQuestion = [...thisBunsetsu];
    var thisAnswerArray = new Array(thisQuestion.length).fill("");
    answers.map(function(value) {
        const iBunsetsu = getAllIndexes(thisQuestion, value); //index of where this answer (value) is in the question (so far)
        if (iBunsetsu.length == 1) { //the answer is only in the sentence once
            thisQuestion[iBunsetsu[0]] = "[．．．]";
            thisAnswerArray[iBunsetsu[0]] = value;
        } else if (iBunsetsu.length > 1) { //the answer is in the sentence at multiple indexes
            const choosei = randomPair(iBunsetsu.length, 1); //pick one of the indexes
            thisQuestion[iBunsetsu[choosei]] = "[．．．]";
            thisAnswerArray[iBunsetsu[choosei]] = value;
        }
    });
    thisAnswerArray = thisAnswerArray.filter(function(ele) { 
        return ele != "";
    });
    return [thisQuestion, thisAnswerArray];
} //[0] is question [1] is answer in correct order

function setOnclick(answersIds, cards, order, types, iter, qa) {
    //establish the card being tested
    const thisCardInd = order[iter];
    const thisCard = cards[thisCardInd];
    const thisType = types[iter];
    //establish parameter change on correct/wrong answers
    const meanCorrect = thisCard.mean + 0.2 //increase mean by flat amount if correct
    const meanWrong = Math.max(0,Math.floor(thisCard.mean-1)); //use floor of previous mean if wrong
    const sdCorrect = thisCard.sd * 1.2 //increase(multiply) sd by size factor if correct
    const sdWrong = thisCard.sd / 2 //decrease(divide) sd by size factor if wrong
    function answeredRight(correct) {
        if (correct && thisType <= Math.floor(thisCard.mean)) {
            //correct answer, test level <= the card level
            thisCard.mean = meanCorrect;
            thisCard.sd = sdCorrect;
        } else if (correct && thisType > Math.floor(thisCard.mean)) {
            //correct answer, test level > the card level
            thisCard.mean = meanCorrect + 0.1;
            //keep sd the same
        } else if (!correct && thisType > Math.floor(thisCard.mean)) {
            //wrong answer, test level > the card level
            thisCard.mean = Math.max(0, meanCorrect - 0.1);
            thisCard.sd = sdWrong;
        } else {
            //wrong answer, test level <= the card level
            thisCard.mean = meanWrong;
            thisCard.sd = sdWrong;
        }
    }

    //for thisType of test, set the onclick action for each input/answer
    switch (thisType) {
        case 0:
            //get div id with correct answer
            var correctId = answersIds.filter(function(value) {
                if (document.getElementById(value).innerText == thisCard.read) {
                    return value;
                }
            });
            correctId = correctId.join("");
            //go through each div and set onclick function
            answersIds.forEach(function(divId) {
                document.getElementById(divId).addEventListener('click', function() {
                    if (document.getElementById(divId).innerText == thisCard.read) {
                        //correct answer change to green
                        document.getElementById(divId).className = "list-group-item list-group-item-action list-group-item-success";
                        answeredRight(true);
                    } else {
                        //wrong answer change to red and make the correct answer green
                        document.getElementById(divId).className = "list-group-item list-group-item-action list-group-item-danger";
                        document.getElementById(correctId).className = "list-group-item list-group-item-action list-group-item-success";
                        answeredRight(false);
                    }
                    //remove clickability of all choices
                    answersIds.forEach(function(clearClick) {
                        var replaceNode = document.getElementById(clearClick);
                        replaceNode.parentNode.replaceChild(replaceNode.cloneNode(1), replaceNode);
                        replaceNode.removeAttribute("href");
                    });
                    //update test data for thisCard
                    updateCard(thisCard.jp, thisCard);
                    //show next button
                    displayNext(thisCard.jp, cards, order, types, iter);         
                });
            });
            break;
        case 1:
            //get div id with correct answer
            var correctId = answersIds.filter(function(value) {
                if (document.getElementById(value).innerText == thisCard.jp) {
                    return value;
                }
            });
            correctId = correctId.join("");
            //go through each div and set onclick function
            answersIds.forEach(function(divId) {
                document.getElementById(divId).addEventListener('click', function() {
                    if (document.getElementById(divId).innerText == thisCard.jp) {
                        //correct answer change to green
                        document.getElementById(divId).className = "list-group-item list-group-item-action list-group-item-success";
                        answeredRight(true);
                    } else {
                        //wrong answer change to red and make the correct answer green
                        document.getElementById(divId).className = "list-group-item list-group-item-action list-group-item-danger";
                        document.getElementById(correctId).className = "list-group-item list-group-item-action list-group-item-success";
                        answeredRight(false);
                    }
                    //remove clickability of all choices
                    answersIds.forEach(function(clearClick) {
                        var replaceNode = document.getElementById(clearClick);
                        replaceNode.parentNode.replaceChild(replaceNode.cloneNode(1), replaceNode);
                        replaceNode.removeAttribute("href");
                    });
                    //update test data for thisCard
                    updateCard(thisCard.jp, thisCard);
                    //show next button
                    displayNext(thisCard.jp, cards, order, types, iter);
                });
            });
            break;
        case 2:
            //get div id with correct answer
            var correctId = answersIds.filter(function(value) {
                if (document.getElementById(value).innerText == thisCard.jp) {
                    return value;
                }
            });
            correctId = correctId.join("");
            // console.log(correctId);
            //go through each div and set onclick function
            answersIds.forEach(function(divId) {
                document.getElementById(divId).addEventListener('click', function() {
                    if (document.getElementById(divId).innerText == thisCard.jp) {
                        //correct answer change to green
                        document.getElementById(divId).className = "list-group-item list-group-item-action list-group-item-success";
                        answeredRight(true);
                    } else {
                        //wrong answer change to red and make the correct answer green
                        document.getElementById(divId).className = "list-group-item list-group-item-action list-group-item-danger";
                        document.getElementById(correctId).className = "list-group-item list-group-item-action list-group-item-success";
                        answeredRight(false);
                    }
                    //remove clickability of all choices
                    answersIds.forEach(function(clearClick) {
                        var replaceNode = document.getElementById(clearClick);
                        replaceNode.parentNode.replaceChild(replaceNode.cloneNode(1), replaceNode);
                        replaceNode.removeAttribute("href");
                    });
                    //update test data for thisCard
                    updateCard(thisCard.jp, thisCard);
                    //show next button
                    displayNext(thisCard.jp, cards, order, types, iter);
                });
            });
            break;
        case 3:
        case 4:
            var thisAnswers = qa[1];

            function submitFunction4(ele) {
                //color green=correct pink=wrong
                const topChildren = Array.from(document.getElementById("top-choices").children);
                var currentAnswers = topChildren.map(function(value) { return value.innerText;} );
                currentAnswers.pop();
                if (arraysEqual(thisAnswers, currentAnswers)) {
                    document.getElementById("top-choices").style.backgroundColor = "lightgreen";
                    answeredRight(true);
                } else {
                    document.getElementById("top-choices").style.backgroundColor = "pink";
                    answeredRight(false);
                }
                //show correct answer in title
                const oldTitle = document.getElementById("question").innerText;
                const correctTitle = oldTitle.replace(/．．．/g, () => ' <span class="text-success">' + thisAnswers.shift() + '</span> ');
                document.getElementById("question").innerHTML = correctTitle;
                //disable all other actions
                answersIds.forEach(function(clearClick) {
                    var replaceNode = document.getElementById(clearClick);
                    replaceNode.parentNode.replaceChild(replaceNode.cloneNode(1), replaceNode);
                    replaceNode.removeAttribute("href");
                });
                document.getElementById("submit").removeEventListener('click', submitFunction4);
                //update test data for thisCard
                updateCard(thisCard.jp, thisCard);
                //show next button
                displayNext(thisCard.jp, cards, order, types, iter);
            }

            function answerFunction4(ele) {
                //make behavior for when it is in top-choices vs bottom-choices
                if (this.parentNode.id == "top-choices") {
                    document.getElementById("bottom-choices").appendChild(this);
                    if (!!document.getElementById("submit")) {
                        document.getElementById("submit").remove();
                    }
                } else {
                    //check if there's room to move to top move it, otherwise print error
                    // console.log(thisAnswers);
                    if (document.getElementById("top-choices").childNodes.length >= thisAnswers.length) {
                        var shakeButton = document.getElementById("submit");
                        shakeButton.classList.add('text-danger');
                        setTimeout(function() {
                            shakeButton.classList.remove('text-danger');
                        }, 700);
                    } else {
                        document.getElementById("top-choices").appendChild(this);
                        if (document.getElementById("top-choices").childNodes.length == thisAnswers.length) {
                            //submit the answer
                            var submitButton = document.createElement("span")
                            submitButton.className = "ml-3";
                            submitButton.id = "submit";
                            submitButton.innerHTML = '<i class="far fa-paper-plane"></i>';
                            document.getElementById("top-choices").appendChild(submitButton);
                            submitButton.addEventListener('click', submitFunction4);
                        }
                    }
                }
            }
            //go through each div and set onclick function
            answersIds.forEach(function(divId) {
                document.getElementById(divId).addEventListener('click', answerFunction4);
            });
            break;
        case 5:
        case 6:
            //get correct answers in order
            var thisAnswers = thisCard.bunsetsu.split(" ");
            function submitFunction6(ele) {
                //color green=correct pink=wrong
                const topChildren = Array.from(document.getElementById("top-choices").children);
                var currentAnswers = topChildren.map(function(value, index, array) { return value.innerText;} );
                currentAnswers.pop();
                if (arraysEqual(thisAnswers, currentAnswers)) {
                    document.getElementById("top-choices").style.backgroundColor = "lightgreen";
                    answeredRight(true);
                } else {
                    document.getElementById("top-choices").style.backgroundColor = "pink";
                    answeredRight(false);
                }
                //show correct answer in title
                document.getElementById("question").innerHTML = thisCard.jp;
                //disable all other actions
                answersIds.forEach(function(clearClick) {
                    var replaceNode = document.getElementById(clearClick);
                    replaceNode.parentNode.replaceChild(replaceNode.cloneNode(1), replaceNode);
                    replaceNode.removeAttribute("href");
                });
                document.getElementById("submit").removeEventListener('click', submitFunction6);
                //update test data for thisCard
                updateCard(thisCard.jp, thisCard);
                //show next button
                displayNext(thisCard.jp, cards, order, types, iter);
            }
            function answerFunction6(ele) {
                //make behavior for when it is in top-choices vs bottom-choices
                if (this.parentNode.id == "top-choices") {
                    document.getElementById("bottom-choices").appendChild(this);
                    if (!!document.getElementById("submit")) {
                        document.getElementById("submit").remove();
                    }
                } else {
                    //check if there's room to move to top move it, otherwise print error
                    if (document.getElementById("top-choices").childNodes.length >= thisAnswers.length) {
                        var shakeButton = document.getElementById("submit");
                        shakeButton.classList.add('text-danger');
                        setTimeout(function() {
                            shakeButton.classList.remove('text-danger');
                        }, 700);
                    } else {
                        document.getElementById("top-choices").appendChild(this);
                        if (document.getElementById("top-choices").childNodes.length == thisAnswers.length) {
                            //submit the answer
                            var submitButton = document.createElement("span")
                            submitButton.className = "ml-3";
                            submitButton.id = "submit";
                            submitButton.innerHTML = '<i class="far fa-paper-plane"></i>';
                            document.getElementById("top-choices").appendChild(submitButton);
                            submitButton.addEventListener('click', submitFunction6);
                        }
                    }
                }
            }
            //go through each div and set onclick function
            answersIds.forEach(function(divId) {
                document.getElementById(divId).addEventListener('click', answerFunction6);
            });
            break;
    }
}

//once an answer is chosen, a next button appears to display the next question
function displayNext(parentId, cards, order, types, iter) {
    const parent = document.getElementById(parentId);
    var nextButton = document.createElement("p");
    nextButton.className = "card-text text-center display-4 mt-3";
    nextButton.innerHTML = '<i class="fas fa-arrow-alt-circle-right"></i>';
    parent.appendChild(nextButton);
    if (iter+1 < order.length) {
        //show next card
        nextButton.addEventListener('click', function() {
            displayTest(cards, order, types, iter+1);         
        });
    } else {
        //end of deck
        nextButton.addEventListener('click', function() {
            actionEndOfDeck();
        })
    }
}

//when the last card in the deck is complete, show completed message and link back to a new test
function actionEndOfDeck() {
    //clear testdisplay first
    var cardParent = document.getElementById("testdisplay");
    while (cardParent.hasChildNodes()) {  
        cardParent.removeChild(cardParent.firstChild);
    }
    var cardDiv = document.createElement("div");
    cardDiv.className = "card rounded-card";
    document.getElementById("testdisplay").appendChild(cardDiv); //card divs are contained inside a testdisplay div
    var cardBodyDiv = document.createElement("div");
    cardBodyDiv.className = "card-body";
    cardDiv.appendChild(cardBodyDiv);
    //display the kanji/english in card-title and card-text
    var kanjiTitle = document.createElement("h4");
    kanjiTitle.className = "card-title mt-4 mb-4";
    kanjiTitle.innerText = "You've reached the end of the deck";
    cardBodyDiv.appendChild(kanjiTitle);
    var eigoP = document.createElement("p");
    eigoP.className = "card-text mt-4 mb-4";
    eigoP.innerHTML = 'Congratulations! <a href="test.html">Start revising again</a>!';
    cardBodyDiv.appendChild(eigoP);
    return true;
}

//update entry of this card
async function updateCard(key, card) {
    //last minute check on key and card
	if (key.length > 0 && Object.keys(card).length > 0) {
        //all good
        var updatedCard = {...card};
        delete updatedCard.jp;
		await chrome.storage.local.set({[key]: JSON.stringify(updatedCard)});
	} else {
		//error
		alert("Insufficient input to update card");
	}
}

//initializes the test by retrieving the card data
async function initialize() {
    //get all key/value pairs from local storage and store in cardsList
    var cardList = new Array();
    await chrome.storage.local.get(null, function(cards) {
        const allPairs = Object.entries(cards)
        for (const [key, value] of allPairs) {
            var jsonObj = JSON.parse(value);
            jsonObj.jp = key; //add the key as a value
            cardList.push(jsonObj);
        }
        if (cardList.length < 3) {
            document.getElementById("testdisplay").innerHTML = 'Deck needs at least 3 cards to start testing. <a href="newcard.html" class="card-link">Add cards now!</a>';
        } else {
            //once all key/value pairs retrieved, calculate their order and start test
            initiateTest(cardList);
        }
    });
}

//calculate order in which cards are tested and which test to use
function initiateTest(cardList) {
    //populate mean and sd for each card; defaults 0 and 0.01
    var cardsMean = new Array();
    var cardsSD = new Array();
    cardList.forEach(function(value, ind) {
        if (value && value.mean && value.sd) {
            cardsMean.push(value.mean);
            cardsSD.push(value.sd);
        } else {
            cardsMean.push(0); //controls test type
            cardList[ind].mean = 0;
            cardsSD.push(0.01); //controls chance that test type can change AND sets card order (smaller = more frequent/earlier)
            cardList[ind].sd = 0.01;
        }
    });
    //set test type and card order by cardList; calculated by mean and sd
    var testType = new Array();
    var cardOrder = new Array();
    var cardFilter = new Array(); //the index of cardList of card to leave out
    for (let i = 0; i < cardsMean.length; i++) {
        var rand = normalRandomScaled(cardsMean[i],cardsSD[i]); //decide test type for card i
        rand = Math.abs(rand);
        var pushed = false
        if (rand < 0) {
            //test type can't be less than 0
            rand = 0;
        } else if (rand > 6) {
            //test type can't be greater than 6 but there comes a time when this shouldn't be tested anymore
            if (rand < 27) {
                //can review again
                rand = 6;
            } else {
                cardFilter.push(i); //flag card as no-review
                pushed = true
            }
        } else {
            rand = Math.floor(rand);
        }
        var rand2 = normalRandomScaled(cardsSD[i], 0.3); //decide test order for card i
        if (rand2 > 30 && rand > 6 && !pushed) {
            //larger than that means that the test is mostly correct ie learned
            cardFilter.push(i); //flag card as no-review
            //pushed = true
        }
        //save values in testType and cardOrder
        testType.push(rand); //save testType
        cardOrder.push(cardsMean[i]+rand2);
    }
    //convert cardOrder to array indexes for order (if [1] = 30 then card 30 will be the 2nd card tested)
    var cardOrderSelect = rankNums(cardOrder); //converts cardOrder (floats) into ranks (ints)
    cardOrderSelect = cardOrderSelect.map(function(value) {
        return value - 1;
    }); //convert ranks into array indexes (starts from 0)
    //reorder testType by cardOrder as well
    // var testTypeSelect = cardOrderSelect.map(i => testType[i]); //reorders testType by cardOrder
    //apply cardFilter to testType and cardOrder; remove value in testType if its index is in cardFilter
    var testTypeSelect = testType;
    testTypeSelect = testTypeSelect.filter((value, index) => !cardFilter.includes(index));
    cardOrderSelect = cardOrderSelect.filter((value, index) => !cardFilter.includes(index));
    // console.log(cardOrder);
    // console.log(cardOrderSelect);
    // console.log(testType);
    // console.log(testTypeSelect);
    // console.log(cardFilter);
    // console.log(cardList);
    // cardList = all cards, cardOrderSelect = in order the card indexes (in cardList) to test, testTypeSelect = in order (matches cardOrderSelect) the test for matching card
    displayTest(cardList, cardOrderSelect, testTypeSelect, 0); //start with first test
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPair(max, n) {
    var arr = [];
    while(arr.length < n){
        var r = Math.floor(Math.random() * max);
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
}

function shuffleArray(array) {
    var newArray = Array.from(array);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function getElementListById(ids) {
    var idList = ids.split(" ");
    var results = [], item;
    for (var i = 0; i < idList.length; i++) {
        item = document.getElementById(idList[i]);
        if (item) {
            results.push(item);
        }
    }
    return(results);
}

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

function rankNums(arr){
    var sorted = arr.slice().sort(function(a,b){return b-a})
    var ranks = arr.slice().map(function(v){ return sorted.indexOf(v) + 1 });
    return ranks;
 }

function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}

//start code needed for random sampling [https://gist.github.com/bluesmoon/7925696]
var spareRandom = null;

function normalRandom()
{
	var val, u, v, s, mul;

	if(spareRandom !== null)
	{
		val = spareRandom;
		spareRandom = null;
	}
	else
	{
		do
		{
			u = Math.random()*2-1;
			v = Math.random()*2-1;

			s = u*u+v*v;
		} while(s === 0 || s >= 1);

		mul = Math.sqrt(-2 * Math.log(s) / s);

		val = u * mul;
		spareRandom = v * mul;
	}
	
	return val;
}

function normalRandomInRange(min, max)
{
	var val;
	do
	{
		val = normalRandom();
	} while(val < min || val > max);
	
	return val;
}

function normalRandomScaled(mean, stddev)
{
	var r = normalRandom();

	r = r * stddev + mean;

	return r;
}

function lnRandomScaled(gmean, gstddev)
{
	var r = normalRandom();

	r = r * Math.log(gstddev) + Math.log(gmean);

	return Math.round(Math.exp(r));
}
//end code needed for random sampling

//when page is loaded, get cards from chrome.storage.local
window.addEventListener("load", function() {
    initialize();
}, false);
