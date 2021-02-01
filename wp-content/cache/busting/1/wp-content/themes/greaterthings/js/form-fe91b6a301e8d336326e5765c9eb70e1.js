// JavaScript Document

var lead_id = false;

jQuery(document).ready(function ($) {

	 //formComplete();
	// formAccepted();

	var $loadingtitles = $(".loading .loading-titles");

	$('.loan-type').click(loan_type_change);
    $('.loan-type-dropdown').change(loan_type_change);

    function loan_type_change(e){
            if($(this).attr("value") == 'Other'){
                $('.loan-type-dropdown').slideDown();
            }
			else {

				if ($(this).attr("class") == 'loan-type-dropdown'){
					$('#loan8').val($(this).val());
					$('#loan8')[0].checked = true;
				}

                $('body,html').addClass('modal-open');
                $('.loading').delay(350).fadeIn(600);
                if( $(".loading .loading-titles li").length > 1 ){
                        $loadingtitles.owlCarousel({ items: 1, singleItem: true, smartSpeed: 600, autoplay: true, autoplayTimeout: 1200, animateIn: 'fadeIn', animateOut: 'fadeOut', mouseDrag: false, touchDrag: false, loop: false, nav : false, dots : false });

                        $loadingtitles.on('changed.owl.carousel', function(event) {
                                if(event.item.index == 1) {
                                        var $countup = $('.countup'), countTo = $countup.attr('data-count');
                                        $countup.text('40');
                                        $({ countNum: $countup.text()}).animate({
                                                countNum: countTo
                                        },
                                        {
                                                duration: 1500,
                                                easing:'linear',
                                                step: function() {
                                                $countup.text(Math.floor(this.countNum));
                                        },
                                        complete: function() {
                                                $countup.text(this.countNum);
                                        }
                                  });

                                }
                        });

                }
                $('.loading').delay(5000).fadeOut(400, function() {

                        $loadingtitles.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
                        $loadingtitles.find('.owl-stage-outer').children().unwrap();
                        $('.form-section-hidden').removeClass('form-section-hidden');
                        $('body,html').removeClass('modal-open');
                        nextStep(3);
                });
        }
    }

    $('.payment-type').click(function(e){
		$('body,html').removeClass('modal-open');
		nextStep(9);
    });

    $('[name="marital_status"]').change(function(e){
		var status = $(this).val();
		if (status == 'Married') {
			$('.form-field-conditional[data-field="combined-income"]').show();
			$('.form-field-conditional[data-field="not-combined-income"]').hide();
		} else {
			$('.form-field-conditional[data-field="combined-income"]').hide();
			$('.form-field-conditional[data-field="not-combined-income"]').show();
		}
    });

    $('[name="employment[income_frequency]"]').change(function(e){
			var frequency = $(this).val();
			payment_dates(frequency, "employment[payment_date]", "employment[f_payment_date]");
    });

    $('[name="employment_other[income_frequency]"]').change(function(e){
			var frequency = $(this).val();
			payment_dates(frequency, "employment_other[payment_date]", "employment_other[f_payment_date]");
    });


    $('[name="manualaddress"]').click(function(e){
		if($(this).is(':checked')) {
			$('.manualaddress').slideDown(300);
			if ( $('.postcode-standard').length ) {
				$('.searchaddress').slideUp(300);
			}
		} else {
			$('.manualaddress').slideUp(300);
			if ( $('.postcode-standard').length ) {
				$('.searchaddress').slideDown(300);
			}
		}
    });

    $('[type=radio]').click(function(e){
		var input = $(this).attr('name');
		if($('.validation-'+input+':visible').length > 0) {
			$('.validation-'+input+':visible').tooltip('destroy');
		}
    });

    $('form#loan input').keyup(function(e) {
		if ($(this).is(":focus") && (e.keyCode == 13)) {
			e.preventDefault();
			return false;
		}
    });

    $('.btn-validate').click(function(e){
		var step = parseInt( $(this).attr('data-step') );
		if(step == 1) {
			nextStep(2);
			e.preventDefault();
			return false;
		}
		$(this).addClass('btn-loading');
		validateStep(step);
        e.preventDefault();
    });

    $('form#loan input, form#loan select').on('change update click', function(e){
		var input = $(this).attr('name');
    	var element = $('[name="'+input+'"]:visible');
		if( element.length == 0 ) {
			element = $('[name="'+input+'[1]:visible"]');
		}
		if(element.attr('type') == 'checkbox') {
			element = $('[name="'+input+'"]:visible').next('label');
		}
		$(element).tooltip('destroy');
    });



	$('.validate-number').keyup(function(event) {

		if(event.which >= 37 && event.which <= 40) return;

		$(this).val(function(index, value) {
			return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "");
		});
	});

	$('.validate-integer').keyup(function(event) {

		if(event.which >= 37 && event.which <= 40) return;

		$(this).val(function(index, value) {
			return value.replace(/\D/g, "");
		});
	});

	$('.validate-name').keyup(function(event) {

		$(this).val(function(index, value) {
			value = value.charAt(0).toUpperCase() + value.slice(1);
			return (value + '').replace(/[^a-zA-Z]/g,"");
		});

	});



	if ( $('.postcode-data8').length ) {
		var txt = document.getElementById('findPostcode');
		new data8.predictiveaddressui(txt, {
			// Change this to your own API Key
			ajaxKey: 'UL4I-XH3I-ELWN-4APE',
			placeholder: 'Enter your postcode',
			initialCountry: 'GB',
			allowedCountries: '["GB"]',
			selectAddress: function(data){
			    $('#manualaddress').trigger('click');
				var address = data.RawAddress.Organisation + " " + data.RawAddress.BuildingNumber + " " +  data.RawAddress.BuildingName + " " + data.RawAddress.ThoroughfareName + " " + data.RawAddress.ThoroughfareDesc + " " + data.RawAddress.DependentLocality + " " + data.RawAddress.Locality + " " + data.RawAddress.TraditionalCounty + " " + data.RawAddress.PostalCounty + " " + data.RawAddress.Postcode;
				console.log(data.RawAddress);
				//alert(address);
				if ( data.RawAddress.Organisation ) {
					$('#line1').val( data.RawAddress.Organisation );
				}
				else {
					if ( data.RawAddress.BuildingNumber && data.RawAddress.BuildingName ) {
						$('#line1').val( data.RawAddress.BuildingNumber + ' ' + data.RawAddress.BuildingName );
					}
					if ( data.RawAddress.BuildingNumber && !data.RawAddress.BuildingName ) {
						$('#line1').val( data.RawAddress.BuildingNumber );
					}
					if ( !data.RawAddress.BuildingNumber && data.RawAddress.BuildingName ) {
						$('#line1').val( data.RawAddress.BuildingName );
					}
				}
				$('#line2').val( data.RawAddress.ThoroughfareName + ' ' + data.RawAddress.ThoroughfareDesc + ' ' + data.RawAddress.DependentLocality );
				$('#town').val( data.RawAddress.Locality );
				if ( data.RawAddress.PostalCounty ) {
					$('#county').val( data.RawAddress.PostalCounty );
				}
				else {
					$('#county').val( data.RawAddress.TraditionalCounty );
				}
				$('#postcode').val( data.RawAddress.Postcode );
			}/*,
		  	fields: [
			    { element: 'line1', field: 'line1' },
			    { element: 'line2', field: 'line2' },
			    { element: 'line3', field: 'line3' },
			    { element: 'town', field: 'town' },
			    { element: 'county', field: 'county' },
			    { element: 'postcode', field: 'postcode' }
			]*/
		});
	}

	// Re Apply

	var req_apply = null;

	$( "#reapply .btn" ).click(function(e) {

		var data = $('form#reapply').serializeArray();

		if (req_apply != null) { req.abort(); }

		req_apply = $.ajax({
			url: baseURL + '/wp-admin/admin-ajax.php',
			type: 'POST',
			dataType: 'json',
			cache: false,
			data: data,
			success: function (json) {
				lead_id = (json.id ? json.id : false);
				if( json.status === true ) {
					formComplete();
				}
			}
		});

		e.preventDefault();
	});

});

