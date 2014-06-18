//globals
var noSelectMessage = "You have not selected any";
var totalSkills = $('input:checkbox[name="skill"]').length;
var totalValues = $('input:checkbox[name="value"]').length;
var right = "&#9656; ";
var down = "&#9662; ";
var up = "&#9652; ";
var nextButton = "<button class='next-subsection' type='button'>Next</button>";
var skipButton = "<button class='skip-section' type='button'>Skip this section</button>";
var summaryButton = "<button class='get-summary' type='button'>Save summary</button>";
var closeButton = "<button id='close-popup' class='next-subsection' type='button'>Close</button>";

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

//set up
$('input:checkbox, input:radio').removeAttr('checked'); //for mozilla
$('.section-content').hide();
$('.sub-content').hide();
$('.suggestion').hide();
$('#further-sub-content .suggestion').show();
$('#reviewing-intro').hide();
$('#skills-values-suggestion').hide();
$('.skill-value-advice').hide();
$('#review-sub-content .advice').hide();
$('#skills-summary').append("<li>" + noSelectMessage + " skills.</li>");
$('#values-summary').append("<li>" + noSelectMessage + " values.</li>");
$('#review-sub-content .advice h4').after('<ul class="barrier-list"></ul>');
$('.toggler').prepend("<span class='toggle-arrow'>" + right + "</span>");
$('#forme-sub-content').append(skipButton);
$('.subsection:last-child .sub-content').append(summaryButton);
$('.sub-content').not('.check-option .sub-content').append(nextButton);
$('#final-popup').append(summaryButton);
$('#final-popup').append(closeButton);
$('#careerBuilder a').each(function() {
	var $this = $(this);
	$this.attr("target", "_blank");
});

//replace prop() with attr() if jQuery is older than 1.6
if (typeof jQuery.fn.prop != 'function') {
    jQuery.fn.prop = jQuery.fn.attr;
}

function triggerTogglers(e, $this) {
	var $thisSub = $this.closest('li');
	var $thisSection = $thisSub.closest('.section');
	var $h3Togglers = $thisSection.find('h3.toggler').not('.hidden');
	var $nextH3 = $thisSub.next().find('h3.toggler');
	if ($thisSub.is(':last-child')) {
		if ($thisSection.is(':last-child')) {
			$thisSection.find('h2.toggler').trigger(e.type);
			if (e.type == 'click') {
				var docHeight = $(document).height();
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
						'z-index': 9998
					});
					$("body").append($('#final-popup'));
					$('#final-popup').show();
			}
		}
		else { 
			var $nextH2 = $thisSection.next().find('h2.toggler');
			$nextH2.trigger(e.type);
			$thisSection.next().find('h3.toggler').not('.hidden').trigger(e.type);
		}
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
			sectionHTML += " " + $('label[for=' + radId + ']').text() + "</p>";
			var sugId = radId.substring(0, radId.length - 6); // 6 is length of "-radio"
			sectionHTML += $('#' + sub.id + '-sub-content #' + sugId).html();
		}
		else {
			sectionHTML += "<p>You didn't answer this question.</p>";
		}
	});
	return sectionHTML;
};

function getSummary($section) {
	var sectionID = $section.attr('id');
	var body = "";
	if (sectionID == cb.sections[0].id) {
		body += "<h2>Self-assessment</h2>";
		
		body += "<h3>Your skills</h3>";
		body += $('<div>').append($('#skills-summary').clone()).remove().html();
		body += $('#pdam-sub-content').children().html(); //hidden ones have display:none on element
		
		body+= "<h3>Your values</h3>";
		body += $('<div>').append($('#values-summary').clone()).remove().html();
		
		body+= "<h3>Next steps</h3>";
		body += $('#skills-values-suggestion').html();
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
		$adviceList.each(function() {
			var $advice = $(this);
			$advice.children().css('display', 'block');
			$advice.find(".toggle-arrow").remove();
			body += $(this).html();
		});
		
		body += "<h3>Further support and advice</h3>"
		body += $('#further-sub-content .suggestion').html();
	}
	else if (sectionID == cb.sections[3].id) {	
		body += buildSectionSummary(cb.sections[3]);
	}
	return body;
}

function saveSummary(e, $this) {
	var header = "<!doctype html><html><head>" +
				 "<title>Your Career Builder summary</title>" +
				 "<link rel=\"stylesheet\" type=\"text/css\" href=\"careerBuilder.css\">" +
				 "</head><body><h1>Your Career Builder summary</h1>" +
				 "<p>Here are your selections from Career Builder" + 
				 " along with our suggestions of the resources and services best suited to you.</p>";
	var footer = "</body></html>";
	var $section = $this.closest('.section');
	var body = "";
	if ($section.attr('id') == cb.sections[cb.sections.length - 1].id) {
		$.each(cb.sections, function(i, section) {
			body += getSummary($('#' + section.id));
		});
	}
	else {
		body += getSummary($section);
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

$('button.get-summary').click(function(e) { saveSummary(e, $(this)); });

$('#close-popup').click(function() {
	$('#overlay').remove();
	$('#final-popup').hide();
	$("html, body").animate({ scrollTop: 0 }, 500);
});

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

//show skills and values in list and remove skills from pdam set when selected
$('input:checkbox').change(function() {
	var $checked = $(this);
	if ($checked.attr('name') == 'skill' || $checked.attr('name') == 'value') { 
		$('#skills-summary').html("");
		$('#values-summary').html("");
		$('#missing-skill-list li').hide();
		$('#skills-values-suggestion').slideDown('slow');
		var skillsCount = 0;
		var valsCount = 0;
		$('input:checkbox').each(function() {
			var $this = $(this);
			var checkName = $this.attr('name');
			var checkVal = $this.attr('value');
			var checkClass = $this.attr('class');
			if ($this.is(':checked')) {
				if (checkName == 'skill') {
					$('#skills-summary').append("<li>" + checkVal + "</li>");
					skillsCount++;
				}
				else if (checkName == 'value') {
					$('#values-summary').append("<li>" + checkVal + "</li>");
					valsCount++;
				}
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
		if (valsCount > (totalValues/2)) {
			$('#too-many-values-advice').slideDown('slow');
		}
		else {
			$('#too-many-values-advice').slideUp('slow');
		}
		if (skillsCount == 0)
			$('#skills-summary').append("<li>" + noSelectMessage + " skills</li>");
		if (valsCount == 0)
			$('#values-summary').append("<li>" + noSelectMessage + " values</li>");
		if (skillsCount == 0 && valsCount == 0)
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
					var barrierListSelector = '#' + adviceID + ' .barrier-list';
					$(barrierListSelector).append("<li>You selected: <em>" + checkVal + "</em></li>");
					$this.show();
				}
			});
		}
	});
	noneSelected ? $('.no-selection').show() : $('.no-selection').hide();
});