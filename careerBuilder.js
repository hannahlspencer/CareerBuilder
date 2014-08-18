//globals
var noSelectMessage = "You have not selected any",
    totalSkills = $('input:checkbox[name="skill"]').length,
    right = "&#9656; ",
    down = "&#9662; ",
    up = "&#9652; ",
    nextButton = "<button class='next next-subsection' type='button'>Next</button>",
    nextSectionButton = "<button class='next next-section' type='button'>Next section</button>",
    skipButton = "<button class='skip-section' type='button'>Skip this section</button>",
    summaryButton = "<button class='get-summary' type='button'>Download section summary</button>",
    fullSummaryButton = "<button class='get-summary' type='button'>Download full summary</button>",
    closeButton = "<button id='close-popup' class='next' type='button'>Close</button>",
    cardSortStart = "<button id='start-card-sort' class='next' type='button'>Start</button>",
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

    var iScale = [{name: "Least important"}, {name: "Quite important"}, {name: "Important"}, {name: "Very important"}],
        vDeck = new Array();
        deck = document.getElementById('deck-container'),
        playingArea = document.getElementById('playing-area'),
        skipCardButton = document.getElementById('skip-button'),
        finishButton = document.getElementById('finish-button'),
        deckButton = document.getElementById('deck-button'),
        followUp = document.getElementById('follow-up');
    
    (function populateVDeck() {
        var vals = getTemplateElement('value-list').getElementsByClassName('value');
        for (var i = 0; i < vals.length; i++) {
            vDeck.push(new Value(vals[i].getElementsByClassName('title')[0].textContent, 
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
            newCol.getElementsByClassName('drop-zone')[0].setAttribute('id', id);
            playingArea.appendChild(newCol);
        }
    }

    function makeCard(val) {
        var card = getTemplateElement('value-card');
        card.setAttribute('id', 'card-' + val.id)
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

    function start() {
        makeCols();
        makeDeck();
        cardMoved();
    }

    /***IN-PROGRESS STATE***/

    function styleDeck() {
        var cards = deck.getElementsByClassName('value-card'),
            l = cards.length;
        for (var i = 0; i < l; i++) {
            cards[i].style.top = '-' + i + 'px';
            cards[i].style.left = '-' + i + 'px';
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
    
    function cardMoved() {
        updateDeckCount();
        styleDeck();
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
                alert("Maximum of " + dropLimit + " cards per heading!");
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
        var topCard = deck.getElementsByClassName('value-card')[0];
        deck.appendChild(topCard);
        styleDeck();
    }

    function isPotentiallyFinished() {
        return getDeckCount() == 0;
    }

    function restart() {
        finishButton.disabled = true;
        deck.innerHTML = "";
        playingArea.innerHTML = "";
        followUp.classList.add('hidden');
        start();
    }

    /***FINISH STATE***/

    function allowFinish() {
        finishButton.disabled = false;
        skipCardButton.disabled = true;
    }

    function finish() {
        var topLabel = document.getElementById('top-scale-label');
        topLabel.innerHTML = iScale[iScale.length - 1].name;
        followUp.classList.remove('hidden');
        window.scroll(0,findPos(followUp));
    }

    /***API***/

    return {
        start :            function()    {start();},
        restart :          function()    {restart();},
        finish :           function()    {finish();},
        skipCard :         function()    {skipCard();},
        pickUp :           function(e)   {pickUpCard(e)},
        allowDrop :        function(e)   {allowDrop(e);},
        deckButtonAction : function()    {deckButtonAction();},
        deckDrop :         function(e,t) {dropCardOnDeck(e,t);},
        playingAreaDrop :  function(e,t) {dropCardInPlayingArea(e,t);},
        toggleSelect :     function(e,t) {toggleSelect(e,t);},
        clickDrop :        function(e,t) {clickDrop(e,t);}
    };

}());

//set up
if (!loadProgress()) {
	cs.start();
	$('input:checkbox, input:radio').removeAttr('checked'); //for mozilla
	$('.section-content').hide();
	$('.sub-content').hide();
	$('.suggestion').hide();
	$('.section-level-buttons').hide();
	$('#further-sub-content .suggestion').show();
	$('#review-sub-content .suggestion').show();
	$('#reviewing-intro').hide();
	$('#skills-values-suggestion').hide();
	$('.skill-value-advice').hide();
	$('#card-sorter').hide();
	$('#review-sub-content .advice').hide();
	$('#skills-summary').append("<li>" + noSelectMessage + " skills.</li>");
	$('#review-sub-content .advice h4').after('<ul class="barrier-list"></ul>');
	$('.toggler').prepend("<span class='toggle-arrow'>" + right + "</span>");
	$('#forme-sub-content').append(skipButton);
	$('.sub-content').not('.check-option .sub-content').append(nextButton);
	$('.section-level-buttons').append(summaryButton).append(nextSectionButton);
	$('#final-popup').append(fullSummaryButton);
	$('#final-popup').append(closeButton);
	$('.section:last-of-type .next-section').text('What next?');
	$('#careerBuilder a').each(function() {
		var $this = $(this);
		$this.attr("target", "_blank");
	});
}

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
		localStorage.setItem('cb-html', $('#careerBuilder').html());
		$('#save-button').html('&#10004; Saved');
	} else {
		alert("Unable to save progress");
	}
}

function loadProgress() {
	if (supportsStorage()) {
		if (localStorage.getItem('cb-html') != undefined) {
			$('#careerBuilder').html(localStorage.getItem('cb-html'));
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

$('#close-cs').click(function() {
	closePopup('cs-container');
});

$('#close-popup').click(function() {
	closePopup('final-popup');
});

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
		});
	$('body').append('<div id="clear-overlay"></div>');
	$('#clear-overlay')
		.height(docHeight)
		.css({
			'position': 'absolute',
			'top': 0,
			'left': 0,
			'width': '100%',
			'z-index': z - 1
		}).append($popup);
	$popup.show();
	$("html, body").animate({ scrollTop: 0 }, 500);
}

function triggerTogglers(e, $this) {
	var $thisSub = $this.closest('li');
	var $thisSection = $this.closest('.section');
	var $h3Togglers = $thisSection.find('h3.toggler').not('.hidden');
	var $nextH3 = $thisSub.next().find('h3.toggler');
	if ($this.hasClass('next-section')) {
		if ($thisSection.is(':last-of-type')) {
			$thisSection.find('h2.toggler').trigger(e.type);
			if (e.type == 'click') {
				showPopup(9999, $('#final-popup'));
			}
		}
		else {
			var $nextH2 = $thisSection.next().find('h2.toggler');
			$nextH2.trigger(e.type);
			$thisSection.next().find('h3.toggler').not('.hidden').trigger(e.type);
		}
	}
	else if ($thisSub.is(':last-child') && e.type == 'click') {
		$thisSection.find('.section-level-buttons').slideDown();
	}
	else {
		if ($nextH3.is('.hidden')) {
			$nextH3.trigger(e.type);
		}
	}
	$h3Togglers.not($nextH3).trigger(e.type);
}

function skipSectionTrigger(e, $this) {
	var $lastButton = $this.closest('.section').find('.next-subsection:last');
	triggerTogglers(e, $lastButton);
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
				 "</head><body id=\"careerBuilder-summary\"><h1>Your Career Builder summary</h1>" +
				 "<p>Here are your selections from <a href=\"http://lse.ac.uk/careerbuilder\">Career Builder</a>" + 
				 " along with our suggestions of the resources and services best suited to you.</p>";
	var footer = "</body></html>";
	var sId = $this.closest('.section').attr('id');
	var body = "";
	if (sId == cb.sections[cb.sections.length - 1].id) {
		$.each(cb.sections, function(i, section) {
			if (section.id != "final-popup") {
				body += getSummary(section.id);
			}
		});
	}
	else {
		body += getSummary(sId);
	}
	body += "<h2>Next steps in your career planning</h2>";
	$('#final-popup').children().each(function(i) {
		if (i == 1 || i == 2) {
			body += "<p>" + $(this).html() + "</p>";
		}
	});
	var html = header + body + footer;
	var oSummaryBlob = new Blob([html], {type: 'text/html'});
	saveAs(oSummaryBlob, "Career Builder summary.html");
}

$('.toggler').hover(
	function() {
		var $this = $(this);
		$this.children('.toggle-arrow').html($this.hasClass('hidden') ? down : up);
		$this.children('.toggle-arrow').css('color', 'white');
		if($this.is('h2')) {
			$('h2.toggler').not('.hidden').each(function() {
				$(this).children('.toggle-arrow').html(up);
			});
		}
	},
	function() {
		var $this = $(this);
		$this.children('.toggle-arrow').html($this.hasClass('hidden') ? right : down);
		$this.children('.toggle-arrow').removeAttr('style');
		if($this.is('h2')) {
			$('h2.toggler').not('.hidden').each(function() {
				$(this).children('.toggle-arrow').html(down);
			});
		}
	}
);
	
//toggle section & subsection visibility
$('.toggler').click(function() {
	var $this = $(this);
	$this.toggleClass('hidden');
	$this.siblings().slideToggle('slow', function() {
		$this.children('.toggle-arrow').html($this.hasClass('hidden') ? right : down).removeAttr('style');
	});
	if($this.is('h2')) {
		$('h2.toggler').not($this).not('.hidden').each(function() {
			var $thisH2 = $(this);
			$thisH2.addClass('hidden');
			$thisH2.siblings().slideUp('slow', function() {
				$thisH2.children('.toggle-arrow').html(right);
			});
		});
	}
});

$('.section1-trigger').click(function(e) { $('#who-head').trigger(e); });

$('.section1-trigger').hover(	
	function(e) { $('#who-head').trigger(e); },
	function(e) { $('#who-head').trigger(e); }
);

$('.section2-trigger').click(function(e) { $('#research-head').trigger(e); });

$('.section2-trigger').hover(	
	function(e) { $('#research-head').trigger(e); },
	function(e) { $('#research-head').trigger(e); }
);

$('.section3-trigger').click(function(e) { $('#decision-head').trigger(e); });

$('.section3-trigger').hover(	
	function(e) { $('#decision-head').trigger(e); },
	function(e) { $('#decision-head').trigger(e); }
);

$('button.next-subsection').click(function(e) { triggerTogglers(e, $(this)); });

$('button.next-subsection').hover(
	function(e) { triggerTogglers(e, $(this)); },
	function(e) { triggerTogglers(e, $(this)); }
);

$('button.skip-section').click(function(e) { skipSectionTrigger(e, $(this)); });

$('button.skip-section').hover( 
	function(e) { skipSectionTrigger(e, $(this)); },
	function(e) { skipSectionTrigger(e, $(this)); }
);

$('button.next-section').click(function(e) { triggerTogglers(e, $(this)); });

$('button.next-section').hover( 
	function(e) { triggerTogglers(e, $(this)); },
	function(e) { triggerTogglers(e, $(this)); }
);

$('button.get-summary').click(function(e) { saveSummary(e, $(this)); });

//expand advice according to radio button selection
$('input:radio').change(function() {
	$('input:radio').each(function() {
		var $this = $(this);
		var qName = $this.attr('name');
		var qVal = $this.attr('value');
		var sID = qName + '-' + qVal;
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
		var $this = $(this);
		var checkName = $this.attr('name');
		var checkVal = $this.attr('value');
		var checkClass = $this.attr('class');
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

$('#start-card-sort').click(function(e) {
	showPopup(9999, $('#cs-container'));
});