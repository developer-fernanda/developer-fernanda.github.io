import FormProcessor from './form-processor';

jQuery(window).on('elementor/frontend/init', () => {
	elementorFrontend.hooks.addAction('frontend/element_ready/global', el => {
		const forms = jQuery(el).find('.kaliforms-form-container');
		Array.prototype.forEach.call(forms, e => {
			if (jQuery(e).hasClass('kali-init')) {
				return;
			}

			new FormProcessor(e)
			jQuery(e).addClass('kali-init');
		})
	});
});