function nextStep(step) {
	var $ = jQuery.noConflict();

	$('.form-section').not(':hidden').filter(function() {
		return $(this).attr("data-step") < step;
	}).addClass('form-section-complete').removeClass('form-section-locked');

	// Conditional Step 7
	if(step == 7) {
		$('.form-section[data-step^="'+step+'."]').addClass('form-section-conditional');
		var employmentstatus = $('select[name="employment[employment_status]"]').val();
		if( employmentstatus != 'Full Time Employed' && employmentstatus != 'Part Time Employed' && employmentstatus != 'Self Employed' && employmentstatus != 'Temporarily Employed' ) {
			step = 7.2;
		} else {
			step = 7.1;
		}
		$('.form-section[data-step="'+step+'"]').removeClass('form-section-conditional');
	}

	$('.form-section[data-step="'+step+'"]').addClass('form-section-active').removeClass('form-section-locked');
	if($('.form-section[data-step="'+step+'"]').length > 0) {
		var offset = -20;
		if( getBootstrapDeviceSize() != 'xs' ) {
			offset = 100;
		}
		$('html, body').animate({ scrollTop: $('.form-section[data-step="'+step+'"]').offset().top+offset }, 800);
	}
	calculatePercentage();

	dataLayer.push({
	  'event' : 'Loan Form '  + parseInt(step-1),
	  'eventCategory' : 'Submissions',
	  'eventAction' : 'Step ' + parseInt(step-1),
	  'eventLabel' : 'Form'
	});

}

