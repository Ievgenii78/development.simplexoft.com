// JavaScript Document

var has_errors = true;
var reqs = [];

jQuery(document).ready(function ($) {

	//populate hidden fields from accordion
	$('.accordion-value').on('click', function(){
		$(this).parents('.accordion-content').find('.accordion-value').removeClass('active');
		$(this).addClass('active');
		var val = $(this).data('expense-value');
		var range = $(this).html();

		// fill in the hidden field
		$(this).parents('.accordion-content').find('input').val(val);
		// add value to the title
		$(this).parents('.accordion-wrap').find('.accordion-title .title-value').remove();
		$(this).parents('.accordion-wrap').find('.accordion-title').append('<span class="title-value">'+ range +'</span>');


		//close this accordion and open the next one
		$(this).parents('.accordion-wrap').find('.accordion-title').removeClass('active');
		$(this).parents('.accordion-content').slideUp('fast');

		$(this).parents('.accordion-wrap').next('.accordion-wrap').find('.accordion-title').addClass('active');
		$(this).parents('.accordion-wrap').next('.accordion-wrap').find('.accordion-content').slideDown('fast');

		//calculate Expenses
		calculate_expenses();
	});

	$('#monthly_rent_mortgage').on('change', function(){
		calculate_expenses();
	});
	function calculate_expenses() {
		//show expenses total
		$('.expenses-calculation').show();
		var total_expenses = 0;
		$('.accordion-value.active').each(function(){
			total_expenses += $(this).data('expense-value');
		});
		//add mortgage / rent to expenses
		var mortgage_rent = parseInt($('#monthly_rent_mortgage').val()) || 0;
		var combined_expenses = mortgage_rent + parseInt(total_expenses);
		$('.expenses-calculation span').html('£' + combined_expenses);
	}

	// Hide all conditional Fields
	$('.form-group[data-conditional]').hide();

	handleConditionalFields();

	$('.btn-form-complete').on('click', function (e) {
		$(this).addClass('btn-loading');
		$(this).attr("disabled", true);
		var fields = getFormFields();
		finalValidation(fields);
		e.preventDefault();
	});

	/*
	$('.validate-field, .validate-select').on('keyup change', function () {
		var field = $(this).attr('name');
		var value = $(this).val();
		//validateField(field, value);
	});
	*/

	$('input[type=radio][name="address[home_owner_status]"]').on('change', function(){
		 if($(this).val() != 'Home Owner'){
			 $('.housing-type').slideDown();
		 } else {
			 $('.housing-type').slideUp();
			 setTimeout(function(){
				 $('select[name="address[housing_type]"]').prop('selectedIndex',0);
				 $('input[type=number][name="address[split_rent_with]"]').val('');
			 }, 1000);

		 }
	});

	$('.validate-time-at-address').on('change', function () {
		var time_at_address_years = $('select[name="address[time_at_address_years]"]');
		var time_at_address_months = $('select[name="address[time_at_address_months]"]');

		var field_0 = time_at_address_years.attr('data-name');
		var field_1 = time_at_address_months.attr('data-name');

		var value_0 = time_at_address_years.val();
		var value_1 = time_at_address_months.val();

		var fields = [];

		fields.push({ 'name': field_0, 'value': value_0 });
		fields.push({ 'name': field_1, 'value': value_1 });

		//validateFields(field_0, fields);
	});


	$('select[name="pca-address"]').live('change', function () {
		$('.manualaddress').slideDown();
	});


	$('.validate-date').on('change', function () {
		var field = $(this).attr('data-name');
		var value = getDateValues(field);
		//validateField(field, value);
	});

	$('.validate-radio').on('change', function () {
		var field = $(this).attr('name');
		var value = $(this).val();
		$('[name="'+field+'"]').parent().removeClass('invalid').removeClass('valid');
		//validateField(field, value);
	});

	//$('.validate-radio, .validate-date, .validate-field, .validate-select, .validate-time-at-address').on('change keyup', function () {
	$('.validate-radio, .validate-date, .validate-field, .validate-select, .validate-time-at-address').on('change', function () {
		validateHandleConditionalFields( $(this) );
		//console.log('Conditional');
	});

});

