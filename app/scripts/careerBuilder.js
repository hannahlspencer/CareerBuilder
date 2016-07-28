//globals
var totalSkills       = $('input:checkbox[name="skill"]').length,
    nextButton        = "<button class='next next-subsection' type='button'>Next</button>",
    nextSectionButton = "<button class='next next-section' type='button'>Next section</button>",
    skipButton        = "<button class='skip-section' type='button'>Skip this section</button>",
    summaryButton     = "<button class='get-summary next' type='button'>Download section summary</button>",
    fullSummaryButton = "<button class='get-summary' type='button'>Download full summary</button>",
    saveButton        = '<button id="save-button" disabled>Save progress</button>',
    startAgainButton  = '<button id="clear-button">Start again</button>',
    summaryButton     = '<button class="get-summary">Download summary</button>',
    closeButton       = '<button class="next close-popup" type="button">Close</button>',
    cardSortStart     = '<button id="start-card-sort" type="button">Open value sorting task</button>',
    printButton       = '<button id="print-summary" type="button" onclick="window.print()">Print summary</button>',
    cardSortInProgess = false,
    openPopup         = '';

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
" font-family: Arial, sans serif;" +
" max-width: 760px;" +
" margin: 0 auto;" +
" padding: 1em;" +
"}" +
"#careerBuilder-summary a," +
"#careerBuilder-summary a:hover," +
"#careerBuilder-summary a:visited {" +
" color: red;" +
"}" +
"#careerBuilder-summary #print-summary {" +
" float: right;" +
" margin-top: 30px;" +
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
" list-style: square;" +
"}" +
"#careerBuilder-summary h5 {" +
" font-size: 1em;" +
"}" +
"#careerBuilder-summary .advice {" +
" background: #F2F2F2;" +
" padding: 0 1em;" +
" overflow: auto;" +
" " +
"}" +
"#careerBuilder-summary .section-summary {" +
" border: 4px solid;" +
" padding: 0 1em 1em 1em;" +
" margin: 1em 0;" +
" background: white;" +
"}" +
"#careerBuilder-summary #who-summary {" +
" border: 4px solid #F58621;" +
"}" +
"#careerBuilder-summary #who-summary h2 {" +
" color: #F58621;" +
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
" border: 4px solid #1999D4;" +
"}" +
"#careerBuilder-summary #research-summary h2 {" +
" color: #1999D4;" +
"}" +
"#careerBuilder-summary #decision-summary {" +
" border: 4px solid #936AB0;" +
"}" +
"#careerBuilder-summary #decision-summary h2 {" +
" color: #936AB0;" +
"}" +
"#careerBuilder-summary #achieving-summary {" +
" border: 4px solid #2FB64B;" +
"}" +
"#careerBuilder-summary #achieving-summary h2 {" +
" color: #2FB64B;" +
"}";

