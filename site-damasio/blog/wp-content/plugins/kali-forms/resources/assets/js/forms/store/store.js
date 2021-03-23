import { autorun, observable, toJS, makeObservable, configure } from "mobx";
import Ui from './stores/ui';
import FieldComponents from './stores/fieldComponents';
import Grid from './stores/grid';
import Emails from './stores/emails';
import FormInfo from './stores/formInfo';
import FormStyles from './stores/formStyles'
import ConfirmationDialog from './stores/confirmationDialog';
import GlobalNotifications from './stores/globalNotifications';
import Newsletter from './stores/newsletter';
import Slack from './stores/slack';
import SMS from './stores/sms';
import UserRegistration from './stores/userRegistration';
import Payments from './stores/payments';
import WebHooks from './stores/webhooks';
import Errors from './stores/errors';
import GoogleSheets from './stores/googleSheets';

configure({
	enforceActions: 'never',
});

const autoSave = (store, save) => {
	let firstRun = true;
	autorun(() => {
		const json = toJS(store._UI_);
		if (!firstRun) {
			save(json);
		}
		firstRun = false;
	});
}
export const clear = () => {
	localStorage.removeItem('KaliFormsUi_' + KaliFormsObject.formId);
}

class KaliFormsStore {
	_UI_ = new Ui();
	_FIELD_COMPONENTS_ = new FieldComponents();
	_GRID_ = new Grid();
	_EMAILS_ = new Emails();
	_FORM_INFO_ = new FormInfo();
	_FORM_STYLES_ = new FormStyles();
	_CONFIRMATION_DIALOG_ = new ConfirmationDialog();
	_GLOBAL_NOTIFICATIONS_ = new GlobalNotifications();
	_NEWSLETTER_ = new Newsletter();
	_SLACK_ = new Slack();
	_SMS_ = new SMS();
	_USER_REGISTRATION_ = new UserRegistration();
	_PAYMENTS_ = new Payments();
	_ERRORS_ = new Errors();
	_WEBHOOKS_ = new WebHooks();
	_GOOGLE_SHEETS_ = new GoogleSheets();
	constructor() {
		makeObservable(this, {
			_UI_: observable,
			_FIELD_COMPONENTS_: observable,
			_GRID_: observable,
			_EMAILS_: observable,
			_FORM_INFO_: observable,
			_FORM_STYLES_: observable,
			_CONFIRMATION_DIALOG_: observable,
			_GLOBAL_NOTIFICATIONS_: observable,
			_NEWSLETTER_: observable,
			_SLACK_: observable,
			_SMS_: observable,
			_USER_REGISTRATION_: observable,
			_PAYMENTS_: observable,
			_ERRORS_: observable,
			_WEBHOOKS_: observable,
		});

		this.load();
		autoSave(this, this.save.bind(this));
	}

	load() {
		const lS = localStorage.getItem('KaliFormsUi_' + KaliFormsObject.formId);
		if (lS !== null) {
			let $obj = JSON.parse(lS);
			$obj.activeFormSettingsItem = $obj.activeFormSettingsItem === 'integrations'
				? 'payments'
				: $obj.activeFormSettingsItem;

			for (let key in this._UI_) {
				if ($obj.hasOwnProperty(key)) {
					this._UI_[key] = $obj[key];
				}
			}
		}
	}

	save(json) {
		delete json.activeTabInSidebar;
		delete json.activeFormFieldInSidebar;
		delete json.activeFormFieldGroupTab;
		delete json.templateSelecting;
		delete json.activeEmailInSidebar;
		delete json.activeSMSInSidebar;
		delete json.bottomDrawer;

		localStorage.setItem('KaliFormsUi_' + KaliFormsObject.formId, JSON.stringify({ ...json }));
	}
}


export const store = new KaliFormsStore();