function validateHandleConditionalFields($element) {

	var $ = jQuery.noConflict();

	var field = $element.parents('.form-group').attr('data-validate');
	var type = $element.parents('.form-group').attr('data-type');
	// if(field == 'loan_purpose') { return; }
	var fields = getFormFields( $element );
	field = false;
	validateFields(field, fields);
	handleConditionalFields();
	//hide message
	$element.parents('.form-group').find('.validation-message').fadeOut('slow');
}

jQuery('input[name="pca"], .manualaddress input').on('focus change', function(){
	jQuery('.form-group-postcode').find('.validation-message').fadeOut('slow');
});

function handleConditionalFields() {

	var $ = jQuery.noConflict();

	var fields = getFormFields();


	$('.form-group[data-conditional]').each(function( index ) {

		var $field = $(this);
		var total = 0;
		var show = 0;
		var conditional = jQuery.parseJSON( $(this).attr('data-conditional') );


		$.each(conditional, function(conditional_field, conditional_values) {

			total++;

			$.each(fields, function(key, field) {

				if(field.name == conditional_field && field.value != "") {
					if( $.inArray( field.value, conditional_values ) >= 0) {
						show++;
					}
				}

			});

		});

		if(show == total) {
			$field.show();
		} else {
			$field.hide();
		}

	});

}

function getFormFields($current) {

	var $ = jQuery.noConflict();
	var fields = [];

	$form = $('.form-horizontal');

	if(typeof $current !== 'undefined'){
		$form = $current.parents('.form-horizontal').prevAll('.form-horizontal').andSelf();
	}

	$form.each(function(index){
		var field = $('.form-group', this).attr('data-validate');
		var type = $('.form-group', this).attr('data-type');
		var value = $('[name="'+field+'"]').val();

		if(field == 'dob' || field == 'employment_other[payment_date]' || field == 'employment_other[f_payment_date]' || field == 'employment[payment_date]' || field == 'employment[f_payment_date]' ) {
			value = getDateValues(field);
		}

		if(field == 'address[time_at_address_months]') {
			var address_years_field = 'address[time_at_address_years]';
			address_years_value = $('[name="'+address_years_field+'"]').val();
			fields.push({ 'name': address_years_field, 'value': address_years_value });
		}

		if(field == 'employment[time_in_job_years]') {
			var time_in_job_months_field = 'employment[time_in_job_months]';
			time_in_job_months_value = $('[name="'+time_in_job_months_field+'"]').val();
			fields.push({ 'name': time_in_job_months_field, 'value': time_in_job_months_value });
		}

		if(type == 'radio') {
			value = ($('[name="'+field+'"]:checked').length > 0 ? $('[name="'+field+'"]:checked').val() : '');
			// value = $('[name="'+field+'"]:checked').val();
			//console.log(field + " : " + value);
		}
		fields.push({ 'name': field, 'value': value });
	});
	return fields;
}

function getDateValues(field) {
	var $ = jQuery.noConflict();
	var value_0 = $('select[name="'+field+'[0]"]').val();
	var value_1 = $('select[name="'+field+'[1]"]').val();
	var value_2 = $('select[name="'+field+'[2]"]').val();
	var value = value_2 + '-' + value_1 + '-' + value_0;
	return value;
}

function checkAddressValidation(validation) {

	var $ = jQuery.noConflict();
	var valid = true;

	//console.log(validation);

	// Loop through all validation fields and reset
	$.each(validation, function(input, message) {
		if( $.inArray( input, [ "address[name_or_number]", "address[address_line1]", "address[town]", "address[county]", "address[postcode]" ] ) === 1 ){
			valid = false;
		}
	});

	if(valid) {
		$('[name="pca"]').parent('.col').removeClass('invalid');
	} else {
		$('[name="pca"]').parent('.col').addClass('invalid');
	}

}

