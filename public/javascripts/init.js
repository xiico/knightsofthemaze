/*
	Drift by Pixelarity
	pixelarity.com @pixelarity
	License: pixelarity.com/license
*/

(function($) {

	skel.init({
		reset: 'full',
		breakpoints: {
			global: { href: '/stylesheets/style.css', containers: 1400, grid: { gutters: ['2em', 0] } },
			xlarge: { media: '(max-width: 1680px)', href: '/stylesheets/style-xlarge.css', containers: 1200 },
			large: { media: '(max-width: 1280px)', href: '/stylesheets/style-large.css', containers: 960, grid: { gutters: ['1.5em', 0] }, viewport: { scalable: false } },
			medium: { media: '(max-width: 980px)', href: '/stylesheets/style-medium.css', containers: '90%', grid: { zoom: 2 } },
			small: { media: '(max-width: 736px)', href: '/stylesheets/style-small.css', containers: '90%!', grid: { gutters: ['1.25em', 0], zoom: 3 } },
			xsmall: { media: '(max-width: 480px)', href: '/stylesheets/style-xsmall.css' }
		}
	});
})(jQuery);