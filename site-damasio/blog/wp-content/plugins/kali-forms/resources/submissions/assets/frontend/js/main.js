jQuery(document).ready(() => {
	jQuery('#delete-kaliform-submission').on('click', e => {
		e.preventDefault();
		let args = {
			submissionId: jQuery(e.target).data('submission-id'),
			formId: jQuery(e.target).data('form-id'),
			hash: jQuery(e.target).data('hash'),
			nonce: KaliFormsObject.ajax_nonce,
		}

		jQuery.ajax({
			type: 'POST',
			data: { action: 'kaliforms_delete_submission', args },
			dataType: 'json',
			url: KaliFormsObject.ajaxurl,
			complete: (data) => {
				if (data.responseText === 'ok') {
					alert('Submission deleted');
					window.location = KaliFormsObject.frontendUrl;
				} else {
					alert('Something went wrong')
				}
			}
		});
	})
})