function validateField(field, value, fields) {

	var $ = jQuery.noConflict();
	var submitting = false;

	if(typeof fields !== 'undefined'){
		var data = fields;
		data.push({ 'name': 'action', 'value': 'validate_field' });
	} else {
		var fields = false;
		var data = [];
		data.push({ 'name': 'action', 'value': 'validate_field' });
		data.push({ 'name': field, 'value': value });
	}

	data.push({ 'name': 'ip_address', 'value': $('input[name="ip_address"]').val() });
	data.push({ 'name': 'user_agent', 'value': $('input[name="user_agent"]').val() });
	data.push({ 'name': 'referring_site_url', 'value': $('input[name="referring_site_url"]').val() });
	data.push({ 'name': 'gclid', 'value': $('input[name="gclid"]').val() });

	//console.log(fields);

	$('[name="'+name+'"]').parent().removeClass('valid').removeClass('invalid');

	if (reqs[fields] != null) { reqs[fields].abort(); }

	reqs[fields] = $.ajax({
		url: baseURL + '/wp-admin/admin-ajax.php',
		type: 'POST',
		dataType: 'json',
		cache: false,
		data: data,
		success: function (json) {

			lead_id = (json.id ? json.id : false);

			if(submitting) {
				//console.log(json);
			}

			// Multiple Fields
			if(fields) {
				$.each(fields, function(key, field) {
					checkValidation(field.name, json.validation);
				});
			} else {
				checkValidation(field, json.validation);
			}

			// Final Address Validation
			checkAddressValidation(json.validation);

			// Check if all fields have passed validation
			if(fields){
				if(fields.length == 30 && json.validation.length === 0) {
					has_errors = false;
				}
			}


		}
	});

}


function finalValidation(fields) {

	var $ = jQuery.noConflict();

	if(typeof fields !== 'undefined'){
		var data = fields;
		data.push({ 'name': 'action', 'value': 'loan_submit_form' });
	}

	data.push({ 'name': 'ip_address', 'value': $('input[name="ip_address"]').val() });
	data.push({ 'name': 'user_agent', 'value': $('input[name="user_agent"]').val() });
	data.push({ 'name': 'referring_site_url', 'value': $('input[name="referring_site_url"]').val() });
	data.push({ 'name': 'gclid', 'value': $('input[name="gclid"]').val() });
	data.push({ 'name': 'loan_amount', 'value': $('select[name="loan_amount"]').val() });
	data.push({ 'name': 'loan_duration', 'value': $('select[name="loan_duration"]').val() });
	if ( $('input[name="marketing_opt_in"]').is(':checked') ) {
		data.push({ 'name': 'marketing_opt_in', 'value': '1' });
	}

	//push fields for expense accordion
	if ( $('.expenses-accordion' ).length ) {
		//data.push({ 'name': 'expenditure[mortgage]', 'value': $('#expenditure_mortgage').val() });
		data.push({ 'name': 'expenditure[loans]', 'value': $('#expenditure_loans').val() });
		data.push({ 'name': 'expenditure[utilities]', 'value': $('#expenditure_utilities').val() });
		data.push({ 'name': 'expenditure[transport]', 'value': $('#expenditure_transport').val() });
		data.push({ 'name': 'expenditure[tax]', 'value': $('#expenditure_tax').val() });
		data.push({ 'name': 'expenditure[expenses]', 'value': $('#expenditure_expenses').val() });
	}

	if (reqs[fields] != null) { reqs[fields].abort(); }

	reqs[fields] = $.ajax({
		url: baseURL + '/wp-admin/admin-ajax.php',
		type: 'POST',
		dataType: 'json',
		cache: false,
		data: data,
		success: function (json) {

			$('.btn-form-complete').removeClass('btn-loading');
			$('.btn-form-complete').attr("disabled", false);

			lead_id = (json.id ? json.id : false);

			if(fields) {
				$.each(fields, function(key, field) {
					checkValidation(field.name, json.validation);
				});
			}

			// Final Address Validation
			checkAddressValidation(json.validation);

			if(Object.keys(json.validation).length > 0 && $('.invalid').length > 0) {
				$('html, body').animate({ scrollTop: $('.invalid').offset().top-100 }, 800);
				showValidationMessages(json);
			}

			if(lead_id && json.status === true && json.validation.length == 0 ) {
				formComplete();
			}

		}
	});
}

