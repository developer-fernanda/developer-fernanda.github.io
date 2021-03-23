import { observable, action, computed, makeObservable } from 'mobx';

if (!KaliFormsObject.hasOwnProperty('userRegistration')) {
	KaliFormsObject.userRegistration = {}
}

export default class UserRegistration {
    enabled = KaliFormsObject.userRegistration.enabled || false;
    fields = KaliFormsObject.userRegistration.fields || [];
    customFields = KaliFormsObject.userRegistration.customFields || [];
    customFieldsValues = KaliFormsObject.userRegistration.customFieldsValues || [];
    role = KaliFormsObject.userRegistration.role || 'subscriber';

    constructor() {
        makeObservable(this, {
            enabled: observable,
            fields: observable,
            customFields: observable,
            customFieldsValues: observable,
            role: observable,
            setEnabled: action,
            setFields: action,
            setCustomFields: action,
            setCustomFieldsValues: action,
            addCustomField: action,
            removeCustomField: action,
            setRole: action,
            data: computed
        });
    }

    setEnabled(state) {
		this.enabled = state;
	}
    setFields(fields) {
		this.fields = fields;
	}
    setCustomFields(fields) {
		this.customFields = fields
	}
    setCustomFieldsValues(fields) {
		this.customFieldsValues = fields
	}
    addCustomField(field) {
		this.customFields.push(field);
	}
    removeCustomField(idx) {
		this.customFields = this.customFields.filter((e, index) => idx !== index);
	}
    setRole(role) {
		this.role = role;
	}
    get data() {
		return {
			enabled: this.enabled,
			role: this.role,
			fields: this.fields,
			customFields: this.customFields,
			customFieldsValues: this.customFieldsValues
		}
	}
}
