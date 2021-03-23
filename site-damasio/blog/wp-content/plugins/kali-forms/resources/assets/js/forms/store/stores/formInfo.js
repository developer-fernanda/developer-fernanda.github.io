import { observable, action, computed, makeObservable } from 'mobx';
import { computedFn } from "mobx-utils"
import { store } from "./../../store/store";
export default class FormInfo {
	formName = KaliFormsObject.formName;
	requiredFieldMark = KaliFormsObject.requiredFieldMark;
	globalErrorMessage = KaliFormsObject.globalErrorMessage;
	multipleSelectionsSeparator = KaliFormsObject.multipleSelectionsSeparator;
	cssId = KaliFormsObject.cssId;
	cssClass = KaliFormsObject.cssClass;
	thankYouMessage = KaliFormsObject.thankYouMessage;
	conditionalThankYou = KaliFormsObject.conditionalThankYou;
	conditionalThankYouMessage = KaliFormsObject.conditionalThankYouMessage;
	redirectUrl = KaliFormsObject.redirectUrl;
	honeypot = KaliFormsObject.honeypot;
	hideFormName = KaliFormsObject.hideFormName;
	saveIpAddress = KaliFormsObject.saveIpAddress;
	removeCaptchaForLoggedUsers = KaliFormsObject.removeCaptchaForLoggedUsers;
	resetFormAfterSubmit = KaliFormsObject.resetFormAfterSubmit;
	showThankYouMessage = KaliFormsObject.showThankYouMessage;
	saveFormSubmissions = KaliFormsObject.saveFormSubmissions;
	submissionViewPage = typeof KaliFormsObject.submissionViewPage !== 'undefined' ? KaliFormsObject.submissionViewPage : '';
	akismet = KaliFormsObject.akismet;
	akismetFields = KaliFormsObject.akismetFields;
	googleSecretKey = KaliFormsObject.googleSecretKey;
	googleSiteKey = KaliFormsObject.googleSiteKey;
	currency = KaliFormsObject.currency;
	paymentsLive = KaliFormsObject.paymentsLive;
	payPalClientId = KaliFormsObject.payPalClientId;
	payPalClientIdSandBox = KaliFormsObject.payPalClientIdSandBox;
	stripeKey = typeof KaliFormsObject.stripeKey !== 'undefined' ? KaliFormsObject.stripeKey : '';
	stripeKeySandBox = typeof KaliFormsObject.stripeKeySandBox !== 'undefined' ? KaliFormsObject.stripeKeySandBox : '';
	conditionalLogic = KaliFormsObject.conditionalLogic;
	calculator = typeof KaliFormsObject.formScripting !== 'undefined' ? KaliFormsObject.formScripting.calculator : '';
	customCss = typeof KaliFormsObject.formScripting !== 'undefined' ? KaliFormsObject.formScripting.css : '';
	customJs = typeof KaliFormsObject.formScripting !== 'undefined' ? KaliFormsObject.formScripting.js : '';
	customPhpAfter = typeof KaliFormsObject.formScripting !== 'undefined' ? KaliFormsObject.formScripting.phpAfter : '';
	customPhpBefore = typeof KaliFormsObject.formScripting !== 'undefined' ? KaliFormsObject.formScripting.phpBefore : '';
	hubspotData = typeof KaliFormsObject.hubspotData !== 'undefined' ? KaliFormsObject.hubspotData : '';
	deleteQueue = typeof KaliFormsObject.deleteQueue !== 'undefined' ? KaliFormsObject.deleteQueue : '';
	formAction = KaliFormsObject.formAction;
	formMethod = KaliFormsObject.formMethod;
	preventMultipleEntriesFromSameUser = typeof KaliFormsObject.preventMultipleEntriesFromSameUser !== 'undefined' ? KaliFormsObject.preventMultipleEntriesFromSameUser : '';
	multipleEntriesInvalidate = typeof KaliFormsObject.multipleEntriesInvalidate !== 'undefined' ? KaliFormsObject.multipleEntriesInvalidate : 'userid';
	multipleEntriesError = typeof KaliFormsObject.multipleEntriesError !== 'undefined' ? KaliFormsObject.multipleEntriesError : '';
	multipleEntriesInvalidateField = typeof KaliFormsObject.multipleEntriesInvalidateField !== 'undefined' ? KaliFormsObject.multipleEntriesInvalidateField : '';
	pagebreakCompleteLabel = typeof KaliFormsObject.pagebreakCompleteLabel !== 'undefined' ? KaliFormsObject.pagebreakCompleteLabel : '';
	constructor() {
		makeObservable(this, {
			multipleEntriesError: observable,
			preventMultipleEntriesFromSameUser: observable,
			multipleEntriesInvalidate: observable,
			multipleEntriesInvalidateField: observable,
			formName: observable,
			requiredFieldMark: observable,
			globalErrorMessage: observable,
			multipleSelectionsSeparator: observable,
			cssId: observable,
			cssClass: observable,
			thankYouMessage: observable,
			conditionalThankYou: observable,
			conditionalThankYouMessage: observable,
			redirectUrl: observable,
			honeypot: observable,
			hideFormName: observable,
			saveIpAddress: observable,
			removeCaptchaForLoggedUsers: observable,
			resetFormAfterSubmit: observable,
			showThankYouMessage: observable,
			saveFormSubmissions: observable,
			submissionViewPage: observable,
			akismet: observable,
			akismetFields: observable,
			googleSecretKey: observable,
			googleSiteKey: observable,
			currency: observable,
			paymentsLive: observable,
			payPalClientId: observable,
			payPalClientIdSandBox: observable,
			stripeKey: observable,
			stripeKeySandBox: observable,
			conditionalLogic: observable,
			calculator: observable,
			customCss: observable,
			customJs: observable,
			customPhpAfter: observable,
			customPhpBefore: observable,
			hubspotData: observable,
			deleteQueue: observable,
			formAction: observable,
			formMethod: observable,
			setFormInfo: action,
			setConditionalLogic: action,
			addConditional: action,
			duplicateCondition: action,
			removeThankYouMessage: action,
			removeCondition: action,
			removeConditionByAssertion: action,
			duplicateConditionByAssertion: action,
			conditionsAvailable: computed,
			pagebreakCompleteLabel: observable
		});
	}
	setFormInfo(data) {
		for (let key in data) {
			if (this.hasOwnProperty(key) && key !== 'conditionalLogic') {
				this[key] = data[key];
			}
		}
	}