function showValidationMessages(json) {
	var $ = jQuery.noConflict();
	//console.log(json);

	$('.form-group').find('.validation-message').remove();
	$('.form-group').append('<div class="validation-message"></div>');
	$.each(json.validation, function(input, message) {
		var element = $('[name="'+input+'"]:visible');
		if ( input == 'loan_purpose' ) { $('input[name="loan_purpose"]').parents('.form-group').find('.validation-message').html('Please choose the purpose of your loan').show('slow'); }
		if ( input == 'title' ) { $('input[name="title"]').parents('.form-group').find('.validation-message').html('Please enter a title').show('slow'); }
		if ( input == 'firstname' ) { $('input[name="firstname"]').parents('.form-group').find('.validation-message').html('Please enter your first name').show('slow'); }
		if ( input == 'lastname' ) { $('input[name="lastname"]').parents('.form-group').find('.validation-message').html('Please enter your last name').show('slow'); }
		if ( input == 'email' ) { $('input[name="email"]').parents('.form-group').find('.validation-message').html('Please enter your email address').show('slow'); }
		if ( input == 'dob' ) { $('select[name="dob[0]"]').parents('.form-group').find('.validation-message').html('Please check your date of birth is correct').show('slow'); }
		if ( input == 'mobile_telephone' ) { $('input[name="mobile_telephone"]').parents('.form-group').find('.validation-message').html('Please enter a valid mobile number').show('slow'); }
		if ( input == 'marital_status' ) { $('input[name="marital_status"]').parents('.form-group').find('.validation-message').html('Please select your marital status').show('slow'); }
		if ( input == 'adults' ) { $('input[name="adults"]').parents('.form-group').find('.validation-message').html('Please choose how many people live in your residence').show('slow'); }
		if ( input == 'address[home_owner_status]' ) { $('input[name="address[home_owner_status]"]').parents('.form-group').find('.validation-message').html('Please tell us your living status').show('slow'); }
		if ( input == 'address[time_at_address_years]' ) { $('select[name="address[time_at_address_years]"]').parents('.form-group').find('.validation-message').html('Please tell us how long you have lived at your address').show('slow'); }
		if ( input == 'address[time_at_address_months]' ) { $('select[name="address[time_at_address_months]"]').parents('.form-group').find('.validation-message').html('Please tell us how long you have lived at your address').show('slow'); }
		if ( input == 'employment[employment_status]' ) { $('input[name="employment[employment_status]"]').parents('.form-group').find('.validation-message').html('Please choose your employment status').show('slow'); }
		if ( input == 'employment[payment_type]' ) { $('input[name="employment[payment_type]"]').parents('.form-group').find('.validation-message').html('Please tell us how you are paid').show('slow'); }
		if ( input == 'bank_account[bank_card]' ) { $('input[name="bank_account[bank_card]"]').parents('.form-group').find('.validation-message').html('Please choose the type of bank card you have').show('slow'); }
		if ( input == 'bank_account[account_number]' ) { $('input[name="bank_account[account_number]"]').parents('.form-group').find('.validation-message').html('Please enter your bank account number').show('slow'); }
		if ( input == 'bank_account[sortcode]' ) { $('input[name="bank_account[sortcode]"]').parents('.form-group').find('.validation-message').html('Please enter your bank sort code').show('slow'); }
		if ( input == 'dependants' ) { $('input[name="dependants"]').parents('.form-group').find('.validation-message').html('Please tell us how many dependants you have').show('slow'); }
		if ( input == 'recent_loan_count' ) { $('input[name="recent_loan_count"]').parents('.form-group').find('.validation-message').html('Please tell us if you have taken any loans in the past 90 days').show('slow'); }

		//employment fields
		if ( input == 'employment[industry]' ) { $('select[name="employment[industry]"]').parents('.form-group').find('.validation-message').html('Please tell us what industry you work in').show('slow'); }
		if ( input == 'employment[employer_name]' ) { $('input[name="employment[employer_name]"]').parents('.form-group').find('.validation-message').html('Please tell us your employers name').show('slow'); }
		if ( input == 'employment[time_in_job_years]' ) { $('select[name="employment[time_in_job_years]"]').parents('.form-group').find('.validation-message').html('Please tell us how long you have been in your job').show('slow'); }
		if ( input == 'employment[time_in_job_months]' ) { $('select[name="employment[time_in_job_months]"]').parents('.form-group').find('.validation-message').html('Please tell us how long you have been in your job').show('slow'); }
		if ( input == 'employment[income]' ) { $('input[name="employment[income]"]').parents('.form-group').find('.validation-message').html('Please tell us your monthly income after tax').show('slow'); }
		if ( input == 'employment[income_frequency]' ) { $('select[name="employment[income_frequency]"]').parents('.form-group').find('.validation-message').html('Please tell us how often you get paid').show('slow'); }
		if ( input == 'employment_other[payment_type]' ) {
			$('input[name="employment[payment_type]"]').parents('.form-group').find('.validation-message').html('Please tell us how you are paid').show('slow');
		}
		if ( input == 'employment_other[employment_status]' ) {
			$('input[name="employment[employment_status]"]').parents('.form-group').find('.validation-message').html('Please tell us your employment status').show('slow');
		}
		//Unemployed fields
		if ( input == 'employment_other[income]' ) { $('input[name="employment_other[income]"]').parents('.form-group').find('.validation-message').html('Please tell us how much income you receive each month after tax').show('slow'); }
		if ( input == 'employment_other[income_frequency]' ) { $('select[name="employment_other[income_frequency]"]').parents('.form-group').find('.validation-message').html('Please tell us how often you receive income').show('slow'); }
		if ( input == 'employment[payment_type]' ) { $('input[name="employment[payment_type]"]').parents('.form-group').find('.validation-message').html('Please tell us how you receive income').show('slow'); }
		if ( input == 'employment_other[combined_income]' ) { $('input[name="employment_other[combined_income]"]').parents('.form-group').find('.validation-message').html('Please tell us your household monthly income').show('slow'); }
		//postcode / address
		if ( input == 'address[name_or_number]' || input == 'address[postcode]' || input == 'address[county]' || input == 'address[town]' ) {
			$('.form-group-postcode').find('.validation-message').html('Please check that you have provided your full address').show('slow');
		}
	});
}

