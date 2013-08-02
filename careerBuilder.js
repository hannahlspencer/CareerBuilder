//globals
var noSelectMessage = "You have not selected any";
var totalSkills = $('input:checkbox[name="skill"]').length;
var totalValues = $('input:checkbox[name="value"]').length;
var right = "&#9656; ";
var down = "&#9662; ";
var up = "&#9652; ";
var nextButton = "<button class='next-subsection' type='button'>Next</button>";

function triggerTogglers(e, $this) {
	var $thisSub = $this.closest('li');
	var $thisSection = $thisSub.closest('.section');
	var $h3Togglers = $thisSection.find('h3.toggler').not('.hidden');
	$h3Togglers.trigger(e.type);
	if ($thisSub.is(':last-child')) {
		if ($thisSection.is(':last-child')) {
			$thisSection.find('h2.toggler').trigger(e.type);
		}
		else { 
			var $nextH2 = $thisSection.next().find('h2.toggler');
			$nextH2.trigger(e.type);
			$thisSection.next().find('h3.toggler').not('.hidden').trigger(e.type);
		}
	}
	else {
		var $nextH3 = $thisSub.next().find('h3.toggler');
		$nextH3.trigger(e.type);
	}
}

//set up
$('input:checkbox, input:radio').removeAttr('checked'); //unchecks boxes which remain checked in moz after refreshing
$('.section-content').hide();
$('.sub-content').hide();
$('.suggestion').hide();
$('#further-sub-content .suggestion').show();
$('.advice p').hide();
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
			var headID = $this.attr('id');
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
			var headID = $this.attr('id');
			$('h2.toggler').not('.hidden').each(function() {
				$(this).children('.toggle-arrow').html(down);
			});
		}
	}
);
	
$('.toggler').click(function() { //toggle section & subsection visibility
	var $this = $(this);
	$this.toggleClass('hidden');
	$this.siblings().slideToggle('slow', function() {
		$this.children('.toggle-arrow').html($this.hasClass('hidden') ? right : down).removeAttr('style');
	});
	if($this.is('h2')) {
		var headID = $this.attr('id');
		$('h2.toggler').each(function() {
			var $thisH2 = $(this);
			if ($thisH2.attr('id') != headID) {
				$thisH2.addClass('hidden');
				$thisH2.siblings().slideUp('slow', function() {
					$thisH2.children('.toggle-arrow').html($thisH2.hasClass('hidden') ? right : down);
				});
			}
		});
	}
	if (!$this.hasClass('hidden')) {
		$('html,body').animate({scrollTop: $this.offset().top});
	}
});

$('button.next-subsection').click(function(e) {
	triggerTogglers(e, $(this));
});

$('button.next-subsection').hover(
	function(e) {
		triggerTogglers(e, $(this));
	},
	function(e) {
		triggerTogglers(e, $(this));
	}
);

$('input:radio').change(function() { //expand advice according to radio button selection
	$('input:radio').each(function() {
		var $this = $(this);
		var qName = $this.attr('name');
		var qVal = $this.attr('value');
		var sID = qName + '-' + qVal;
		$this.is(':checked') ? $('#' + sID).slideDown('slow') : $('#' + sID).slideUp('slow');
	});
});

$('input:checkbox').change(function() {
	var $checked = $(this);
	if ($checked.attr('name') == 'skill' || $checked.attr('name') == 'value') { //add selected checkbox items to summary lists
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
				var missingSkillTargetId = '#missing-skill-list #' + checkClass;
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
				$('.7 p').show();
			}
			else
				$('#reviewing-intro').show();
			noneSelected = false;
			var checkClass = $this.attr('class');
			var checkVal = $this.attr('value');
			$('#review-sub-content .advice').each(function() {
				var $this = $(this);
				var adviceID = $this.attr('id');
				if (checkClass.indexOf(adviceID) >= 0) {
					$('#' + adviceID + ' .barrier-list').append("<li>You selected: <em>" + checkVal + "</em></li>");
					$this.show();
				}
			});
		}
	});
	noneSelected ? $('.no-selection').show() : $('.no-selection').hide();
});