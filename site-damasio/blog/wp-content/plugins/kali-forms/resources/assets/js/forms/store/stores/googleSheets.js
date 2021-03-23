import { observable, action, computed, makeObservable } from 'mobx';

export default class GoogleSheets {
	googleSheetsData = KaliFormsObject.hasOwnProperty('googleSheetsData') ? KaliFormsObject.googleSheetsData : [];

	enabled = this.getEnabled();
	spreadsheet = this.getSpreadsheet();
	sheet = this.getSheet();
	fields = this.getSavedFields();

	constructor() {
		makeObservable(this, {
			googleSheetsData: observable,
			spreadsheet: observable,
			sheet: observable,
			fields: observable,
			enabled: observable,
			setEnabled: action,
			setGoogleSheetsData: action,
			clearGoogleSheetsData: action,
			setSelectedSpreadsheet: action,
			setSelectedSheet: action,
		});
	}
	get data() {
		return {
			enabled: this.enabled,
			spreadsheet: this.spreadsheet,
			sheet: this.sheet,
			fields: this.fields,
		}
	}

	setEnabled(state) {
		this.enabled = state;
	}

	setGoogleSheetsData(data) {
		this.googleSheetsData = data
	}

	clearGoogleSheetsData() {
		this.googleSheetsData = []
	}

	setSelectedSpreadsheet(id) {
		this.spreadsheet = id;
		if (id === 'kf-select-field') {
			this.sheet = 'kf-select-field'
		}
	}

	setSelectedSheet(id) {
		this.sheet = id;
	}

	getEnabled() {
		if (!KaliFormsObject.hasOwnProperty('googleSheetsData')) {
			return {}
		}
		return KaliFormsObject.googleSheetsData.enabled || '0';
	}

	getSavedFields() {
		if (!KaliFormsObject.hasOwnProperty('googleSheetsData')) {
			return {}
		}
		return KaliFormsObject.googleSheetsData.fields || {};
	}

	getSpreadsheet() {
		if (!KaliFormsObject.hasOwnProperty('googleSheetsData')) {
			return 'kf-select-field'
		}

		return KaliFormsObject.googleSheetsData.spreadsheet || 'kf-select-field';
	}

	getSheet() {
		if (!KaliFormsObject.hasOwnProperty('googleSheetsData')) {
			return 'kf-select-field'
		}

		return KaliFormsObject.googleSheetsData.sheet || 'kf-select-field';
	}
}
