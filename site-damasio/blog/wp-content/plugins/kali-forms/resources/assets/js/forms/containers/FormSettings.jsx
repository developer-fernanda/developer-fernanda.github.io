import React from 'react';
import FormInfo from './../components/FormSettings/FormInfo';
import FormPayments from './../components/FormSettings/FormPayments';
import FormConditionalLogic from './../components/FormSettings/FormConditionalLogic';
import FormCustomPhp from './../components/FormSettings/FormCustomPhp';
import FormCustomCss from './../components/FormSettings/FormCustomCss';
import FormCustomJs from './../components/FormSettings/FormCustomJs';
import FormCalculator from './../components/FormSettings/FormCalculator';
import FormStyling from './../components/FormSettings/FormStyling';
import FormSpam from './../components/FormSettings/FormSpam';
import HubSpotIntegration from './../components/FormSettings/HubSpotIntegration';
import Newsletter from './../components/FormSettings/Newsletter';
import SlackContainer from './../components/FormSettings/SlackContainer';
import WebHooksContainer from './../components/FormSettings/WebHooksContainer';
import { observer } from "mobx-react";
import { store } from "./../store/store";
import UserRegistration from './../components/FormSettings/UserRegistration';
import StripeSettings from './../components/FormSettings/StripeSettings';
import GoogleSheets from './../components/FormSettings/GoogleSheets';
const { __ } = wp.i18n;
import is from 'is_js';
const navigationMap =
{
	general: FormInfo,
	payments: FormPayments,
	styling: FormStyling,
	spam: FormSpam,
	userRegistration: typeof KaliFormsObject.userRegistrationInstalled !== 'undefined' ? UserRegistration : false,
	stripeSettings: typeof KaliFormsObject.hasOwnProperty('payments') !== 'undefined' ? StripeSettings : false,
	hubspotIntegration: typeof KaliFormsObject.hubspotInstalled !== 'undefined' ? HubSpotIntegration : false,
	newsletter: typeof KaliFormsObject.newsletterInstalled !== 'undefined' ? Newsletter : false,
	slack: typeof KaliFormsObject.slackInstalled !== 'undefined' ? SlackContainer : false,
	webhooks: typeof KaliFormsObject.webhooksInstalled !== 'undefined' ? WebHooksContainer : false,
	googleSheets: typeof KaliFormsObject.googleSheetsInstalled !== 'undefined' ? GoogleSheets : false,
	formCalculator: typeof Kali !== 'undefined' && Kali.hasOwnProperty('components') && typeof Kali.components.CodeEditor === 'function' ? FormCalculator : false,
	formCustomCss: typeof Kali !== 'undefined' && Kali.hasOwnProperty('components') && typeof Kali.components.CodeEditor === 'function' ? FormCustomCss : false,
	formCustomJs: typeof Kali !== 'undefined' && Kali.hasOwnProperty('components') && typeof Kali.components.CodeEditor === 'function' ? FormCustomJs : false,
	formCustomPhp: typeof Kali !== 'undefined' && Kali.hasOwnProperty('components') && typeof Kali.components.CodeEditor === 'function' ? FormCustomPhp : false,
	conditionalLogic: typeof KaliFormsObject.conditionalLogic !== 'undefined' ? FormConditionalLogic : false,

}
const FormSettings = observer(props => {
	let component = navigationMap[store._UI_.activeFormSettingsItem];

	return (
		<React.Fragment>
			<Choose>
				<When condition={is.boolean(component)}>
					<div>{__('There is nothing here for you', 'kaliforms')}</div>
				</When>
				<Otherwise>
					{React.createElement(component)}
				</Otherwise>
			</Choose>
		</React.Fragment>
	);
})

export default FormSettings;
