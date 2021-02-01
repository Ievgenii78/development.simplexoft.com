// JavaScript Document



jQuery(document).ready(function ($) {


    $('.panel-collapse').on('shown.bs.collapse', function (e) {
       var $panel = $(this).closest('.panel');
       $('html,body').animate({
           scrollTop: $panel.offset().top-150
       }, 500);
    });

 /*
  $('.panel-heading a').click(function() {
    $('.panel-heading').removeClass('active');
    if(!$(this).closest('.panel').find('.panel-collapse').hasClass('in'))
        $(this).parents('.panel-heading').addClass('active');
  });
*/

  if ( $('.wdt-loading-phrases').length ) {
      wdtLoading.start();
  }

  $('.accordion-title').on('click', function(){
     $('.accordion-title').removeClass('active');
     $('.accordion-content').slideUp('fast');
     $(this).addClass('active');
     $(this).next('.accordion-content').slideDown('fast');
     return false;
  });

  /*
  function applyformBenefits() {
      if ( $(window).width() < 991 && $('.apply-form-benefits .benefit-wrap').length ) {
          alert('f');
          $('.apply-form-benefits div').owlCarousel({
            stagePadding: 30,
            loop:true,
            autoplay:true,
            margin:10,
            nav:true,
            width:300,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:2
                },
                1000:{
                    items:3
                }
            }
            });
      }
  }

  applyformBenefits();
  */

  if( $("#the-posts").length > 1 ){
        $('#the-posts').owlCarousel({
          items : 3,
          singleItem: false,
          smartSpeed: 600,
          autoplay: true,
          autoplayTimeout: 6000,
          loop: true,
          nav : false,
          dots : false,
          margin: 20,
          responsive : {
              0 : {
                  items: 1,
              },
              992 : {
                  items: 3,
              }
          }
        });
    }

	// PAGE BANNER SLIDER
	if( $('.btn-menu').is(':visible') ){
		if( $(".secure-content p").length > 1 ){
			$(".secure-content").owlCarousel({
				items : 1,
				singleItem : true,
				smartSpeed: 600,
				autoplay: true,
				autoplayTimeout: 3000,
				//animateIn: 'fadeIn',
				//animateOut: 'fadeOut',
				loop: true,
				nav : false,
				dots : false
			});
		}
	}


	// MOBILE MENU
    $(".btn-menu").click(function () {
        $('.nav').slideToggle('fast');
		$(this).toggleClass('btn-close-menu');
		$('.header').toggleClass('mobile-nav-open');
		$('body').toggleClass('lock-scroll');
        return false;
    });


	// AMOUNT CHANGE
	var i = 0, timeOut = 0;

	$('.amount-change').on('click', function(e) {
		e.preventDefault();
	});

    $('.apply-form form').submit(function(e) {
		e.preventDefault();
		var action = $(this).attr('action');
		var value = $('.apply-loan-amount', this).val();
		if (typeof value !== 'undefined') {
			value = value.replace('£', '');
			value = value.replace(',', '');
			window.location.href = action + '?value=' + value;
		}
		else {
			window.location.href = action;
		}
	});

	$('.amount-change').on('mousedown touchstart', function(e) {
		var element = $(this);
		var amountfield = element.siblings('.apply-loan-amount');
        var currentVal = parseInt( amountfield.val().replace(/[^\d\.]/g,'') );
		var amountvalue = getAmount(element, currentVal);
		$('.value-amount').html('£' + amountvalue);
		timeOut = setInterval(function(){
			changeAmount(element, amountfield, currentVal);
		}, 250);
		$(amountfield).val('£' + amountvalue);

        changeDuration(amountvalue);

		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		return false;
    }).bind('mouseup mouseleave touchend', function(e) {
		clearInterval(timeOut);
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		return false;
	});

	function changeAmount(element, amountfield, currentVal){
		var currentVal = parseInt( amountfield.val().replace(/[^\d\.]/g,'') );
		var amountvalue = getAmount(element, currentVal);
		$(amountfield).val('£' + amountvalue);
		$('.value-amount').html('£' + amountvalue);
	}

    function getAmount(element, currentVal){
    	var increment = 100;
    	var amountvalue = 0;
    	if( element.hasClass('amount-plus') ){
        	if (!isNaN(currentVal) && currentVal < 5000) {
				if( currentVal < 1000 ){ increment = 50; }
				amountvalue = currentVal + increment;
			} else {
				amountvalue = 5000;
			}
		}else{
			if (!isNaN(currentVal) && currentVal > 50) {
				if( currentVal < 1000 ){ increment = 50; }
				amountvalue = currentVal - increment;
			} else {
				amountvalue = 50;
			}
		}
		return amountvalue;
    }

    changeDuration();


	function changeDuration(amountvalue){
        if ( $('.apply-input').length ) {
    		if ( typeof amountvalue == 'undefined' && $('.apply-loan-amount').length ) {
    			amountvalue = parseInt( $('.apply-loan-amount').val().replace(/[^\d\.]/g,'') );
    		} else {
    			amountvalue = amountvalue;
    		}
    		// only change the value if it has not already been passed through in url
    		if ( !getUrlParameter('months') ) {

    			if ( amountvalue > 500 ) {
    				$('.loan-duration').val('6').change();
    			}
    			if ( amountvalue > 950 ) {
    				$('.loan-duration').val('12').change();
    			}
    			if ( amountvalue > 2000 ) {
    				$('.loan-duration').val('18').change();
    			}
    			if ( amountvalue < 500 ) {
    				$('.loan-duration').val('3').change();
    			}
    		}
        }
	}


	// STICKY HEADER
	if( $('.btn-menu').is(':hidden') ){
		$('body').waypoint(function(direction) {
			$(".sticky-bar").toggleClass('active');
		}, { offset: '-600px' });
	}


	$('.widget .menu > li > a').click(function () {
		if ($(this).siblings('ul').is(':hidden')) {
			$(this).siblings('ul').slideDown(400);
			$(this).toggleClass('sub-shown');
			return false;
		}
	});


	/*
	if(typeof maplocation != 'undefined') {
		show_map();
	}

	function show_map() {

		var LatLng = {lat: parseFloat(maplocation.lat), lng: parseFloat(maplocation.lng)};
		var map = new google.maps.Map(document.getElementById('map'), {
			center: LatLng,
			scrollwheel: false,
			navigationControl: false,
			mapTypeControl: false,
			scaleControl: false,
			draggable: false,
			zoom: 16
		});
	}
	*/



});

