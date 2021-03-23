import { observable, action, makeObservable } from 'mobx';

export default class Webhooks {
	/**
	 * Hooks array
	 */
	hooks = KaliFormsObject.hasOwnProperty('webhooks') ? KaliFormsObject.webhooks : [];
	/**
	 * Current edited hook
	 */
	currentEditedHook = false;
	/**
	 * Class constructor
	 */
	constructor() {
		makeObservable(this, {
			hooks: observable,
			currentEditedHook: observable,
			addHook: action,
			removeHook: action,
			duplicateHook: action,
			editHook: action,
			setEditedHook: action,
		});
	}

	/**
	 * Current editing hook
	 * @param {*} idx
	 */
	setEditedHook(idx) {
		this.currentEditedHook = idx;
	}

	/**
	 * Edit a hook
	 */
	editHook(index, property, value) {
		if (
			typeof this.hooks[index] !== 'undefined' &&
			typeof this.hooks[index].hasOwnProperty(property)
		) {
			this.hooks[index][property] = value;
		}
	}
	/**
	 * Add hook
	 * @param {} item
	 */
	addHook(item) {
		this.hooks.push(item)
	}

	/**
	 * Remove hook
	 * @param {} index
	 */
	removeHook(index) {
		this.hooks = [...this.hooks].filter((field, idx) => idx !== index);
	}

	/**
	 * DUplicate hook function
	 * @param {} index
	 */
	duplicateHook(index) {
		this.hooks.map((e, idx) => {
			if (idx === index) {
				let newHook = { ...e }
				newHook.name += ' (duplicate)';
				this.addHook(newHook)
			}
		})
	}
}