function checkValidation(field, validation) {

	var $ = jQuery.noConflict();
	var valid = true;

	var type = ( $('[name="'+field+'"]').attr("type") ? $('[name="'+field+'"]').attr("type") : '');

	//console.log(type);
	//console.log(field);
	//console.log(validation);

	// Loop through all validation fields and reset
	$.each(validation, function(input, message) {
		if(input == field) {
			if(type == 'radio') {
				$('[name="'+field+'"]').parent().removeClass('valid').addClass('invalid');
			} else {
				$('[name="'+field+'"], [name="'+field+'[0]"]').parent().removeClass('valid').addClass('invalid');
			}
			valid = false;
			//console.log( "Invalid: " + field );
		}
	});

	if(valid) {
		//console.log( "Valid: " + field );
		if(type == 'radio') {
			$('[name="'+field+'"]:checked').parent().addClass('valid');
		} else {
			$('[name="'+field+'"], [name="'+field+'[0]"]').parent().removeClass('invalid').addClass('valid');
		}
	}

}

function validateFields(field, fields) {

	var $ = jQuery.noConflict();
	var value = null;

	validateField(field, value, fields);

}

function after_payment_dates(frequency, payment_date, f_payment_date) {

	var $ = jQuery.noConflict();

	if (frequency != 'Specific Day of the Month') {

		var fields = [];

		var payment_date_value = getDateValues(payment_date);
		var f_payment_date_value = getDateValues(f_payment_date);

		fields.push({ 'name': payment_date, 'value': payment_date_value });
		fields.push({ 'name': f_payment_date, 'value': f_payment_date_value });

		validateFields(false, fields);


	}

}
