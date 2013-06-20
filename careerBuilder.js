var noSelectMessage = "You have not selected any";
var totalSkills = $('input:checkbox[name="skill"]').length;
var up = "&#9662; ";
var down = "&#9656; ";

//set up
$('.section-content').hide();
$('.sub-content').hide();
$('.suggestion').hide();
$('.advice p').hide();
$('#skills-values-suggestion').hide();
$('#all-skills-advice').hide();
$('#review-sub-content .advice').hide();
$('#skills-summary').append("<li>" + noSelectMessage + " skills.</li>");
$('#values-summary').append("<li>" + noSelectMessage + " values.</li>");
$('.toggler').prepend("<span class='toggle-arrow'>" + down + "</span>");

function toggleWithArrow($target, speed) {
	$target.toggleClass('hidden');
	$target.siblings().slideToggle(speed, function() {
		$target.children('.toggle-arrow').html($target.hasClass('hidden') ? down : up);
	});
}

$('.toggler').click(function() { //toggle section & subsection visibility
	var $this = $(this);
	toggleWithArrow($this, 'slow');
	if($this.is('h2')) {
		var headID = $this.attr('id');
		$('h2.toggler').each(function() {
			var $thisH2 = $(this);
			if ($thisH2.attr('id') != headID) {
				$thisH2.addClass('hidden');
				$thisH2.siblings().slideUp('slow', function() {
					$thisH2.children('.toggle-arrow').html($thisH2.hasClass('hidden') ? down : up);
				});
			}
		});
  }
});

$('input:radio').change(function() { //expand advice according to radio button selection
	$('input:radio').each(function() {
		var qName = this.name;
		var qVal = this.value;
		var sID = qName + '-' + qVal;
		$(this).is(':checked') ? $('#' + sID).show('slow') : $('#' + sID).hide();
	});
});

$('input:checkbox').change(function() {
	var $checked = $(this);
	if ($checked.attr('name') == 'skill' || $checked.attr('name') == 'value') { //add selected checkbox items to summary lists
		$('#skills-summary').html("");
		$('#values-summary').html("");
		$('#missing-skill-list li').hide();
		$('#skills-values-suggestion').show('slow');
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
		if (skillsCount == 0)
			$('#skills-summary').append("<li>" + noSelectMessage + " skills</li>");
		if (valsCount == 0)
			$('#values-summary').append("<li>" + noSelectMessage + " values</li>");
		if (skillsCount == 0 && valsCount == 0)
			$('#skills-values-suggestion').hide('slow');
	}
});

$('input:checkbox[name="barrier"]').change(function() { 
	$('.barrier-list').html("");
	$('#review-sub-content .advice').hide();
	var noneSelected = true;
	$('input:checkbox[name="barrier"]').each(function() {
		var $this = $(this);
		if ($this.is(':checked')) {
			noneSelected = false;
			var checkClass = $this.attr('class');
			var checkVal = $this.attr('value');
			$('#review-sub-content .advice').each(function() {
				var adviceID = $(this).attr('id');
				if (checkClass.indexOf(adviceID) >= 0) {
					$('#' + adviceID + ' .barrier-list').append("<li>" + checkVal + "</li>");
					$(this).show();
				}
			});
		}
	});
	noneSelected ? $('.no-selection').show() : $('.no-selection').hide();
});