var req = null;

function validateStep(step) {

	var $ = jQuery.noConflict();
	var shouldscroll = true;

	if($('.form-section[data-step="'+step+'"] .container-loading').length > 0) { $('.form-section[data-step="'+step+'"] .container-loading').fadeIn(); }

	var data = $('form#loan').serializeArray();

	if(step) { data.push({ 'name': 'step', 'value': step }); }
	if(lead_id) { data.push({ 'name': 'id', 'value': lead_id }); }

	$('form#loan input, form#loan select, form#loan label').tooltip('destroy');

	if (req != null) { req.abort(); }

	req = $.ajax({
		url: baseURL + '/wp-admin/admin-ajax.php',
		type: 'POST',
		dataType: 'json',
		cache: false,
		data: data,
		success: function (json) {

			lead_id = (json.id ? json.id : false);

			if($('.form-section[data-step="'+step+'"] .container-loading').length > 0) { $('.form-section[data-step="'+step+'"] .container-loading').fadeOut(); }

			$('.btn-validate[data-step="'+step+'"]').removeClass('btn-loading');

			$.each(json.validation, function(input, message) {

				if (input.indexOf("address") >= 0  && !$('#manualaddress').is(':checked')) {
					$('#manualaddress').trigger('click');
					$('html, body').animate({ scrollTop: $('.form-section[data-step="4"]').offset().top }, 800);
					shouldscroll = false;
				}

				var element = $('[name="'+input+'"]:visible');
				if( element.length == 0 ) {
					element = $('[name="'+input+'[1]"]:visible');
				}
				if(element.attr('type') == 'checkbox') {
					element = $('[name="'+input+'"]').next('label');
				}
				if(element.attr('type') == 'radio') {
					element = $('label.validation-'+input);
				}
				element.attr('title', message).tooltip({ trigger: 'manual', placement: 'bottom' }).tooltip("show");


			});

			if( json.status === true ) {
				nextStep(step+1);
			} else if ( $('.tooltip').length > 0 && shouldscroll ) {
				$('html, body').animate({ scrollTop: $('.tooltip').offset().top-100 }, 800);
			}

		}
	});

}

function isObject(obj) {
  return obj === Object(obj);
}

