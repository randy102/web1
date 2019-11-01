$(document).ready(function() {

	// Boxes
	var allErrors = $('.form-error');
	var allInputs = $('.form-line input');

	// Regular expressions
	var emailRegex    = /^[\w.]+@[\w]+\.[\w]+$/;
	var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,32}$/;
	var phoneRegex    = /^(09|03|07|08|05)(\d{8})$/;

	// Check for leap year
	function isLeapYear(year) {
		return !(year % 400) || (!(year % 4) && year % 100);
	}

	// Count days in month and year
	function countDays(month, year) {
		switch (month) {
			case 2:
				return isLeapYear(year) ? 29 : 28;
			case 4:
			case 6:
			case 9:
			case 11:
				return 30;
			default:
				return 31;
		}
	}

	// Add days to list, starting from last option downwards
	function addToList(list, number) {
		var last = Number(list.children().last().text());
		for (var i = 1; i <= number; i++) {
			list.append($('<div class="custom-option">' + (last + i) + '</div>'));
		}
	}

	// Remove days from list, starting from last option upwards
	function removeFromList(list, number) {
		for (var i = 0; i < number; i++) {
			var lastChild = list.children().last();
			if (lastChild.hasClass('selected-option'))
				list.siblings('label').children('input').attr('placeholder', 'Ngày');
			lastChild.remove();
		}
	}

	// Check if a list has selected option
	function hasSelected(list) {
		var options = list.children();
		var length = options.length;
		for (var i = 1; i < length; i++) {
			var option = options.eq(i);
			if (option.hasClass('selected-option'))
				return true;
		}
		return false;
	}

	// Check if all lists has selected option
	function allHasSelected() {
		var dayList   = $('#day .custom-list');
		var monthList = $('#month .custom-list');
		var yearList  = $('#year .custom-list');
		return hasSelected(dayList) && hasSelected(monthList) && hasSelected(yearList);
	}

	// Initialize days from 1 to 31
	function dayInit() {
		var dayList = $('#day .custom-list');
		addToList(dayList, 30);
	}

	// Initialize months from 1 to 12
	function monthInit() {
		var monthList = $('#month .custom-list');
		addToList(monthList, 11);
	}

	// Initialize years from 1900 to current year
	function yearInit() {
		var yearList  = $('#year .custom-list');
		addToList(yearList, new Date().getFullYear() - 1900);
	}

	// Initialize month, year and day on start
	monthInit();
	yearInit();
	dayInit();	

	// Get selected value
	function getSelectedValue(list) {
		if (hasSelected(list))
			return Number(list.children('.selected-option').text());
		return Number(list.children().eq(1).text());
	}

	function dayUpdate() {
		var dayList   = $('#day .custom-list');
		var monthList = $('#month .custom-list');
		var yearList  = $('#year .custom-list');

		var currentMonth = getSelectedValue(monthList);
		var currentYear  = getSelectedValue(yearList);

		var countDay = countDays(currentMonth, currentYear);
		
		var daysDiff = dayList.children().length - 1 - countDay;

		if (daysDiff < 0)
			addToList(dayList, Math.abs(daysDiff));
		else if (daysDiff > 0)
			removeFromList(dayList, daysDiff);
	}

	// Hide all errors
	function hideErrors() {
		// Hide all error boxes
		for (var i = 0; i < allErrors.length; i++) {
			allErrors.eq(i).hide();
		}
		// Set all input border color back to main color
		for (var j = 0; j < allInputs.length; j++) {
			changeBorder(allInputs.eq(j), 'main');
		}
	}

	// Show error box and change border color to error
	function showError(errorBox) {
		errorBox.show();
	}

	// Change border color to error
	function changeBorder(inputField, colorName) {
		inputField.css('border-color', 'var(--' + colorName + ')');
	}

	// On submit
	$('#registerForm').submit(function() {
		var invalid = false;
		hideErrors();

		// Check full name
		if (!$('#fullnameInput').val()){
			showError($('#fullnameEmpty'));
			changeBorder($('#fullnameInput'), 'error');
			invalid = true;
		}

		// Check email
		if (!$('#emailInput').val()){
			showError($('#emailEmpty'));
			changeBorder($('#emailInput'), 'error');
			invalid = true;
		}
		else if (!emailRegex.test($('#emailInput').val())){
			showError($('#emailInvalid'));
			changeBorder($('#emailInput'), 'error');
			invalid = true;
		}

		// Check phone number
		if (!$('#phoneInput').val()) {
			showError($('#phoneEmpty'));
			changeBorder($('#phoneInput'), 'error');
			invalid = true;
		}
		else if (!phoneRegex.test($('#phoneInput').val())) {
			showError($('#phoneInvalid'));
			changeBorder($('#phoneInput'), 'error');
			invalid = true;
		}

		// Check password
		if (!$('#passwordInput').val()) {
			showError($('#passwordEmpty'));
			changeBorder($('#passwordInput'), 'error');
			invalid = true;
		}
		else if (!passwordRegex.test($('#passwordInput').val())) {
			showError($('#passwordInvalid'));
			changeBorder($('#passwordInput'), 'error');
			invalid = true;
		}

		if ($('input[name=genderOption]:checked').length == 0){
			showError($('#genderEmpty'));
			invalid = true;
		}

		if (!allHasSelected()) {
			showError($('#dobEmpty'));
			invalid = true;
		}

		if (invalid)
			return false;
	
		alert('Đăng ký thành công!');
		return true;
	});

	// Show current custom-list when clicking inside custom-select or custom-list
	$('.custom-input').click(function() {
		var currentList = $(this).parent().siblings('.custom-list');

		resetList(currentList);

		$('.custom-list').not(currentList).fadeOut('fast');

		currentList.fadeToggle('fast');
	});

	// Hide ALL custom-lists when clicking outside custom-select or custom-list
	$(document).click(function(event){
		if (!$(event.target).closest('.custom-select, .custom-option').length){
			$('.custom-list').fadeOut('fast');
			$('.custom-input').val('');
		}
	});

	// Reset a list back to default state (show all options)
	function resetList(list) {
		var options = list.children();
		var input   = list.siblings('label').children('input');
		var length  = list.children().length;
		input.val('');
		options.eq(0).hide();
		for (var i = 1; i < length; i++){
			options.eq(i).show();
		}
	}

	// Show options from custom-list that matches custom-input text
	// Show all options if input is empty
	// Show Empty if there are no matches
	function showOptions(list, input) {
		if (input == '')
			resetList(list);
		else {
			var options = list.children();
			var length  = options.length;
			var noMatch = true;
			options.eq(0).hide();
			for (var i = 1; i < length; i++) {
				var option = options.eq(i);
				if (option.text().indexOf(input.trim()) > -1) {
					option.show();
					noMatch = false;
				}
				else
					option.hide();
			}
			if (noMatch) {
				options.eq(0).show();
			}
		}
	}

	// On user input
	$('.custom-input').on('input', function() {
		var list  = $(this).parent().siblings('.custom-list');
		var input = $(this).val();
		showOptions(list, input);
	});

	// On custom-option select
	$('body').on('click', '.custom-option', function(event) {
		var text  = $(this).text();
		var list  = $(this).parent();
		var input = list.siblings('label').children('input');

		// Hide custom-list
		list.fadeOut('fast');

		// Set text from selected custom-option as placeholder for custom-input
		input.attr('placeholder', text);

		// Reset custom-input to show placeholder
		input.val('');

		// Reset all other custom-options back to default style
		$(this).siblings().removeClass('selected-option');

		// Highlight the selected custom-option
		$(this).addClass('selected-option');

		// Update day list if month or year is changed
		var targetID = $(event.target).parent().parent().attr('id');

		if (targetID == 'month' || targetID == 'year')
			dayUpdate();
	});

});