	setConditionalLogic(logic) {
		this.conditionalLogic = logic;
	}

	addConditional(item) {
		this.conditionalLogic.push(item)
	}

	duplicateCondition(index) {
		this.conditionalLogic.map((e, idx) => {
			if (idx === index) {
				let newCondition = { ...e }
				newCondition.name += ' (duplicate)';
				this.addConditional(newCondition)
			}
		})
	}

	removeThankYouMessage(index) {
		this.conditionalThankYouMessage = [...this.conditionalThankYouMessage].filter((el, idx) => idx !== index)
	}

	removeCondition(index) {
		this.conditionalLogic = [...this.conditionalLogic].filter((el, idx) => idx !== index)
	}

	removeConditionByAssertion(condition) {
		this.conditionalLogic = [...this.conditionalLogic].filter(field => JSON.stringify(field) !== JSON.stringify(condition));
	}
	duplicateConditionByAssertion(condition) {
		this.conditionalLogic.map((e, idx) => {
			if (JSON.stringify(e) === JSON.stringify(condition)) {
				let newCondition = { ...e }
				newCondition.name += ' (duplicate)';
				this.addConditional(newCondition)
			}
		})
	}

	getFieldConditionersByInternalId = computedFn(function getFieldConditionersByInternalId(internalId) {
		if (typeof this.conditionalLogic === 'undefined') {
			return [];
		}

		let conditions = [...this.conditionalLogic].filter(e => e.conditioner === internalId);
		return conditions;
	})

	getFieldConditionsByInternalId = computedFn(function getFieldConditionsByInternalId(internalId) {
		let conditions = [...this.conditionalLogic].filter(e => e.field === internalId);
		return conditions;
	})

	get conditionsAvailable() {
		return Object.keys(store._FIELD_COMPONENTS_.fieldConditioners).length > 0;
	}
}
