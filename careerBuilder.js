//globals
var noSelectMessage   = "You have not selected any",
    totalSkills       = $('input:checkbox[name="skill"]').length,
    nextButton        = "<button class='next next-subsection' type='button'>Next</button>",
    nextSectionButton = "<button class='next next-section' type='button'>Next section</button>",
    skipButton        = "<button class='skip-section' type='button'>Skip this section</button>",
    summaryButton     = "<button class='get-summary next' type='button'>Download section summary</button>",
    fullSummaryButton = "<button class='get-summary' type='button'>Download full summary</button>",
	saveButton        = '<button id="save-button" onclick="saveProgress();" onkeypress="saveProgress();">Save progress</button>',
	startAgainButton  = '<button id="clear-button" onclick="clearAll();" onkeypress="clearAll();">Start again</button>',
	summaryButton     = '<button class="get-summary">Download summary</button>',
    closeButton       = "<button class='next close-popup' type='button'>Close</button>",
    cardSortStart     = '<button id="start-card-sort" type="button">Open value sorting task</button>',
    printButton       = "<button id='print-summary' type='button' onclick='window.print()'>Print summary</button>",
    cardSortInProgess = false;

var cb = {
	"title" : "Career Builder",
	"sections" : [
		{
			"id" : "who",
			"title" : "Self assessment",
			"subs" : [
				{
					"id" : "skills",
					"title" : "Skills and abilities"
				},
				{
					"id" : "pdam",
					"title" : "Developing your skillset"
				},
				{
					"id" : "values",
					"title" : "Values and motivations"
				},
				{
					"id" : "summary",
					"title" : "What next?"
				}
			]
		},
		{
			"id" : "research",
			"title" : "Careers research",
			"subs" : [
				{
					"id" : "sectors",
					"title" : "Sectors"
				},
				{
					"id" : "roles",
					"title" : "Roles"
				},
				{
					"id" : "employers",
					"title" : "Employers"
				}
			]
		},
		{
			"id" : "decision",
			"title" : "Making a decision",
			"subs" : [
				{
					"id" : "forme",
					"title" : "Do I need to use this section?"
				},
				{
					"id" : "barriers",
					"title" : "Barriers to effective decision making"
				},
				{
					"id" : "review",
					"title" : "Reviewing your responses"
				},
				{
					"id" : "further",
					"title" : "Further support and advice"
				}
			]
		},
		{
			"id" : "achieving",
			"title" : "Taking action",
			"subs" : [
				{
					"id" : "cv",
					"title" : "CV and cover letter support"
				},
				{
					"id" : "application",
					"title" : "Application form support"
				},
				{
					"id" : "interview",
					"title" : "Interview support"
				},
				{
					"id" : "assessment",
					"title" : "Assessment centre support"
				}
			]
		},
		{
			"id" : "final-popup",
			"title" : "You have now finished the last section of Career Builder but this is not the end of your career planning!",
			"subs" : []
		}
	]
};

var cbSummaryStyle = 
"@media print {" +
"    .advice {" +
"        border: 1px solid #898989;" +
"    }" +
"    #print-summary {" +
"        display: none;" +
"    }" +
"}" +
"#careerBuilder-summary {" +
"	font-family: Arial, sans serif;" +
"	max-width: 760px;" +
"	margin: 0 auto;" +
"	padding: 1em;" +
"}" +
"#careerBuilder-summary a," +
"#careerBuilder-summary a:hover," +
"#careerBuilder-summary a:visited {" +
"	color: red;" +
"}" +
"#careerBuilder-summary #print-summary {" +
"	float: right;" +
"	margin-top: 30px;" +
"   background-color: #333;" +
"   border-color: #333;" +
"   cursor: pointer;" +
"   font-weight: bold;" +
"   color: #FFF;" +
"   border-style: solid;" +
"   border-width: 2px;" +
"   padding: 5px" +
"}" +
"#careerBuilder-summary #print-summary:hover {" +
"   background-color: #666;" +
"}" +
"#careerBuilder-summary ul {" +
"	list-style: square;" +
"}" +
"#careerBuilder-summary .advice {" +
"	background: #F2F2F2;" +
"	padding: 0 1em;" +
"	overflow: auto;" +
"	" +
"}" +
"#careerBuilder-summary .section-summary {" +
"	border: 4px solid;" +
"	padding: 0 1em 1em 1em;" +
"	margin: 1em 0;" +
"	background: white;" +
"}" +
"#careerBuilder-summary #who-summary {" +
"	border: 4px solid #F58621;" +
"}" +
"#careerBuilder-summary #who-summary h2 {" +
"	color: #F58621;" +
"}" +
"#careerBuilder-summary #who-summary #values-summary {" +
"   padding: 0;" +
"   overflow: auto;" +
"}" +
"#careerBuilder-summary #who-summary #values-summary > li {" +
"   list-style: none;" +
"   float: left;" +
"}" +
"#careerBuilder-summary #who-summary #values-summary > li .importance-level {" +
"   font-weight: bold;" +
"}" +
"#careerBuilder-summary #research-summary {" +
"	border: 4px solid #1999D4;" +
"}" +
"#careerBuilder-summary #research-summary h2 {" +
"	color: #1999D4;" +
"}" +
"#careerBuilder-summary #decision-summary {" +
"	border: 4px solid #936AB0;" +
"}" +
"#careerBuilder-summary #decision-summary h2 {" +
"	color: #936AB0;" +
"}" +
"#careerBuilder-summary #achieving-summary {" +
"	border: 4px solid #2FB64B;" +
"}" +
"#careerBuilder-summary #achieving-summary h2 {" +
"	color: #2FB64B;" +
"}";

