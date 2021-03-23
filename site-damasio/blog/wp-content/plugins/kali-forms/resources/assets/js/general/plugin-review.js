jQuery('.kaliforms-review-button').on('click', (e) => {
	let rateAction = jQuery(e.target).attr('id');
	if (rateAction !== 'kaliforms-rate') {
		e.preventDefault();
	}

	let args = {
		nonce: KaliFormsPluginReviewObject.ajax_nonce,
		user_action: rateAction,
		rate_state: rateAction === 'kaliforms-rated' ? 1 : 0
	}

	jQuery.ajax({
		type: 'POST',
		data: { action: 'kaliforms_review', args },
		dataType: 'json',
		url: ajaxurl,
		success: (data) => {
			jQuery('#kaliforms-review-notice').slideUp(200, () => jQuery(this).remove())
		},
		error: (err) => {
			console.warn(err);
		}
	})
});