/*********CARD SORTING MODULE*********/
var cs =
(function() {

  //getElementsByClassName IE8 polyfill
  (function(d,g){d[g]||(d[g]=function(g){return this.querySelectorAll("."+g)},Element.prototype[g]=d[g])})(document,"getElementsByClassName");

    /***VARIABLES***/

    function Value(name, description) {
        this.name = name;
        this.description = description;
    }

    var iScale = [
                  {name: "Least important"},
                  {name: "Quite important"},
                  {name: "Important"},
                  {name: "Most important"}
                 ],
        vDeck = new Array(),
        cardSorter = document.getElementById('cs-container'),
        deck = document.getElementById('deck-container'),
        playingArea = document.getElementById('playing-area'),
        skipCardButton = document.getElementById('skip-button'),
        finishButton = document.getElementById('finish-button'),
        deckButton = document.getElementById('deck-button'),
        restartButton = document.getElementById('restart-button');

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

    /***START STATE***/

    function makeCols() {
        for (var i = 0; i < iScale.length; i++) {
            var newCol    = getTemplateElement('playing-col'),
                colHeader = iScale[i].name,
                headElem  = newCol.getElementsByClassName('importance-level')[0],
                headId    = 'importance-' + i;
            newCol.setAttribute('id', 'col-' + i);
            newCol.setAttribute('aria-labelledby', headId);
            colHeader += ' - <span class="col-card-count"></span>/' + dropLimit;
            headElem.innerHTML = colHeader;
            headElem.setAttribute('id', headId);
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
        var card   = getTemplateElement('value-card'),
            name   = card.getElementsByClassName('value-name')[0],
            desc   = card.getElementsByClassName('value-description')[0],
            nameId = 'name-' + val.id,
            descId = 'desc-' + val.id;
    name.setAttribute('id', nameId);
    name.innerHTML = val.name;
    desc.setAttribute('id', descId);
    desc.innerHTML = val.description;
    card.setAttribute('id', 'card-' + val.id);
        card.setAttribute('aria-labelledby', nameId);
        card.setAttribute('aria-describedby', descId);
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
      playingArea.style.minHeight = playingArea.style.height = (l * 123) + 'px';
    }

    function start() {
        deckButton.onclick = deckButtonAction;
        restartButton.onclick = restart;
        skipCardButton.onclick = skipCard;
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
            card.setAttribute('tabindex', '');
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

    function isPotentiallyFinished() {
        return getDeckCount() == 0;
    }

    function setTopCardDraggable() {
        var top = deck.lastChild;
        top.setAttribute('draggable', 'true');
        top.style.cursor = 'move';
        top.setAttribute('tabindex', 0);
    top.focus();
    }

    function cardMoved() {
        updateDeckCount();
        styleDeck();
        if (!isPotentiallyFinished())
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
        event.preventDefault();
        var data = event.dataTransfer.getData("text"),
            card = document.getElementById(data);
        addCardToPlayingArea(card, col);
    }

    function setColumnsFocusable() {
      var cols = cardSorter.getElementsByClassName('playing-col');
    for (var i = 0; i < cols.length; i++) {
      cols[i].setAttribute('tabindex', 0);
    }
    }

    function unsetColumnsFocusable() {
      var cols = cardSorter.getElementsByClassName('playing-col');
    for (var i = 0; i < cols.length; i++) {
      cols[i].setAttribute('tabindex', '');
    }
    }

    function toggleSelect(event, target) {
        event = event || window.event;
        if (event.type == 'click' ||
           (event.type == 'keyup' && event.keyCode == '13')) {
      deckButton.disabled = true;
      var selected = document.getElementsByClassName('selected')[0];
      if (selected != undefined) {
        selected.classList.remove('selected');
      }
      if (target.parentElement == deck) {
        target = deck.lastChild;
      }
      if (target != selected) { //a new card has been selected
        target.classList.add('selected');
        setColumnsFocusable();
        if (target.parentElement != deck) {
          deckButton.disabled = false;
        }
      }
      else { //card has been unselected
        unsetColumnsFocusable();
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
        event = event || window.event;
        if (event.type == 'click' ||
           (event.type == 'keyup' && event.keyCode == '13')) {
      var card = document.getElementsByClassName('selected')[0];
      if (card != undefined) {
        card.classList.remove('selected');
        unsetColumnsFocusable();
        addCardToPlayingArea(card, col);
      }
        }
    }

  /*Button actions*/

    function deckButtonAction() {
        var selected = document.getElementsByClassName('selected')[0];
        if (selected != undefined) {
            appendToDeck(selected.id);
            selected.classList.remove('selected');
            deckButton.disabled = true;
        }
        else {
            alert("No value selected!");
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

    function restart() {
        deckButton.onclick = null;
        skipCardButton.onclick = null;
        restartButton.onclick = null;
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
    $('#save-button').html('&#10004; Saved').attr('disabled', 'disabled');
    showPopup(9999, $('#save-popup'));
  } else {
    alert("Unable to save progress");
  }
}

function loadProgress() {
  if (supportsStorage()) {
    if (localStorage.getItem('cb-html') != undefined) {
      $('#save-area').html(localStorage.getItem('cb-html'));
      $('#clear-button').removeAttr('disabled');
      cs.restart();
      return true;
    }
  }
  return false;
}

function clearAll() {
  if (supportsStorage()) {
    localStorage.removeItem('cb-html');
    $('#save-area').html(localStorage.getItem('cb-default-html'));
    $('#save-button').html('Save progress');
    registerHandlers();
    cs.restart();
  }
  else {
    document.location.reload(true);
  }
  $('#clear-button, #save-button, #careerBuilderGuide .get-summary')
     .attr('disabled', 'disabled');
}

var trapFocus = function(e) {
  if (window.location.hash != '') {
    var popup = document.getElementById(openPopup);
    if (!popup.contains(e.target)) {
      e.stopPropagation();
      popup.focus();
    }
  }
  else {
    document.removeEventListener('focus', trapFocus, true);
  }
};

function closePopup(popupId) {
  window.location.hash = '';
    history.pushState('', document.title, window.location.pathname);
  $('#popups').append($('#'+popupId));
  $('#overlay, #clear-overlay').remove();
}

function showPopup(z, $popup) {
  var docHeight = $(document).height(),
      pid = $popup.attr('id');
  $('body').append('<div id="overlay"></div>');
  $('#overlay')
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
  $popup.slideDown('slow').focus();
  window.location.hash = pid;
  document.addEventListener('focus', trapFocus, true);
  $('html, body').animate({ scrollTop: 0 }, 500);
}

function registerTriggerProxies(a) {
  $.each(a, function(i, val) {
    var $i = $(i), $val = $(val),
      controls = $val.attr('aria-controls');
    $i.attr('aria-controls', controls);
    $i.click(function(e) {
      if (!($('#' + controls).attr('aria-hidden') == 'false')) {
        $val.trigger(e);
      }
      $('html, body').animate({
        scrollTop : $('#' + controls).offset().top
      }, 1000);
    });
    $i.hover(
      function(e) {
          if (!($('#' + controls).attr('aria-hidden') == 'false')) {
            $val.trigger(e);
          }
      },
      function(e) {
          if (!($('#' + controls).attr('aria-hidden') == 'false')) {
            $val.trigger(e);
          }
      }
    );
  });
}

function triggerTogglers(e, $this) {
  var $thisSub = $this.closest('li'),
      $thisSection = $this.closest('.section'),
      $h3Togglers = $thisSection.find('h3 > .toggler').not('.closed'),
      $nextH3 = $thisSub.next().find('h3 > .toggler');
  $h3Togglers.not($nextH3).trigger(e.type);
  if ($this.hasClass('next-section')) {
    if ($thisSection.is('#achieving')) {
      $thisSection.find('h2 > .toggler').trigger(e.type);
      if (e.type == 'click') {
        showPopup(9999, $('#final-popup'));
      }
    }
    else {
      var $nextH2 = $thisSection.next().find('h2 > .toggler');
      $nextH2.trigger(e.type);
      $thisSection.next().find('h3 > .toggler').not('.closed').trigger(e.type);
    }
  }
  else if ($thisSub.is(':last-child') && e.type == 'click') {
    $thisSection.find('.section-level-buttons').slideDown()
        .find('button.get-summary').focus();
  }
  else {
    if ($nextH3.is('.closed')) {
      $nextH3.trigger(e.type);
    }
  }
}

function skipSectionTrigger(e, $this) {
  var $lastButton = $this.closest('.section').find('.next-subsection:last');
  triggerTogglers(e, $lastButton);
}

function buildCardSortSummary() {
  var csData = cs.getData(),
      summary = "";
  for (var i = csData.length - 1; i >= 0; i--) {
    summary += "<li><span class='importance-level'>" + csData[i].column.title + "</span><ul class='value-list'>";
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
      sectionHTML += "<p>" + $('#' + sub.id + '-sub-content legend').first().html();
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
    body += "<h2>Self-assessment</h2>          <h3>Your skills</h3>";

    body += $('<div>').append($('#skills-summary').clone()).remove().html();
    body += $('#pdam-sub-content').children().html(); //hidden ones have display:none on element

    body+= "<h3>Your values</h3>";
    body += $('<div>').append($('#values-summary').clone()).remove().html();

    body+= "<h3>Next steps</h3>           <div class=\"advice\">";
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

    body += "<h3>Further support and advice</h3> <div class=\"advice\">";
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
  var iconURL = 'http://www.lse.ac.uk/intranet/CareersAndVacancies/careersService/images/Icons/',
      header = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\"><html><head>" +
         "<title>Your Career Builder summary</title>" +
         '<link rel="icon" type="image/x-icon" href="http://www.lse.ac.uk/favicon.ico">' +
         '<link rel="shortcut icon" type="image/x-icon" href="http://www.lse.ac.uk/favicon.ico">' +
         "<style>" + cbSummaryStyle + "</style>" +
         "</head><body id=\"careerBuilder-summary\">" + printButton +
         "<h1>Your Career Builder summary</h1>" +
         "<p>Here are your selections from <a href=\"http://lse.ac.uk/careerbuilder\">Career Builder</a>" +
         " along with our suggestions of the resources and services best suited to you.</p>",
      footer = "</body></html>",
      fileName = "CareerBuilder";
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

function allowFullDownload() {
  $('#careerBuilderGuide .get-summary').removeAttr('disabled');
}

function allowSave() {
  $('#save-button').removeAttr('disabled').html('Save progress');
  $('#clear-button').removeAttr('disabled');
}

function registerHandlers() {

  window.addEventListener('hashchange', function() {
    var popups = [],
        h = window.location.hash.substring(1);

    $('.popup').each(function() {
      popups.push($(this).attr('id'));
    });

    if ($.inArray(h, popups) > -1) {
      openPopup = h;
    }
    if (h == '' && openPopup != '') {
      closePopup(openPopup);
      openPopup = '';
    }
  }, false);

  registerTriggerProxies({
    '.section1-trigger'   : '#who-head > .toggler',
    '.section2-trigger'   : '#research-head > .toggler',
    '.section3-trigger'   : '#decision-head > .toggler',
    'button.skip-section' : '#achieving-head > .toggler',
    '.values-trigger'     : '#start-card-sort',
    '.skills-trigger'     : '#skills-sub > h3 > .toggler'
  });

  $('#close-cs').click(function() {
    closePopup('cs-container');
    $('#start-card-sort').focus();
  });

  $('.close-popup').click(function() {
    closePopup($(this).parent().attr('id'));
  });

  $('.toggler').hover(
    function() {
      var $this = $(this),
          $head = $this.parent();
      $this.addClass($this.hasClass('closed') ? 'opening' : 'closing');
      if($head.is('h2')) {
        $('h2 > .toggler').not('.closed').each(function() {
          $(this).addClass('closing');
        });
      }
    },
    function() {
      var $this = $(this),
          $head = $this.parent();
      $this.removeClass($this.hasClass('closed') ? 'opening' : 'closing');
      if($head.is('h2')) {
        $('h2 > .toggler').not('.closed').each(function() {
          $(this).removeClass('closing');
        });
      }
    }
  );

  //toggle section & subsection visibility
  $('.toggler').click(function() {
    var $this = $(this),
        $head = $this.parent(),
        state = $this.attr('aria-expanded') === 'false' ? true : false;
    $this.toggleClass('closed')
         .attr('aria-expanded', state)
         .focus();
    $head.next()
       .attr('aria-hidden', !state)
       .slideToggle('slow', function() {
         $this.removeClass('opening').removeClass('closing');
    });
    //close other sections
    if($head.is('h2')) {
      $('h2 > .toggler').not($this).not('.closed').each(function() {
        $(this).addClass('closed')
               .removeClass('closing')
               .attr('aria-expanded', false)
                   .parent().siblings()
                   .attr('aria-hidden', true)
                   .slideUp('slow', function() {
                     $this.removeClass('opening')
                          .removeClass('closing');
        });
      });
    }
    return false;
  });

  $('button.next-subsection, button.next-section').click(function(e) {
      triggerTogglers(e, $(this));
  });

  $('button.next-subsection, button.next-section').hover(
    function(e) { triggerTogglers(e, $(this)); },
    function(e) { triggerTogglers(e, $(this)); }
  );

  $('#careerBuilder button.get-summary').click(function(e) {
    saveSummary(e, $(this));
    return false;
  });

  $('#finish-button').click(function(e) {
    buildCardSortSummary();
    closePopup('cs-container');
    allowFullDownload();
    if ($('#values-sub-content').attr('aria-hidden') == 'true') {
      $('button.toggler[aria-controls=values-sub-content]').click();
    }
    $('#cs-suggestion, #skills-values-suggestion').slideDown('slow');
    $('html, body').animate({
            scrollTop: $("#values-sub").offset().top
        }, 1000);
    $('#start-card-sort').focus();
    return false;
  });

  $('#start-card-sort').click(function(e) {
    showPopup(9999, $('#cs-container'));
    $(this).html("Continue value sorting task");
    return false;
  });

  $('.trigger-link').keyup(function(event) {
    event = event || window.event;
    if (event.keyCode === 32) {
      $(this).click();
    }
  });

  //expand advice according to radio button selection
  $('input[type=radio]').change(function() {
    var qName = $(this).attr('name');
    $('input[type=radio][name=' + qName + ']').each(function() {
      var $this = $(this),
          $s   = $('#' + qName + '-' + $this.val()),
          state = $this.is(':checked');
      $s.attr('aria-hidden', !state);
      state ? $s.slideDown('slow') : $s.slideUp('slow');
    });
  });

  //show skills in list and remove skills from pdam set when selected
  $('input[name=skill]').change(function() {
    var $checked = $(this);
    $('#skills-summary').html("");
    $('#missing-skill-list li').hide();
    $('#skills-values-suggestion').slideDown('slow');
    var skillsCount = 0;
    $('input[name=skill]').each(function() {
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
      $('#skills-summary').append('<li><span class="trigger-link skills-trigger">                                        You haven\'t selected any skills.                                     </span></li>');
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
        var checkClass = $this.attr('class'),
            checkVal = $this.attr('value');
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
    allowFullDownload();
    allowSave();
  });

  $('#careerBuilder button').click(function() {
    allowSave();
  });
}

$(function() {

  if (supportsStorage) {
    $('#careerBuilderGuide').append($(saveButton).click(function() {
      saveProgress();
      return false;
    }));
  }
  $('#careerBuilderGuide')
    .append($(startAgainButton).attr('disabled', 'disabled').click(function() {
      clearAll();
      return false;
    }))
    .append($(summaryButton).attr('disabled', 'disabled').click(function(e) {
      saveSummary(e, $(this));
      return false;
  }));

  $('#final-popup').append($(fullSummaryButton).click(function(e) {
    saveSummary(e, $(this));
    return false;
  }));
  $('#final-popup, #save-popup').append(closeButton);

  if (!loadProgress()) { //progress not saved
    cs.start();
    $('#careerBuilder').removeClass('no-js');
    $('input:checkbox, input:radio').removeAttr('checked'); //for mozilla
    $('#values-sub-content').append(cardSortStart);
    $('.section-content').append('<div class="section-level-buttons hidden"></div>');
    $('#skills-summary').append(
        '<li><a class="trigger-link skills-trigger">Select your skills</a></li>'
    );
    $('#values-summary').append(
      '<li><a class="trigger-link values-trigger">Finish the value sorting task</a></li>'
    );
    $('#review-sub-content').prepend(
      '<p class="no-selection">Please select one or more decision making barriers from the section above.</p>' +
      '<p id="reviewing-intro" class="hidden">We have grouped the decision making barriers you have selected into themes.</p>'
    );
    $('#review-sub-content .advice h4').after('<ul class="barrier-list"></ul>');
    $('#forme-sub-content').append(skipButton);
    $('.sub-content').not('.check-option .sub-content').append(nextButton);
    $('.section-level-buttons').append(summaryButton).append(nextSectionButton);
    $('.section:last-of-type .next-section').text('What next?');
    $('#careerBuilder a').each(function() {
      $(this).attr("target", "_blank");
    });
    $('a[href$=".pdf"]').after(
      '<span class="link-icon link-icon-pdf" title="PDF">&#x1F4C4;</span>'
    );
    $('a[href^="https://careers"]').after(
      '<span class="link-icon link-icon-private" title="CareerHub login required">&#x1F512;</span>'
    );
    $('a[href*="/internal/exclusive"]').after(
      '<span class="link-icon link-icon-private" title="LSE IT account required">&#x1F512;</span>'
    );

    $('.hidden').hide();

    //set up ARIA attributes
    $('.toggle-parent').each(function() {
      var $this = $(this),
          $next = $this.next();
      $this.wrapInner('<button class="toggler closed" aria-expanded="false" aria-controls="'+ $next.attr('id') +'">');
      $next.attr('aria-hidden', true);
    });
    $('.popup').attr('role', 'dialog');
    $('input[name="skill"]').each(function() {
      var $this = $(this),
          label = $this.attr('class');
      $this.attr('aria-labelledby', label + '-head');
    });
    $('button.next, button.skip-section').each(function() {
      var $this = $(this),
          $thisSection = $this.closest('.section'),
          id = '';
      if ($this.is('.next-subsection')) {
        var $thisSub = $this.closest('.subsection');
        if ($thisSub.is(':last-child')) {
          id = $thisSection.attr('id') + '-buttons';
          $thisSection.find('.section-level-buttons').attr('id', id);
        }
        else {
          id = $thisSub.next('.subsection').find('.sub-content').attr('id');
        }
      }
      else if ($this.is('.next-section, .skip-section')) {
        if ($thisSection.is(':last-child')) {
          id = 'final-popup';
        }
        else {
          id = $thisSection.next('.section').find('.section-content').attr('id');
        }
      }
      $this.attr('aria-controls', id);
    });
    $('button#start-card-sort').attr('aria-controls', 'cs-container');
    $('input[type=radio]').each(function() {
      var $this = $(this),
          id = $this.attr('name') + '-' + $this.val();
      $this.attr('aria-controls', id);
      $('#' + id).attr('aria-hidden', true);
    });
    $('.trigger-link').each(function() {
      $(this).attr('role', 'button')
             .attr('tabindex', 0);
    });
    if (supportsStorage()) {
      localStorage.setItem('cb-default-html', $('#save-area').html());
    }
  } //progress not saved end

  registerHandlers();

});
