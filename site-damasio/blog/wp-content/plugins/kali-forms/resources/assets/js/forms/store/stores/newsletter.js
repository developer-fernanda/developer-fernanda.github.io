import { observable, action, computed, makeObservable } from 'mobx';

export default class Newsletter {
	newsletter = window.hasOwnProperty('KaliFormsNewsletter') ? KaliFormsNewsletter : {};

	list = this.getSavedList();

	form = this.getSavedForm();

	fields = this.getSavedFields();

	provider = this.getSavedProvider();

	doubleOptIn = this.getSavedOptIn();

	constructor() {
		makeObservable(this, {
			newsletter: observable,
			list: observable,
			form: observable,
			fields: observable,
			provider: observable,
			doubleOptIn: observable,
			data: computed
		});
	}

	get data() {
		return {
			provider: this.provider,
			list: this.list,
			doubleOptIn: this.doubleOptIn,
			fields: this.fields,
			form: this.form,
		}
	}

	getSavedOptIn() {
		if (!KaliFormsObject.hasOwnProperty('newsletter')) {
			return {}
		}
		return KaliFormsObject.newsletter.doubleOptIn || 'yes';
	}

	getSavedFields() {
		if (!KaliFormsObject.hasOwnProperty('newsletter')) {
			return {}
		}
		return KaliFormsObject.newsletter.fields || {};
	}

	getSavedList() {
		if (!KaliFormsObject.hasOwnProperty('newsletter')) {
			return {}
		}

		if (this.getSavedProvider() === 'mailerlite') {
			return parseFloat(KaliFormsObject.newsletter.list) || '';
		};

		return KaliFormsObject.newsletter.list || '';
	}

	getSavedForm() {
		if (!KaliFormsObject.hasOwnProperty('newsletter')) {
			return {}
		}
		return KaliFormsObject.newsletter.form || '';
	}

	getSavedProvider() {
		if (!KaliFormsObject.hasOwnProperty('newsletter')) {
			return {}
		}
		return KaliFormsObject.newsletter.provider || '';
	}
}
