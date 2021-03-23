import React from 'react';
import { observer } from "mobx-react";
import { store } from "./../../store/store";

export const SaveDataComponent = observer(props => {
	return (
		<React.Fragment>
			<input
				type="hidden"
				value={JSON.stringify(store._FIELD_COMPONENTS_.fieldComponents)}
				name='kaliforms[field_components]' />
			<input
				type="hidden"
				value={JSON.stringify(store._GRID_.grid)}
				name="kaliforms[grid]" />
			<input
				type="hidden"
				name="kaliforms[emails]"
				value={JSON.stringify(store._EMAILS_.emails)} />

			<input type="hidden" name={"kaliforms[required_field_mark]"} value={store._FORM_INFO_.requiredFieldMark || ''} />
			<input type="hidden" name={"kaliforms[multiple_selections_separator]"} value={store._FORM_INFO_.multipleSelectionsSeparator || ''} />
			<input type="hidden" name={"kaliforms[remove_captcha_for_logged_users]"} value={store._FORM_INFO_.removeCaptchaForLoggedUsers || ''} />
			<input type="hidden" name={"kaliforms[hide_form_name]"} value={store._FORM_INFO_.hideFormName || ''} />
			<input type="hidden" name={"kaliforms[save_ip_address]"} value={store._FORM_INFO_.saveIpAddress || '0'} />
			<input type="hidden" name={"kaliforms[global_error_message]"} value={store._FORM_INFO_.globalErrorMessage || ''} />
			<input type="hidden" name={"kaliforms[honeypot]"} value={store._FORM_INFO_.honeypot || ''} />
			<input type="hidden" name={"kaliforms[show_thank_you_message]"} value={store._FORM_INFO_.showThankYouMessage || ''} />
			<input type="hidden" name={"kaliforms[save_form_submissions]"} value={store._FORM_INFO_.saveFormSubmissions || ''} />
			<input type="hidden" name={"kaliforms[submission_view_page]"} value={store._FORM_INFO_.submissionViewPage || ''} />
			<input type="hidden" name={"kaliforms[thank_you_message]"} value={store._FORM_INFO_.thankYouMessage || ''} />
			<input type="hidden" name={"kaliforms[conditional_thank_you]"} value={store._FORM_INFO_.conditionalThankYou || ''} />
			<If condition={typeof KaliFormsObject.conditionalLogic !== 'undefined'}>
				<input type="hidden"
					name={"kaliforms[conditional_thank_you_message]"}
					value={JSON.stringify(store._FORM_INFO_.conditionalThankYouMessage || [])}
				/>
				<input type="hidden" name={"kaliforms[multiple_entries_error]"} value={store._FORM_INFO_.multipleEntriesError || ''} />
				<input type="hidden" name={"kaliforms[prevent_multiple_entries]"} value={store._FORM_INFO_.preventMultipleEntriesFromSameUser || '0'} />
				<input type="hidden" name={"kaliforms[multiple_entries_invalidate]"} value={store._FORM_INFO_.multipleEntriesInvalidate || 'userid'} />
				<input type="hidden" name={"kaliforms[multiple_entries_invalidate_field]"} value={store._FORM_INFO_.multipleEntriesInvalidateField || ''} />
				<input type="hidden" name={"kaliforms[pagebreak_complete_label]"} value={store._FORM_INFO_.pagebreakCompleteLabel || ''} />
			</If>
			<input type="hidden" name={"kaliforms[reset_form_after_submit]"} value={store._FORM_INFO_.resetFormAfterSubmit || ''} />
			<input type="hidden" name={"kaliforms[redirect_url]"} value={store._FORM_INFO_.redirectUrl || ''} />
			<input type="hidden" name={"kaliforms[form_action]"} value={store._FORM_INFO_.formAction || ''} />
			<input type="hidden" name={"kaliforms[form_method]"} value={store._FORM_INFO_.formMethod || ''} />
			<input type="hidden" name={"kaliforms[css_id]"} value={store._FORM_INFO_.cssId || ''} />
			<input type="hidden" name={"kaliforms[css_class]"} value={store._FORM_INFO_.cssClass || ''} />
			<input type="hidden" name={"kaliforms[akismet]"} value={store._FORM_INFO_.akismet || ''} />
			<input type="hidden"
				name={"kaliforms[akismet_fields]"}
				value={JSON.stringify(store._FORM_INFO_.akismetFields || [])}
			/>

			<input type="hidden" name={"kaliforms[google_site_key]"} value={store._FORM_INFO_.googleSiteKey || ''} />
			<input type="hidden" name={"kaliforms[google_secret_key]"} value={store._FORM_INFO_.googleSecretKey || ''} />
			<input type="hidden" name={"kaliforms[currency]"} value={store._FORM_INFO_.currency || ''} />
			<input type="hidden" name={"kaliforms[payments_live]"} value={store._FORM_INFO_.paymentsLive || ''} />
			<input type="hidden" name={"kaliforms[paypal_client_id]"} value={store._FORM_INFO_.payPalClientId || ''} />
			<input type="hidden" name={"kaliforms[paypal_client_id_sandbox]"} value={store._FORM_INFO_.payPalClientIdSandBox || ''} />

			<If condition={KaliFormsObject.hasOwnProperty('payments')}>
				<input type="hidden"
					name={"kaliforms[stripe_fields]"}
					value={JSON.stringify(store._PAYMENTS_.stripeFields || [])}
				/>
				<input type="hidden" name={"kaliforms[stripe_s_key]"} value={store._PAYMENTS_.stripeSKey || ''} />
				<input type="hidden" name={"kaliforms[stripe_p_key]"} value={store._PAYMENTS_.stripePKey || ''} />
				<input type="hidden" name={"kaliforms[stripe_s_key_live]"} value={store._PAYMENTS_.stripeSKeyLive || ''} />
				<input type="hidden" name={"kaliforms[stripe_p_key_live]"} value={store._PAYMENTS_.stripePKeyLive || ''} />
				<input type="hidden" name={"kaliforms[stripe_country]"} value={store._PAYMENTS_.stripeCountry || ''} />
				<input type="hidden" name={"kaliforms[stripe_payment_button]"} value={store._PAYMENTS_.stripePaymentRequestButton || ''} />
			</If>

			<textarea readOnly style={{ display: 'none' }} name={"kaliforms[form_calculator]"} value={store._FORM_INFO_.calculator || ''}>{store._FORM_INFO_.calculator}</textarea>
			<textarea readOnly style={{ display: 'none' }} name={"kaliforms[form_scripting_css]"} value={store._FORM_INFO_.customCss || ''}>{store._FORM_INFO_.customCss}</textarea>
			<textarea readOnly style={{ display: 'none' }} name={"kaliforms[form_scripting_js]"} value={store._FORM_INFO_.customJs || ''}>{store._FORM_INFO_.customJs}</textarea>
			<textarea readOnly style={{ display: 'none' }} name={"kaliforms[form_scripting_php_before]"} value={store._FORM_INFO_.customPhpBefore || ''}>{store._FORM_INFO_.customPhpBefore}</textarea>
			<textarea readOnly style={{ display: 'none' }} name={"kaliforms[form_scripting_php_after]"} value={store._FORM_INFO_.customPhpAfter || ''}>{store._FORM_INFO_.customPhpAfter}</textarea>

			<If condition={typeof KaliFormsObject.conditionalLogic !== 'undefined'}>
				<input type="hidden"
					name={"kaliforms[conditional_logic]"}
					value={JSON.stringify(store._FORM_INFO_.conditionalLogic || [])} />
			</If>

			<If condition={typeof KaliFormsObject.hubspotInstalled !== 'undefined'}>
				<input type="hidden" name={"kaliforms[hubspot]"} value={JSON.stringify(store._FORM_INFO_.hubspotData || [])} />
				<input type="hidden" name={"kaliforms[hubspot_delete_queue]"} value={JSON.stringify(store._FORM_INFO_.deleteQueue || [])} />
			</If>
			<If condition={typeof KaliFormsObject.googleSheetsInstalled !== 'undefined'}>
				<input type="hidden" name={"kaliforms[google_sheets_data]"} value={JSON.stringify(store._GOOGLE_SHEETS_.data || {})} />
			</If>
			<If condition={typeof KaliFormsObject.newsletterInstalled !== 'undefined'}>
				<input type="hidden" name={"kaliforms[newsletter_data]"} value={JSON.stringify(store._NEWSLETTER_.data || {})} />
			</If>
			<If condition={typeof KaliFormsObject.slackInstalled !== 'undefined'}>
				<input type="hidden" name={"kaliforms[slack_data]"} value={JSON.stringify(store._SLACK_.actions || [])} />
			</If>
			<If condition={typeof KaliFormsObject.webhooksInstalled !== 'undefined'}>
				<input type="hidden" name={"kaliforms[webhooks]"} value={JSON.stringify(store._WEBHOOKS_.hooks || [])} />
			</If>
			<If condition={typeof KaliFormsObject.smsInstalled !== 'undefined'}>
				<input
					type="hidden"
					name="kaliforms[sms]"
					value={JSON.stringify(store._SMS_.notifications) || []} />
			</If>
			<If condition={typeof KaliFormsObject.userRegistrationInstalled !== 'undefined'}>
				<input
					type="hidden"
					name="kaliforms[user_registration_data]"
					value={JSON.stringify(store._USER_REGISTRATION_.data) || {}} />
			</If>

			<input type="hidden" name={"kaliforms[selected_form_style]"} value={store._FORM_STYLES_.selectedStyle || ''} />
		</React.Fragment>
	)
});

export default SaveDataComponent;
