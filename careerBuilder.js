var noSelectMessage = "You have not selected any";

//set up
$('.section-content').hide();
$('.sub-content').hide();
$('.suggestion').hide();
$('.advice p').hide();
$('#other-barriers').hide();
$('#skills-summary').append("<li>" + noSelectMessage + " skills.</li>");
$('#values-summary').append("<li>" + noSelectMessage + " values.</li>");

$('.toggler').click(function() { //toggle section/subsection visibility
  $(this).siblings().toggle('slow');
  if($(this).is('h2')) {
	var headID = $(this).attr('id');
	$('h2.toggler').each(function() {
		if ($(this).attr('id') != headID) {
			$(this).siblings().hide('slow');
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
	if ($(this).attr('name') == 'skill' || $(this).attr('name') == 'value') { //add selected checkbox items to summary lists
		$('#skills-summary').html("");
		$('#values-summary').html("");
		$('#skills-values-suggestion').show('slow');
		var skillsCount = 0;
		var valsCount = 0;
		$('input:checkbox').each(function() {
			var checkName = $(this).attr('name');
			var checkVal = $(this).attr('value');
			if ($(this).is(':checked')) {
				if (checkName == 'skill') {
					$('#skills-summary').append("<li>" + checkVal + "</li>");
					skillsCount++;
				}
				else if (checkName == 'value') {
					$('#values-summary').append("<li>" + checkVal + "</li>");
					valsCount++;
				}
			}
		});
		if (skillsCount == 0)
			$('#skills-summary').append("<li>" + noSelectMessage + " skills.</li>");
		if (valsCount == 0)
			$('#values-summary').append("<li>" + noSelectMessage + " values.</li>");
		if (skillsCount == 0 && valsCount == 0)
			$('#skills-values-suggestion').hide('slow');
	}
	else if ($(this).attr('name') == 'barrier') {
		if ($(this).attr('value') == 'Other factors') {
			$('#other-barriers').toggle('slow');
		}
	}
});