const UninstallFeedback = {
	/**
	 * Template setter
	 */
	set template($html) {
		this._template = $html
	},
	/**
	 * Template getter
	 */
	get template() {
		return this._template;
	},
	/**
	 * Form setter
	 */
	set form(id) {
		this._form = jQuery('#' + id);
	},
	/**
	 * Form getter
	 */
	get form() {
		return this._form;
	},
	/**
	 * Initator
	 *
	 * @param {*} selector
	 */
	init(selector) {
		this.trigger = selector;

		this.form.html(this.template);
		this._attachEvents();
	},
	/**
	 * Submits the feedback to our website
	 */
	_submitFeedback(data) {
		const args = {
			...data,
			nonce: this.nonce
		}

		this.form.addClass('process-response');
		this.form.find('.deactivating-spinner').fadeIn();

		jQuery.ajax({
			type: 'POST',
			data: { action: this.slug + '_uninstall_feedback', args },
			dataType: 'json',
			url: ajaxurl,
			// success: response => console.log(response),
			success: response => window.location.href = this.deactivateUrl,
			error: err => console.warn(err)

		})
	},
	/**
	 * Show form
	 *
	 */
	_showForm() {
		jQuery('body').toggleClass(this.slug + '-deactivate-form-active');

		this.form.fadeIn({
			complete: () => {
				let offset = this.form.offset();
				if (offset.top < 50) {
					jQuery(this).parent().css('top', (50 - offset.top) + 'px')
				}
				jQuery('html,body').animate({ scrollTop: Math.max(0, offset.top - 50) });
			}
		});
	},
	/**
	 * Attaches events to the form
	 *
	 */
	_attachEvents() {
		const self = this;
		this.trigger.on('click', (e) => { e.preventDefault(); this._showForm() });

		this.form.on('change', 'input[type=radio]', () => {
			let label = self.form.find('#' + self.slug + '-deactivate-details-label strong');
			let anonymousLabel = self.form.find('p[id="' + self.slug + '-anonymous"]')[0];
			let submitSpan = self.form.find('#' + self.slug + '-deactivate-submit-form span')[0];
			let value = self.form.find('input[name="' + self.slug + '-deactivate-reason"]:checked').val();

			label.text(self.translations[value]);
			anonymousLabel.style.display = 'inline-block';
			submitSpan.style.display = 'inline-block';
		});

		this.form.on('click', '#' + self.slug + '-deactivate-submit-form', e => {
			e.preventDefault();

			let data = {
				reason: this.form.find('input[name="' + self.slug + '-deactivate-reason"]:checked').val(),
				details: this.form.find('#' + self.slug + '-deactivate-details').val(),
				anonymous: this.form.find('#' + self.slug + '-anonymous:checked').length ? true : userSettings.uid,
			};
			typeof data.reason === 'undefined' ? window.location.href = this.deactivateUrl : this._submitFeedback(data)
		});

		jQuery('.' + this.slug + '-deactivate-form-bg').on('click', () => {
			this.form.fadeOut();
			jQuery('body').removeClass(this.slug + '-deactivate-form-active');
		});
	}
}

export default UninstallFeedback;
