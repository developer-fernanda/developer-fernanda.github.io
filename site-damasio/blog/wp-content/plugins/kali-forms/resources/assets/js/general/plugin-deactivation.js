import './plugin-deactivation.scss';
import UninstallFeedback from './uninstall-feedback';
const { __ } = wp.i18n;
jQuery(document).ready(_ => {
	const uninstallScript = UninstallFeedback;

	uninstallScript.slug = 'kaliforms';
	uninstallScript.template = KaliFormsPluginDeactivationObject.modalHtml;
	uninstallScript.form = 'kaliforms-deactivate-form';
	uninstallScript.deactivateUrl = jQuery('#kaliforms-deactivate-link-kaliforms').attr('href');
	uninstallScript.deactivate = false;

	uninstallScript.translations = {
		'setup': __('What was the dificult part ?', 'kaliforms'),
		'docs': __('What can we describe more ?', 'kaliforms'),
		'features': __('How could we improve ?', 'kaliforms'),
		'better-plugin': __('Can you mention it ?', 'kaliforms'),
		'incompatibility': __('With what plugin or theme is incompatible ?', 'kaliforms'),
		'maintenance': __('Please specify', 'kaliforms'),
	};

	uninstallScript.nonce = KaliFormsPluginDeactivationObject.ajax_nonce;
	uninstallScript.init(jQuery('#kaliforms-deactivate-link-kaliforms'));
});