function pcaParseAddress(data) {

	var $ = jQuery.noConflict();

	var $container = $('select[name="pca-address"]');

	$container.html('');

	$container.append($('<option />', {
		value: '',
		html: 'Please Select'
	}));

	$.each(data.Items, function (i, item) {

		$container.append($('<option />', {
			value: item.Id,
			html: item.StreetAddress + ', ' + item.Place
		}));

	});

	$('select[name="pca-address"]').removeAttr('disabled');
	$('.address-container').slideDown(300);

}

function calculatePercentage() {
	var $ = jQuery.noConflict();

	var total = $('.form-section:last-child').attr('data-step');

	var complete = $('.form-section.form-section-complete').length;
	var percentage = Math.round((complete / total) * 100);

	$('.progress').not('.shown').addClass('shown');
	$('.progress .percentage-complete').html(percentage + '% Complete');
	$('.progress .progress-bar').css({width: percentage + '%'});

	// console.log('percentage: '+percentage);
	// console.log('complete: '+complete);
	// console.log('total: '+total);

	if(percentage == 100){
		formComplete();
	}
}

function formAccepted(url, lead_id, commission) {

	var $ = jQuery.noConflict();
	$('body').addClass('noscroll');
	$('.form-accepted').fadeIn(300);
	$('.form-accepted .btn').attr('href', url);

	dataLayer.push({
		'ecommerce': {
			'purchase': {
				'actionField': {
					'id': lead_id,
					'affiliation': 'Website',
					'revenue': commission,
					'tax':'0.00',
					'shipping': '0.00',
					'coupon': ''
				}
			}
		}
	});

	dataLayer.push({
	  'event' : 'Loan Form - Accepted',
	  'eventCategory' : 'Submissions',
	  'eventAction' : 'Accepted :)',
	  'eventLabel' : lead_id,
	  'eventValue': commission
	});

	window.setTimeout(function() {
		window.location.href = url;
	}, 2000);

}

function formRejected(url) {

	var $ = jQuery.noConflict();
	$('body').addClass('noscroll');
	$('.form-rejected').fadeIn(300);
	$('.form-rejected .btn').attr('href', url);

	dataLayer.push({
	  'event' : 'Loan Form - Rejected',
	  'eventCategory' : 'Submissions',
	  'eventAction' : 'Rejected',
	  'eventLabel' : 'Form'
	});

	window.setTimeout(function() {
		window.location.href = url;
	}, 4000);

}

function formComplete() {

	var $ = jQuery.noConflict();

	$('.progress').addClass('complete shown');
	$('.progress .percentage-complete').fadeOut(300);
	$('.progress .percentage-logo').delay(1700).fadeIn(300, function() {
		$('body').addClass('noscroll');
	});
	//wdtLoading.start();
	$('.progress .progress-bar').css({width: '100%'});


	if( $(".progress-1 .loading-titles li").length > 1 ){
		$(".progress-1 .loading-titles").owlCarousel({ items: 1, singleItem: true, smartSpeed: 600, autoplay: true, autoplayTimeout: 6000, animateIn: 'fadeIn', animateOut: 'fadeOut', mouseDrag: false, touchDrag: false, loop: true, nav : false, dots : false });
	}

	loadingScreenCount();

	dataLayer.push({
		'event' : 'Loan Form - Loading screen',
		'eventCategory' : 'Submissions',
		'eventAction' : 'Loading screen',
		'eventLabel' : 'Loading screen'
	});

	leadStatus(lead_id);
}

var reqStatus = null;

