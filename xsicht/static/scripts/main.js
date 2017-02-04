$(function() {
	particlesJS.load('particles', 'static/scripts/particles.json', function() {
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
});