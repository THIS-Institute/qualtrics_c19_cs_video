
function writeNodesToConsole (nodes) {
    var i;
    for (i = 0; i < nodes.length; i++) {
		console.log(i + ' : ' + nodes[i].nodeName + ' : ' + nodes[i].id);
    }
}

function uncheckOptionButton(questionId) {
    var button = document.getElementById(questionId);
    if (button != null) {
        console.log("q:" + button);
        button.checked = false;
    }
}

function hideButton(buttonId) {
    var button = document.getElementById(buttonId);
    if (button != null){
        button.style.display = "none";
    }
}

function showOrHideButton(buttonId, hide){
    button = document.getElementById(buttonId);
    if (button != null) {
        if (hide) {
            button.style.display = "none"
        } else {
            button.style.display = "inline"
        }
    }
}

function moveQuestions(targetDiv, questionNodes, questionCount, firstNodeToMove) {
	// note that there are THREE nodes per question in the html that Qualtrics generates
	var i;
	var nodesPerQuestion = 3;
	for (i = 0; i < questionCount * nodesPerQuestion; i++) {
        var questionNode = questionNodes[firstNodeToMove];
        // console.log('questionNode:' + questionNode.id)
        targetDiv.appendChild(questionNode);
	}
}

function createDivForQuestions(divId, questionsDiv, startAtIndex, questionCount, answersSection){
	// create the new div
	var newDiv = document.createElement('div');
	newDiv.id = divId;
	newDiv.className="tabContent";
	if (!answersSection){
	    newDiv.className += " ctgCaseQuestion";
    }

	// insert new div into questions div
	var questionNodes = questionsDiv.childNodes;
	questionsDiv.insertBefore(newDiv, questionNodes[startAtIndex]);

	// move questions into new div
	moveQuestions(newDiv, questionNodes, questionCount, startAtIndex + 1);

	// find if div contains user input errors
	var tabId = newDiv.id + "Tab";
	var selectedTab = document.getElementById(tabId);

	var errorDivs = newDiv.getElementsByClassName("ValidationError");
	var i;
    for (i = 0; i < errorDivs.length; i++) {
		// console.log(i + ' : ' + errorDivs[i].id+ ' : ' + errorDivs[i].textContent);
		if (errorDivs[i].textContent !== "") {
			// selectedTab.textContent += " *";
			if (selectedTab.className.indexOf("tabWithErrors") === -1) {
        		selectedTab.className += ' tabWithErrors'
    		}
		}
    }
}

function restructureHTMLforVignette(qualtricsWin, answersSection) {
	var questionsDiv = document.getElementById('Questions');
	// writeNodesToConsole(questionsDiv.childNodes);
	var nodesToIgnore = 3;  // first three are for tabs

	createDivForQuestions('ContextDiv', questionsDiv, nodesToIgnore + 0, 1, answersSection);
	createDivForQuestions('Trace1Div', questionsDiv, nodesToIgnore + 1, 3, answersSection);
	createDivForQuestions('Trace2Div', questionsDiv, nodesToIgnore + 2, 3, answersSection);
	createDivForQuestions('Trace3Div', questionsDiv, nodesToIgnore + 3, 3, answersSection);
	/* the answers section does not contain the 'confirm ready to continue' question
	*  need to take this difference into account when restructuring HTML */
	var numberOfQuestionsInSection = 2;
	// console.log ('answersSection:'+ answersSection);
	if (answersSection === true){
	    numberOfQuestionsInSection = 1
        // console.log ('answersSection is now 1')
    }
	createDivForQuestions('AnalysisDiv', questionsDiv, nodesToIgnore + 4, numberOfQuestionsInSection, answersSection);

	// when first opening page go to tab with errors if there is one, otherwise select Context div
	var errorTabs = document.getElementsByClassName("tabWithErrors")

	if (errorTabs.length === 0) {
		showTab(null, 'ContextDiv');
		// qualtricsWin.hideNextButton();
	} else {
		// console.log(errorTabs.length);
		var errorTab = errorTabs[0];
		// console.log(errorTab.id);
		showTabById(null, errorTab.id);
	}
}

function addNextPrevTabButtons() {
    var buttonsDiv = document.getElementById('Buttons');

    var newButton = document.createElement('Input');
    newButton.type = 'button';
    newButton.id = 'NextTabButton';
    newButton.className = "NextButton";
    newButton.value = "Next →";
    newButton.onclick = function(){showNextQ()};
    buttonsDiv.insertBefore(newButton, buttonsDiv.childNodes[1]);

    newButton = document.createElement('Input');
    newButton.type = 'button';
    newButton.id = 'PreviousTabButton';
    newButton.className = "PreviousButton";
    newButton.value = "← Back";
    newButton.onclick = function(){showPreviousQ()};
    buttonsDiv.insertBefore(newButton, buttonsDiv.childNodes[0]);
}

function showNextQ() {
    showOrHideButton('QID43', true)
    // var currentQ = getCurrentTab();
    // var currentTabId = currentTab.id;
    // var nextTabId = "ContextDivTab";  // default to context
    // // console.log('currentTabId:' + currentTabId)
    //
    // if (currentTabId === "ContextDivTab") {
    //     nextTabId = "Trace1DivTab";
    // } else if (currentTabId === "Trace1DivTab") {
    //     nextTabId = "Trace2DivTab";
    // } else if (currentTabId === "Trace2DivTab") {
    //     nextTabId = "Trace3DivTab";
    // } else if (currentTabId === "Trace3DivTab") {
    //     nextTabId = "AnalysisDivTab";
    // }
    // showTabById(null, nextTabId);
}

function showPreviousQ() {
    showOrHideButton('QID43', false)
}

function showOrHideButton(qId, hide){
    qDiv = document.getElementById(qId);
    if (qDiv != null) {
        if (hide) {
            qDiv.style.display = "none"
        } else {
            qDiv.style.display = "inline"
        }
    }
}