function leadStatus(lead_id) {

	var $ = jQuery.noConflict();

	var data = [];
	data.push({ 'name': 'action', 'value': 'loan_status' });
	if(lead_id) { data.push({ 'name': 'id', 'value': lead_id }); }

	if (reqStatus != null) { reqStatus.abort(); }

	reqStatus = $.ajax({
		url: baseURL + '/wp-admin/admin-ajax.php',
		type: 'POST',
		dataType: 'json',
		cache: false,
		data: data,
		success: function (json) {

			if( json.success && json.redirect_url !== null ) {
				formAccepted(json.redirect_url, lead_id, json.commission);
			} else {
				window.setTimeout(function() {
					leadStatus(lead_id);
				}, 500);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			leadStatus(lead_id);
		}
	});

}

/*
function resetForm() {

	var $ = jQuery.noConflict();
	$('form')[0].reset();
	$('.form-section').removeClass('form-section-active').removeClass('form-section-complete').addClass('form-section-locked');
	$('.form-section:first').removeClass('form-section-locked').addClass('form-section-active');
	$('html, body').animate({ scrollTop: $('.form-section[data-step="1"]').offset().top }, 800);
	calculatePercentage();

}
*/


var req_freq = null;

function payment_dates(frequency, name, fname) {

	var $ = jQuery.noConflict();

	var data = [];
	data.push({ 'name': 'action', 'value': 'payment_frequency' });
	data.push({ 'name': 'income_frequency', 'value': frequency });
	if (frequency != 'Specific Day of the Month') {

		if (req_freq != null) { req_freq.abort(); }

		req_freq = $.ajax({
			url: baseURL + '/wp-admin/admin-ajax.php',
			type: 'POST',
			dataType: 'json',
			cache: false,
			data: data,
			success: function (json) {
				var next_d = $('[name="'+name+'[0]"]');
				var next_m = $('[name="'+name+'[1]"]');
				var next_y = $('[name="'+name+'[2]"]');
				var follow_d = $('[name="'+fname+'[0]"]');
				var follow_m = $('[name="'+fname+'[1]"]');
				var follow_y = $('[name="'+fname+'[2]"]');
				next_d.val( json.next.d );
				next_m.val( json.next.m );
				next_y.val( json.next.y );
				follow_d.val( json.follow.d );
				follow_m.val( json.follow.m );
				follow_y.val( json.follow.y );

				if (typeof after_payment_dates === "function") {
					after_payment_dates(frequency, name, fname);
				}
			}
		});

	}

}

function loadingScreenCount() {
	var $ = jQuery.noConflict();
	if( $(".progress-amount .percentage-titles li").length > 1 ){
		var $owl = $('.percentage-titles').owlCarousel({
			items: 1,
			singleItem: true,
			smartSpeed: 1600,
			autoplay: true,
			autoplayTimeout: 1000,
			animateIn: 'fadeIn',
			animateOut: 'fadeOut',
			mouseDrag: false,
			touchDrag: false,
			loop: false,
			nav : false,
			dots : false,
			width: 300
		});

		$owl.on('changed.owl.carousel', function(event) {
			if (event.item.index == 1) { paydayukCountUp($owl, 1, 5000); }
			if (event.item.index == 2) { paydayukCountUp($owl, 2, 30000); }
			if (event.item.index == 3) { paydayukCountUp($owl, 3, 5000); }
			if (event.item.index == 4) { paydayukCountUp($owl, 4, 20000); }
			if (event.item.index == 5) { paydayukCountUp($owl, 5, 30000); }
			if (event.item.index == 6) { paydayukCountUp($owl, 6, 4000); }
			if (event.item.index == 7) { paydayukCountUp($owl, 7, 30000); }
			if (event.item.index == 8) { paydayukCountUp($owl, 8, 20000); }
		});

	}
}

function paydayukCountUp( $owl, number, duration ) {
	var $ = jQuery.noConflict();
	$owl.trigger('stop.owl.autoplay');
	var $countup = $('.progress-amount .countup' + number);
	var countTo = $countup.attr('data-count');

	$({ countNum: $countup.text()}).animate({
			countNum: countTo
		},
		{
			duration: duration,
			easing:'linear',
			step: function() {
			$countup.text(Math.floor(this.countNum));
		},
		complete: function() {
			$countup.text(this.countNum);
			$owl.trigger('play.owl.autoplay');
		}
	});
}
