import { observable, action, computed, makeObservable } from 'mobx';
import { computedFn } from "mobx-utils"
export default class Emails {
    emails = KaliFormsObject.formEmails;

    emailWizardVisibility = false;

    selectedEmail = 0;

    getPropertyValue = computedFn(function getPropertyValue(idx, propertyId) {
		if (!this.emails.length || typeof this.emails[idx] === 'undefined' || typeof this.emails[idx][propertyId] === 'undefiend') {
			return null
		}

		return this.emails[idx][propertyId];
	})

    constructor() {
        makeObservable(this, {
            emails: observable,
            emailWizardVisibility: observable,
            selectedEmail: observable,
            addEmail: action,
            removeEmail: action,
            duplicateEmail: action,
            setEmailProp: action,
            addEmails: action,
            setEmails: action
        });
    }

    addEmail(email) {
		this.emails.push(email)
	}

    removeEmail(idx) {
		this.emails = [...this.emails].filter((email, i) => idx !== i);
	}

    duplicateEmail(idx) {
		let dupe = { ...this.emails[idx] }
		dupe.emailSubject = dupe.emailSubject + ' duplicate';

		this.addEmail(dupe);
	}

    setEmailProp(idx, key, value) {
		this.emails[idx][key] = value;
		this.emails = [...this.emails]
	}

    addEmails(emails) {
		this.emails = [...this.emails, ...emails]
	}

    setEmails(emails) {
		this.emails = [...emails];
	}
}
