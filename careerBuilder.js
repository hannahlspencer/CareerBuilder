//globals
var noSelectMessage = "You have not selected any";
var totalSkills = $('input:checkbox[name="skill"]').length;
var totalValues = $('input:checkbox[name="value"]').length;
var right = "&#9656; ";
var down = "&#9662; ";
var up = "&#9652; ";
var nextButton = "<button class='next-subsection' type='button'>Next</button>";

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
						'z-index': 4999
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
$('.toggler').prepend("<span class='toggle-arrow'>" + right + "</span>");
$('.sub-content').not('.check-option .sub-content').append(nextButton);

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

$('#close-popup').click(function() {
	$('#overlay').remove();
	$('#final-popup').hide();
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