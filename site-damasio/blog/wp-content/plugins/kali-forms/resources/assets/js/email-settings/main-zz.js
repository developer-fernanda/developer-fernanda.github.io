import './main.scss';
const { __ } = wp.i18n;
const predefinedSettings = {
	mailgun: {
		host: 'smtp.mailgun.org',
		port: 587,
		ssl: 'STARTTLS',
		authentication: true,
	},
	mandrill: {
		host: 'smtp.mandrillapp.com',
		port: 587,
		ssl: 'TLS',
		authentication: true,
	},
	sendgrid: {
		host: 'smtp.sendgrid.net',
		port: 587,
		ssl: 'TLS',
		authentication: true,
	},
	gmail: {
		host: 'smtp.gmail.com',
		port: 587,
		ssl: 'TLS',
		authentication: true,
	},
}
const selectors = [
	'#kaliforms_smtp_host',
	'#kaliforms_smtp_auth',
	'#kaliforms_smtp_port',
	'#kaliforms_smtp_secure',
];

document.getElementById('kaliforms_smtp_advanced').addEventListener('click', e => {
	toggleFields(e.target.checked);
});

document.getElementById('kaliforms_email_fail_log').addEventListener('click', e => {
	let exists = document.getElementById('kaliforms_fail_log');
	if (!e.target.checked && exists !== null) {
		exists.style.display = 'none';
	}
	if (e.target.checked && exists !== null) {
		exists.style.display = '';
	}
	if (exists === null && document.getElementById('kaliforms-log-notice') === null) {
		let textNode = document.createElement('span');
		textNode.setAttribute('id', 'kaliforms-log-notice');
		textNode.setAttribute('style', 'color: red')
		let text = document.createTextNode(__('Log will appear after page refresh if this is checked', 'kaliforms'));
		textNode.appendChild(text);
		e.target.parentElement.appendChild(textNode);
	}
});

const toggleFields = (checked) => {
	[...document.querySelectorAll('#kaliforms-email-settings-page .advanced')].map(el => {
		checked ? el.classList.remove('hidden') : el.classList.add('hidden')
	})
}

const removeActive = (elLinks) => {
	elLinks.map(el => el.classList.remove('active'));
}
const links = document.querySelectorAll('.email-settings-import');
[...links].map(el => el.addEventListener('click', event => {
	event.preventDefault();
	removeActive([...links]);
	el.classList.add('active');
	let predefined = event.target.getAttribute('data-predefined-option');
	if (predefined === 'phpmailer') {
		document.getElementById('kaliforms_smtp_advanced').checked = true;
		document.getElementById('kaliforms_smtp_provider').value = predefined;
		toggleFields(true);
		return;
	}

	if (predefinedSettings.hasOwnProperty(predefined)) {
		document.getElementById('kaliforms_smtp_advanced').checked = false;
		toggleFields(false);
		selectors.map(el => {
			switch (el) {
				case '#kaliforms_smtp_host':
					document.querySelector(el).value = predefinedSettings[predefined].host;
					break;
				case '#kaliforms_smtp_auth':
					document.querySelector(el).checked = predefinedSettings[predefined].authentication;
					break;
				case '#kaliforms_smtp_port':
					document.querySelector(el).value = predefinedSettings[predefined].port;
					break;
				case '#kaliforms_smtp_secure':
					document.querySelector(el).value = predefinedSettings[predefined].ssl;
					break;
			}
		});
	}

	document.getElementById('kaliforms_smtp_provider').value = predefined;
}))

var kfmail_log_clear = document.getElementById('kf-mail-log-clear');
if (kfmail_log_clear !== null) {
	kfmail_log_clear.addEventListener('click', evt => {
		evt.preventDefault();

		let args = {
			nonce: KaliFormsGeneralObject.ajax_nonce,
		}

		jQuery.ajax({
			type: 'POST',
			data: { action: 'kaliforms_clear_log', args: args },
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