function reset_nav(){
    if ( jQuery(window).width() > 991 )  {
        jQuery('.header').removeClass('mobile-nav-open');
        jQuery('.btn-menu').removeClass('btn-close-menu');
        jQuery('header nav').css('display','block');
    }
    else {
        jQuery('header nav').css('display','none');
    }
}

jQuery(window).resize(function(){
    reset_nav();
});

// Get Device Size
function getBootstrapDeviceSize() {
	var $ = jQuery.noConflict();
	return $('#users-device-size').find('div:visible').first().attr('id');
}

// get url paramaters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

/*
jQuery(document).ready( function() {
// Smooth Scroll
// Select all links with hashes
jQuery('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
      &&
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = jQuery(this.hash);
      target = target.length ? target : jQuery('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        jQuery('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = jQuery(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });
});
*/


// Store gclid in cookie
function setCookie(name, value, days){
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    var expires = "; expires=" + date.toGMTString();
    document.cookie = name + "=" + value + expires;
}
function getParam(p){
    var match = RegExp('[?&]' + p + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
var gclid = getParam('gclid');
if(gclid){
    var gclsrc = getParam('gclsrc');
    if(!gclsrc || gclsrc.indexOf('aw') !== -1){
	    setCookie('gclid', gclid, 90);
	}
}
