import { observable, action, computed, makeObservable } from 'mobx';

export default class Ui {
	appBar = 'formBuilder';
	sidebar = 'formFields';
	drawerLoading = false;
	pageLoading = false;
	placeholderDialog = false;
	emailWizardDialog = false;
	activeTabInSidebar = 'formFields';
	activeFormFieldInSidebar = 0;
	activeFormFieldGroupTab = 'general';
	templateSelecting = false;
	activeEmailInSidebar = false;
	activeFormSettingsItem = 'general';
	bottomDrawer = false;
	bottomDrawerCallback = null;
	backDropComponent = null;
	activeTabInNotificationSidebar = 'email';
	activeSMSInSidebar = false;
	dragDropHelper = true;
	setBottomDrawerCallback(callback) {
		this.bottomDrawerCallback = callback;
	}
	setBottomDrawer(state) {
		this.bottomDrawer = state;
	}
	setActiveFormFieldGroupTab(key) {
		this.activeFormFieldGroupTab = key;
	}
	setTemplateSelecting(state) {
		document.getElementsByTagName('body')[0].style.background = state
			? '#fff'
			: this.appBar === 'formSettings' ? '#fff' : '#898989';

		this.templateSelecting = state;
	}
	setActiveFormFieldInSidebar(key) {
		this.activeFormFieldInSidebar = key;
	}
	setActiveFormSettingsItem(key) {
		this.activeFormSettingsItem = key;
	}
	setActiveEmailInSidebar(key) {
		this.activeEmailInSidebar = key;
	}
	setActiveSMSInSidebar(key) {
		this.activeSMSInSidebar = key;
	}
	setActiveTabInSidebar(string) {
		this.activeTabInSidebar = string
	}
	setActiveTabInNotificationSidebar(string) {
		this.activeTabInNotificationSidebar = string
	}
	setPlaceholderDialog(loading) {
		this.placeholderDialog = loading;
	}
	setEmailWizardDialog(loading) {
		this.emailWizardDialog = loading;
	}
	setPlaceholderDialog(state) {
		this.placeholderDialog = state
	}
	setPageLoading(loading) {
		this.pageLoading = loading;
	}
	setAppBar(string) {
		document.getElementsByTagName('body')[0].style.background = string === 'formSettings'
			? '#fff'
			: '#898989';

		this.appBar = string;
	}
	setSidebar(string) {
		this.sidebar = string
	}
	setDrawerLoading(loading) {
		this.drawerLoading = loading;
	}
	setBackDropComponent(component) {
		this.backDropComponent = component;
	}

	constructor() {
		makeObservable(this, {
			appBar: observable,
			sidebar: observable,
			drawerLoading: observable,
			pageLoading: observable,
			placeholderDialog: observable,
			emailWizardDialog: observable,
			activeTabInSidebar: observable,
			activeFormFieldInSidebar: observable,
			activeFormFieldGroupTab: observable,
			templateSelecting: observable,
			activeEmailInSidebar: observable,
			activeFormSettingsItem: observable,
			bottomDrawer: observable,
			bottomDrawerCallback: observable,
			backDropComponent: observable,
			activeTabInNotificationSidebar: observable,
			activeSMSInSidebar: observable,
			dragDropHelper: observable,
			setBottomDrawerCallback: action,
			setBottomDrawer: action,
			setActiveFormFieldGroupTab: action,
			setTemplateSelecting: action,
			setActiveFormFieldInSidebar: action,
			setActiveFormSettingsItem: action,
			setActiveEmailInSidebar: action,
			setActiveSMSInSidebar: action,
			setActiveTabInSidebar: action,
			setActiveTabInNotificationSidebar: action,
			setPlaceholderDialog: action,
			setEmailWizardDialog: action,
			setPlaceholderDialog: action,
			setPageLoading: action,
			setAppBar: action,
			setSidebar: action,
			setDrawerLoading: action,
			setBackDropComponent: action
		});

		const formId = KaliFormsObject.formId;
		const url = window.location.href;
		if (url.search(`post=${formId}`) === -1) {
			this.setTemplateSelecting(true);
		}
	}
}
