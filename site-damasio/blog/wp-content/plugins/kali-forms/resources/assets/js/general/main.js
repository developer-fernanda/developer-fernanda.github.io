import './main.scss';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'node-snackbar/dist/snackbar.min.css';
import Snackbar from 'node-snackbar';
const { __ } = wp.i18n;
jQuery(document).ready(() => {
	tippy('.kaliforms-tooltip');

	const extensionsReload = document.getElementById('kali-extensions-reload');
	if (extensionsReload !== null) {
		extensionsReload.addEventListener('click', event => reloadExtensionsAction(event));
	}
	jQuery('.kaliform-shortcode-formgroup').on('click', 'button', e => {
		let input = jQuery(e.target).parents('.kaliform-shortcode-formgroup').find('input');
		input.select();
		document.execCommand('copy');
		document.getSelection().removeAllRanges();
		input.blur();
		Snackbar.show({ text: __('Shortcode copied to clipboard', 'kaliforms') });
	});

	jQuery('.kaliforms-notice').on('click', '.notice-dismiss', e => {
		let args = {
			id: jQuery(e.target).parents('.kaliforms-notice').data('unique-id'),
			userId: userSettings.uid,
			nonce: KaliFormsGeneralObject.ajax_nonce,
		}

		jQuery.ajax({
			type: 'POST',
			data: { action: 'kaliforms_dismiss_notice', args: args },
			dataType: 'json',
			url: ajaxurl,
		});
	});

	jQuery('.kaliforms-themes-formgroup').on('change', 'select', e => {
		let args = {
			formId: e.target.getAttribute('data-form-id'),
			newTheme: e.target.value,
			nonce: KaliFormsGeneralObject.ajax_nonce,
		}

		jQuery.ajax({
			type: 'POST',
			data: { action: 'kaliforms_set_form_theme', args },
			dataType: 'json',
			url: ajaxurl,
			success: (data) => {
				Snackbar.show({ text: __('Theme applied', 'kaliforms') });
			}
		})
	});

	jQuery('#kaliforms-system-check-email-send').on('click', e => {
		e.preventDefault();
		jQuery(e.target).addClass('disabled');
		let args = {
			userId: userSettings.uid,
			nonce: KaliFormsGeneralObject.ajax_nonce,
		}

		jQuery.ajax({
			type: 'POST',
			data: { action: 'kaliforms_test_email', args },
			dataType: 'json',
			url: ajaxurl,
			success: (data) => {
				if (data.success && data.sent) {
					let content = jQuery(e.target).parents('.health-check-accordion-panel').children('p')
					content.html('Check the email address associated with your email (check the spam folder as well)');
					jQuery(e.target).hide();
				}
			},
			error: (err) => {
				let content = jQuery(e.target).parents('.health-check-accordion-panel').children('p');
				jQuery(e.target).hide();
				content.css('color', 'red');
				content.html('Something went wrong. Please verify the email settings and if the problem persists - contact support');
			}
		})
	});

	jQuery('.kaliforms-duplicate-form-link').on('click', e => {
		e.preventDefault();
		const args = {
			userId: userSettings.uid,
			id: jQuery(e.target).attr('data-post-id'),
			nonce: KaliFormsGeneralObject.ajax_nonce,
		}
		jQuery.ajax({
			type: 'POST',
			data: { action: 'kaliforms_duplicate_post', args },
			dataType: 'json',
			url: ajaxurl,
			success: (data) => {
				if (data.success) {
					location.reload();
				}
			},
			error: (err) => {
				console.warn('something went wrong')
			}
		})
	})
});

/**
 * Reload extensions
 */
const reloadExtensionsAction = () => {
	event.preventDefault();
	const anchor = event.target;
	// Start it
	anchor.classList.add('updating-message');
	anchor.setAttribute('disabled', 'disabled');
	let data = "action=kaliforms_reload_api_extensions&nonce=" + KaliFormsGeneralObject.ajax_nonce;
	const xmlHttp = new XMLHttpRequest();
	xmlHttp.open('POST', ajaxurl, true);
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xmlHttp.send(data);
	xmlHttp.onreadystatechange = () => {
		if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
			anchor.classList.remove('updating-message');
			anchor.removeAttribute('disabled');
			var res = JSON.parse(xmlHttp.response);
			if (res.status === 'ok') {
				location.reload();
			}

		}
	}
}

var kfnl_log_clear = document.getElementById('kf-newsletter-log-clear');
if (kfnl_log_clear !== null) {
	kfnl_log_clear.addEventListener('click', evt => {
		evt.preventDefault();

		let args = {
			nonce: KaliFormsGeneralObject.ajax_nonce,
		}

		jQuery.ajax({
			type: 'POST',
			data: { action: 'kaliforms_clear_nl_log', args: args },
			dataType: 'json',
			url: ajaxurl,
			success: (data) => {
				if (data.success) {
					location.reload();
				}
			},
		});
	})
}
var kfsms_log_clear = document.getElementById('kf-sms-log-clear');
if (kfsms_log_clear !== null) {
	kfsms_log_clear.addEventListener('click', evt => {
		evt.preventDefault();

		let args = {
			nonce: KaliFormsGeneralObject.ajax_nonce,
		}

		jQuery.ajax({
			type: 'POST',
			data: { action: 'kaliforms_clear_sms_log', args: args },
			dataType: 'json',
			url: ajaxurl,
			success: (data) => {
				if (data.success) {
					location.reload();
				}
			},
		});
	})
}
var kfgoogle_log_clear = document.getElementById('kf-google-log-clear');
if (kfgoogle_log_clear !== null) {
	kfgoogle_log_clear.addEventListener('click', evt => {
		evt.preventDefault();

		let args = {
			nonce: KaliFormsGeneralObject.ajax_nonce,
		}

		jQuery.ajax({
			type: 'POST',
			data: { action: 'kaliforms_clear_google_log', args: args },
			dataType: 'json',
			url: ajaxurl,
			success: (data) => {
				if (data.success) {
					location.reload();
				}
			},
		});
	})
}