/*********CARD SORTING MODULE*********/
var cs =
(function() {

    /***VARIABLES***/

    function Value(name, description) {
        this.name = name;
        this.description = description;
    }

    var iScale = [{name: "Least important"}, {name: "Quite important"}, {name: "Important"}, {name: "Most important"}],
        vDeck = new Array(),
        cardSorter = document.getElementById('cs-container'),
        deck = document.getElementById('deck-container'),
        playingArea = document.getElementById('playing-area'),
        skipCardButton = document.getElementById('skip-button'),
        finishButton = document.getElementById('finish-button'),
        deckButton = document.getElementById('deck-button');
    
    (function populateVDeck() {
        var vals = getTemplateElement('value-list').getElementsByClassName('value');
        for (var i = 0; i < vals.length; i++) {
            vDeck.push(new Value(
			   vals[i].getElementsByClassName('title')[0].textContent, 
			   vals[i].getElementsByClassName('description')[0].textContent)
            );
        }
    })();

    var dropLimit = Math.ceil(vDeck.length/iScale.length);

    /***UTILS***/

    function getTemplateElement(className) {
        var templates = document.getElementById('templates');
        return templates.getElementsByClassName(className)[0].cloneNode(true);
    }

    //Fisher-Yates Shuffle
    function shuffle(array) {
        var m = array.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }

    function findPos(obj) {
        var curtop = 0;
        if (obj.offsetParent) {
            do {
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return [curtop];
        }
    }

    /***START STATE***/

    function makeCols() {
        for (var i = 0; i < iScale.length; i++) {
            var newCol = getTemplateElement('playing-col');
            newCol.setAttribute('id', 'col-' + i);
            var colHeader = iScale[i].name;
            colHeader += ' - <span class="col-card-count"></span>/' + dropLimit;
            newCol.getElementsByClassName('importance-level')[0].innerHTML = colHeader;
            var id = 'dz-' + i;
            iScale[i].id = id;
            var dz = document.createElement('div');
            dz.classList.add('drop-zone');
            dz.setAttribute('id', id);
            newCol.appendChild(dz);
            playingArea.appendChild(newCol);
        }
    }

    function makeCard(val) {
        var card = getTemplateElement('value-card');
        card.setAttribute('id', 'card-' + val.id);
        card.getElementsByClassName('value-name')[0].innerHTML = val.name;
        card.getElementsByClassName('value-description')[0].innerHTML = val.description;
        return card;
    }

    function makeDeck() {
        vDeck = shuffle(vDeck);
        for (var i = 0; i < vDeck.length; i++) {
            vDeck[i].id = i;
            deck.appendChild(makeCard(vDeck[i]));
        }
        if (vDeck.length > 1) {
            skipCardButton.disabled = false;
        }
    }

    function setDimensions(i, l) {
    	cardSorter.style.width = (i * 179.25) + 'px';
    	playingArea.style.minHeight = (l * 113.75) + 'px';
    }

    function start() {
        makeCols();
        makeDeck();
        setDimensions(iScale.length, dropLimit);
        cardSorter.getElementsByClassName('drop-limit')[0].innerHTML = dropLimit;
        cardMoved();
    }

    /***IN-PROGRESS STATE***/

    function styleDeck() {
        var cards = deck.getElementsByClassName('value-card'),
            l = cards.length;
        for (var i = 0; i < l; i++) {
            var card = cards[i];
            card.style.top = '-' + i + 'px';
            card.style.left = '-' + i + 'px';
            card.setAttribute('draggable', 'false');
        	card.style.cursor = 'default';
        }
    }

    function getDeckCount() {
        return deck.getElementsByClassName('value-card').length;
    }

    function updateDeckCount() {
        document.getElementById('deck-count').innerHTML = getDeckCount();
    }
    
    function updateColCounts() {
        var c = playingArea.getElementsByClassName('playing-col');
        for (var i = 0; i < c.length; i++) {
            var label = c[i].getElementsByClassName('importance-level')[0].getElementsByClassName('col-card-count')[0];
            var count = c[i].getElementsByClassName('drop-zone')[0].getElementsByClassName('value-card').length;
            label.innerHTML = count;
        }
    }

    function pickUpCard(event) {
        event.dataTransfer.setData("text", event.target.id);
    }

    function allowDrop(event) {
        event.preventDefault();
    }
    
    function canPutSelectedOnDeck() {
        try {
            return document.getElementsByClassName('selected')[0].parentElement.id != 'deck-container';
        } catch (e) {
            return false;
        }
    }

    function setTopCardDraggable() {
        deck.lastChild.setAttribute('draggable', 'true');
        deck.lastChild.style.cursor = 'move';
    }
    
    function cardMoved() {
        updateDeckCount();
        styleDeck();
        setTopCardDraggable();
        updateColCounts();
        deckButton.disabled = !(canPutSelectedOnDeck());
    }
    
    function appendToDeck(id) {
        var card = document.getElementById(id);
        if (card.parentElement != deck) {
            deck.appendChild(card);
            finishButton.disabled = true;
            if (getDeckCount() != 1) {
                skipCardButton.disabled = false;
            }
            cardMoved();
        }
    }

    function dropCardOnDeck(event) {
        event.preventDefault();
        appendToDeck(event.dataTransfer.getData("text"));
    }
    
    function deckButtonAction() {
        var selected = document.getElementsByClassName('selected')[0];
        if (selected != undefined) {
            appendToDeck(selected.id);
            selected.classList.remove('selected');
            deckButton.disabled = true;
        }
        else {
            alert("No card selected!");
        }
    }

    function addCardToPlayingArea(card, col) {
        var dz = col.getElementsByClassName('drop-zone')[0];
        if (card.parentElement != dz) {
            if (dz.getElementsByClassName('value-card').length < dropLimit) {
                card.setAttribute('style', '');
                dz.appendChild(card);
            }
            else {
                alert("Maximum of " + dropLimit + " cards per column!");
            }
            if (getDeckCount() == 1) {
                skipCardButton.disabled = true;
            }
            if (isPotentiallyFinished()) {
                allowFinish();
            }
            cardMoved();
        }
    }

    function dropCardInPlayingArea(event, col) {
        var data = event.dataTransfer.getData("text"),
            card = document.getElementById(data);
        addCardToPlayingArea(card, col);
    }

    function toggleSelect(event, target) {
        deckButton.disabled = true;
        var selected = document.getElementsByClassName('selected')[0];
        if (selected != undefined) {
            selected.classList.remove('selected');
        }
        if (target.parentElement == deck) {
            target = deck.lastChild;
        }
        if (target != selected) {
            target.classList.add('selected');
            if (target.parentElement != deck) {
                deckButton.disabled = false;
            }
        }
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        else {
            event.cancelBubble = true;
        }
    }

    function clickDrop(event, col) {
        var card = document.getElementsByClassName('selected')[0];
        if (card != undefined) {
            card.classList.remove('selected');
            addCardToPlayingArea(card, col);
        }
    }

    function skipCard() {
        var bottomCard = deck.getElementsByClassName('value-card')[0],
            topCard = deck.getElementsByClassName('value-card')[getDeckCount() - 1];
        if (topCard.classList.contains('selected')) {
        	topCard.classList.remove('selected');
        	bottomCard.classList.add('selected');
        }
        deck.appendChild(bottomCard);
        styleDeck();
        setTopCardDraggable();
    }

    function isPotentiallyFinished() {
        return getDeckCount() == 0;
    }

    function restart() {
        finishButton.disabled = true;
        deck.innerHTML = "";
        playingArea.innerHTML = "";
        start();
    }

    /***FINISH STATE***/

    function allowFinish() {
        finishButton.disabled = false;
        skipCardButton.disabled = true;
    }

    function finish() { }

    function getData() {
    	var data = new Array(),
    	    cols = playingArea.getElementsByClassName('playing-col');
    	for (var i = 0; i < cols.length; i++) {
    		var colTitle = iScale[i].name,
    		    vals = cols[i].getElementsByClassName('value-card'),
    		    valNames = new Array();
    		for (var j = 0; j < vals.length; j++) {
    			var valName = vals[j].getElementsByClassName('value-name')[0].innerHTML;
    			valNames.push(valName);
    		}
    		data.push({column: {title: colTitle, values: valNames}});
    	}
    	return data;
    }

    /***API***/

    return {
        start            : function()    {start();},
        restart          : function()    {restart();},
        finish           : function()    {finish();},
        skipCard         : function()    {skipCard();},
        pickUp           : function(e)   {pickUpCard(e)},
        allowDrop        : function(e)   {allowDrop(e);},
        deckButtonAction : function()    {deckButtonAction();},
        deckDrop         : function(e,t) {dropCardOnDeck(e,t);},
        playingAreaDrop  : function(e,t) {dropCardInPlayingArea(e,t);},
        toggleSelect     : function(e,t) {toggleSelect(e,t);},
        clickDrop        : function(e,t) {clickDrop(e,t);},
        getData          : function()    {return getData();}
    };

}());

//replace prop() with attr() if jQuery is older than 1.6
if (typeof jQuery.fn.prop != 'function') {
    jQuery.fn.prop = jQuery.fn.attr;
}

function supportsStorage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

function saveProgress() {
	if (supportsStorage()) {
		localStorage.setItem('cb-html', $('#save-area').html());
		$('#save-button').html('&#10004; Saved');
		showPopup(9999, $('#save-popup'));
	} else {
		alert("Unable to save progress");
	}
}

function loadProgress() {
	if (supportsStorage()) {
		if (localStorage.getItem('cb-html') != undefined) {
			$('#save-area').html(localStorage.getItem('cb-html'));
			return true;
		}
	}
	return false;
}

function clearAll() {
	if (supportsStorage()) {
		localStorage.clear();
	}
	document.location.reload(true);
}

function closePopup(popupId) {
	$('#popups').append($('#'+popupId));
	$('#overlay, #clear-overlay').remove();
}

function showPopup(z, $popup) {
	var docHeight = $(document).height(),
	    pid = $popup.attr('id');
	$("body").append("<div id='overlay'></div>");
	$("#overlay")
		.height(docHeight)
		.css({
			'opacity' : 0.5,
			'position': 'fixed',
			'top': 0,
			'left': 0,
			'background-color': 'black',
			'width': '100%',
			'z-index': z - 1
		}).click(function() {
				closePopup(pid);
		});
	$('body').append('<div id="clear-overlay"></div>');
	$('#clear-overlay')
		.height(docHeight)
		.css({
			'position': 'absolute',
			'top': 0,
			'left': 0,
			'width': '100%'
		}).append($popup);
	$popup.slideDown('slow');
	$("html, body").animate({ scrollTop: 0 }, 500);
}

function registerTriggerProxies(a) {
	$.each(a, function(i, val) {
		$(i).click(function(e) { $(val).trigger(e); });
		$(i).hover(	
			function(e) { $(val).trigger(e); },
			function(e) { $(val).trigger(e); }
		);
	});
}

function triggerTogglers(e, $this) {
	var $thisSub = $this.closest('li'),
	    $thisSection = $this.closest('.section'),
	    $h3Togglers = $thisSection.find('h3.toggler').not('.closed'),
	    $nextH3 = $thisSub.next().find('h3.toggler');
	if ($this.hasClass('next-section')) {
		if ($thisSection.is('#achieving')) {
			$thisSection.find('h2.toggler').trigger(e.type);
			if (e.type == 'click') {
				showPopup(9999, $('#final-popup'));
			}
		}
		else {
			var $nextH2 = $thisSection.next().find('h2.toggler');
			$nextH2.trigger(e.type);
			$thisSection.next().find('h3.toggler').not('.closed').trigger(e.type);
		}
	}
	else if ($thisSub.is(':last-child') && e.type == 'click') {
		$thisSection.find('.section-level-buttons').slideDown();
	}
	else {
		if ($nextH3.is('.closed')) {
			$nextH3.trigger(e.type);
		}
	}
	$h3Togglers.not($nextH3).trigger(e.type);
}

function skipSectionTrigger(e, $this) {
	var $lastButton = $this.closest('.section').find('.next-subsection:last');
	triggerTogglers(e, $lastButton);
}

function buildCardSortSummary() {
	var csData = cs.getData(),
	    summary = "";
	for (var i = csData.length - 1; i >= 0; i--) {
		summary += "<li><span class='importance-level'>" + csData[i].column.title + "</span> \
		            <ul class='value-list'>";
		for (var j = 0; j < csData[i].column.values.length; j++) {
			summary += "<li class='value-item'>" + csData[i].column.values[j] + "</li>";
		}
		summary += "</ul></li>";
	}
	$('#values-summary').html(summary);
}

function buildSectionSummary(section) {
	var sectionHTML = "<h2>" + section.title + "</h2>";
	$.each(section.subs, function(i, sub) {
		sectionHTML += "<h3>" + sub.title + "</h3>";
		if ($('input:radio[name=' + sub.id + ']:checked').length > 0) {
			sectionHTML += "<p>" + $('#' + sub.id + '-sub-content').children(':first').html();
			var radId = $('input:radio[name=' + sub.id + ']:checked').attr('id');
			sectionHTML += "<strong>";
			sectionHTML += " " + $('label[for=' + radId + ']').text() + "</strong>.</p>";
			sectionHTML += "<p>Here's our advice:</p>";
			sectionHTML += "<div class=\"advice\">";
			var sugId = radId.substring(0, radId.length - 6); // 6 is length of "-radio"
			sectionHTML += $('#' + sub.id + '-sub-content #' + sugId).html();
			sectionHTML += "</div>";
		}
		else {
			sectionHTML += "<p>You didn't answer this question.</p>";
		}
	});
	return sectionHTML;
};

function getSummary(sectionID) {
	var body = "<div class=\"section-summary\" id=\"" + sectionID + "-summary\">";
	if (sectionID == cb.sections[0].id) {
		body += "<h2>Self-assessment</h2>";
		
		body += "<h3>Your skills</h3>";
		body += $('<div>').append($('#skills-summary').clone()).remove().html();
		body += $('#pdam-sub-content').children().html(); //hidden ones have display:none on element
		
		body+= "<h3>Your values</h3>";
		body += $('<div>').append($('#values-summary').clone()).remove().html();
		
		body+= "<h3>Next steps</h3>";
		body += "<div class=\"advice\">";
		body += $('#skills-values-suggestion').html();
		body += "</div>";
	}
	else if (sectionID == cb.sections[1].id) {
		body += buildSectionSummary(cb.sections[1]);
	}
	else if (sectionID == cb.sections[2].id) {
		body += "<h2>Making a decision</h2>";
		
		body += "<h3>Overcoming your decision making barriers</h3>";
		var $adviceList = $("#" + sectionID + " .advice")
							  .filter(function(index) {
								  return $(this).css("display") == "block";
							}).clone();
		if ($adviceList.length > 0) {
			$adviceList.each(function() {
				var $advice = $(this);
				$advice.children().css('display', 'block');
				$advice.find(".toggle-arrow").remove();
				body += $advice.html();
			});
		}
		else {
			body += "<p>You didn't select any decision making barriers.</p>";
		}
		
		body += "<h3>Further support and advice</h3>"
		body += "<div class=\"advice\">";
		body += $('#further-sub-content .suggestion').html();
		body += "</div>";
	}
	else if (sectionID == cb.sections[3].id) {	
		body += buildSectionSummary(cb.sections[3]);
	}
	body += "</div>"
	return body;
}

function saveSummary(e, $this) {
	var header = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\"><html><head>" +
				 "<title>Your Career Builder summary</title>" +
				 "<style>" + cbSummaryStyle + "</style>" +
				 "</head><body id=\"careerBuilder-summary\">" + printButton + "<h1>Your Career Builder summary</h1>" +
				 "<p>Here are your selections from <a href=\"http://lse.ac.uk/careerbuilder\">Career Builder</a>" + 
				 " along with our suggestions of the resources and services best suited to you.</p>",
	    footer = "</body></html>",
	    fileName = "Career Builder";
	    sId = $this.closest('.section').attr('id');
	var body = "";
	if (sId == cb.sections[cb.sections.length - 1].id || sId == "careerBuilderGuide") {
		$.each(cb.sections, function(i, section) {
			if (section.id != "final-popup") {
				body += getSummary(section.id);
			}
		});
	}
	else {
		body += getSummary(sId);
		$.each(cb.sections, function(i, section) {
			if (section.id == sId) {
				fileName += " - " + section.title;
			}
		});
	}
	body += "<h2>Next steps in your career planning</h2>";
	$('#final-popup').children().each(function(i) {
		if (i == 1 || i == 2) {
			body += "<p>" + $(this).html() + "</p>";
		}
	});
	var html = header + body + footer,
	    oSummaryBlob = new Blob([html], {type: 'text/html'});
	fileName += " summary.html";
	saveAs(oSummaryBlob, fileName);
}

//set up
$(function() {
	
	if (!loadProgress()) {
		cs.start();
		$('input:checkbox, input:radio').removeAttr('checked'); //for mozilla
		$('#values-sub-content').append(cardSortStart);
		$('.section-content').append('<div class="section-level-buttons hidden"></div>');
		$('.hidden').hide();
		$('#skills-summary').append("<li>" + noSelectMessage + " skills.</li>");
		$('#values-summary').append("<li>You haven't finished the card sorting task.</li>");
		$('#review-sub-content .advice h4').after('<ul class="barrier-list"></ul>');
		$('#forme-sub-content').append(skipButton);
		$('.sub-content').not('.check-option .sub-content').append(nextButton);
		$('.section-level-buttons').append(summaryButton).append(nextSectionButton);
		$('#final-popup').append(fullSummaryButton);
		$('#final-popup, #save-popup').append(closeButton);
		$('.section:last-of-type .next-section').text('What next?');
		$('#careerBuilder a').each(function() {
			var $this = $(this);
			$this.attr("target", "_blank");
		});

		//set up ARIA attributes
		$('.toggler').each(function() {
			var $this = $(this),
			    $next = $this.next();
			if ($this.is('h2'))
				$this.attr('role', 'sectionhead');
			$this.attr('aria-expanded', false)
			     .attr('aria-controls', $next.attr('id'));
			$next.attr('aria-hidden', true);
		});
		$('.section').each(function() {
			$(this).attr('role', 'section');
		});
	}

	$('#careerBuilderGuide')
		.append(saveButton)
		.append(startAgainButton)
		.append(summaryButton);

	registerTriggerProxies({
		'.section1-trigger'   : '#who-head',
		'.section2-trigger'   : '#research-head',
		'.section3-trigger'   : '#decision-head',
		'button.skip-section' : '#achieving-head'
	});


	$('#close-cs').click(function() {
		closePopup('cs-container');
	});

	$('.close-popup').click(function() {
		closePopup($(this).parent().attr('id'));
	});

	$('.toggler').hover(
		function() {
			var $this = $(this);
			$this.addClass($this.hasClass('closed') ? 'opening' : 'closing');
			if($this.is('h2')) {
				$('h2.toggler').not('.closed').each(function() {
					$(this).addClass('closing');
				});
			}
		},
		function() {
			var $this = $(this);
			$this.removeClass($this.hasClass('closed') ? 'opening' : 'closing');
			if($this.is('h2')) {
				$('h2.toggler').not('.closed').each(function() {
					$(this).removeClass('closing');
				});
			}
		}
	);

	//toggle section & subsection visibility
	$('.toggler').click(function() {
		var $this = $(this),
		    state = $this.attr('aria-expanded') === 'false' ? true : false;
		$this.toggleClass('closed')
		     .attr('aria-expanded', state)
			     .siblings()
			     .attr('aria-hidden', !state)
			     .slideToggle('slow', function() {
			         $this.removeClass('opening').removeClass('closing');
		});
		//close other sections
		if($this.is('h2')) {
			$('h2.toggler').not($this).not('.closed').each(function() {
				$(this).addClass('closed')
				       .removeClass('closing')
				       .attr('aria-expanded', false)
				           .siblings()
				           .attr('aria-hidden', true)
				           .slideUp('slow', function() {
					           $this.removeClass('opening').removeClass('closing');
				});
			});
		}
	});

	$('button.next-subsection, button.next-section').click(function(e) { 
	    triggerTogglers(e, $(this)); 
	});

	$('button.next-subsection, button.next-section').hover(
		function(e) { triggerTogglers(e, $(this)); },
		function(e) { triggerTogglers(e, $(this)); }
	);

	$('button.get-summary').click(function(e) { saveSummary(e, $(this)); });

	$('button#finish-button').click(function(e) { 
		buildCardSortSummary();
		closePopup('cs-container');
		$('#cs-suggestion, #skills-values-suggestion').slideDown('slow');
	});

	$('#start-card-sort').click(function(e) {
		showPopup(9999, $('#cs-container'));
		$(this).html("Continue value sorting task");
	});

	//expand advice according to radio button selection
	$('input:radio').change(function() {
		$('input:radio').each(function() {
			var $this = $(this),
			    qName = $this.attr('name'),
			    qVal = $this.attr('value'),
			    sID = qName + '-' + qVal;
			$this.is(':checked') ? $('#' + sID).slideDown('slow') : $('#' + sID).slideUp('slow');
		});
	});

	//show skills in list and remove skills from pdam set when selected
	$('input[name=skill]').change(function() {
		var $checked = $(this);
		$('#skills-summary').html("");
		$('#missing-skill-list li').hide();
		$('#skills-values-suggestion').slideDown('slow');
		var skillsCount = 0;
		$('input:checkbox').each(function() {
			var $this = $(this),
			    checkName = $this.attr('name'),
			    checkVal = $this.attr('value'),
			    checkClass = $this.attr('class');
			if ($this.is(':checked')) {
				$('#skills-summary').append("<li>" + checkVal + "</li>");
				skillsCount++;
			}
			else if ($this.not(':checked')) {
				var missingSkillTargetId = '#' + checkClass + '-pdam';
				$(missingSkillTargetId).show();
			}
		});
		if (skillsCount == totalSkills) {
			$('#missing-skills-advice').hide();
			$('#all-skills-advice').show();
		}
		else {
			$('#all-skills-advice').hide();
			$('#missing-skills-advice').show();
		}
		if (skillsCount == 0) {
			$('#skills-summary').append("<li>" + noSelectMessage + " skills</li>");
			$('#skills-values-suggestion').slideUp('slow');
		}
	});

	//show advice based on decision making barrier checkbox selection
	$('input:checkbox[name="barrier"]').change(function() { 
		$('.barrier-list').html("");
		$('#reviewing-intro').hide();
		$('#review-sub-content .advice').hide();
		var noneSelected = true;
		$('input:checkbox[name="barrier"]').each(function() {
			var $this = $(this);
			$this.prop('disabled', false);
			if ($this.is(':checked')) {
				if ($this.attr('value') == 'None') {
					$('input:checkbox[name="barrier"]').removeAttr('checked').prop('disabled', true);
					$this.prop('checked', true).prop('disabled', false);
					$('.barrier-list').html("");
					$('#review-sub-content .advice').hide();
					$('#reviewing-intro').hide();
					$('.8 p').show();
				}
				else {
					$('#reviewing-intro').show();
				}
				noneSelected = false;
				var checkClass = $this.attr('class');
				var checkVal = $this.attr('value');
				$('#review-sub-content .advice').each(function() {
					var $this = $(this);
					var adviceID = $this.attr('id');
					if (checkClass.indexOf(adviceID) >= 0) {
						if (adviceID != "none") {
							var barrierListSelector = '#' + adviceID + ' .barrier-list';
							$(barrierListSelector).append("<li>You selected: <em>" + checkVal + "</em></li>");
						}
						$this.show();
					}
				});
			}
		});
		noneSelected ? $('.no-selection').show() : $('.no-selection').hide();
	});

	$('input:radio, input:checkbox').change(function() {
		$this = $(this);
		if ($this.is(':checked')) {
			$this.attr('checked', true);
		}
		else {
			$this.removeAttr('checked');
		}
		if ($('#save-button').html() != 'Save progress') {
			$('#save-button').html('Save progress');
		}
	});
});