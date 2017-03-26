$(function() {
	particlesJS.load('particles', '/static/scripts/particles.json', function() {
		console.log('callback - particles.js config loaded');
	});

	$('#mobile-nav').click(function(event) {
		$('.fa-bars, .fa-times').toggleClass('fa-times fa-bars');
		$(this).toggleClass('active');
		$('nav').toggleClass('active');
	});

	$.fn.rotate = function(degrees, step, current) {
	    var self = $(this);
	    current = current || 0;
	    step = step || 5;
	    current += step;
	    self.css({
	        '-webkit-transform' : 'rotate(' + current + 'deg)',
	        '-moz-transform' : 'rotate(' + current + 'deg)',
	        '-ms-transform' : 'rotate(' + current + 'deg)',
	        'transform' : 'rotate(' + current + 'deg)'
	    });
	    if (current != degrees) {
	        setTimeout(function() {
	            self.rotate(degrees, step, current);
	        }, 5);
	    }
	};

	$(".r90").click(function() { $("span").rotate(90) });

	function switchToDesktopView() {
	   $('nav').addClass('active');
	   $('#mobile-nav i.fa').hide();
	   $('.nav-title').show();
	}

	function switchToMobileView() {
	   $('nav').removeClass('active');
	   $('#mobile-nav i.fa').show();
	   $('.nav-title').hide();
	}

	function detectCorrectView() {
		if ($(window).width() >= 760) {
			switchToDesktopView();
		} else {
			switchToMobileView();
		}	

	}

	$(window).on('resize', function() {
		detectCorrectView();
	});

	detectCorrectView();
});
