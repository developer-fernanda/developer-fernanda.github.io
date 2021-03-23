import { observable, action, computed, makeObservable } from 'mobx';
import { computedFn } from "mobx-utils"
export default class SMS {
    notifications = KaliFormsObject.hasOwnProperty('sms')
		? KaliFormsObject.sms === null
			? []
			: KaliFormsObject.sms
		: [];

    constructor() {
        makeObservable(this, {
            notifications: observable,
            addSms: action,
            removeSms: action,
            duplicateSms: action,
            setSmsProp: action
        });
    }

    addSms(item) {
		this.notifications.push(item);
	}

    removeSms(idx) {
		this.notifications = [...this.notifications].filter((notification, i) => idx !== i);
	}

    duplicateSms(idx) {
		let dupe = { ...this.notifications[idx] }
		this.addSms(dupe);
	}

    setSmsProp(idx, key, value) {
		this.notifications[idx][key] = value;
		this.notifications = [...this.notifications]
	}

    getPropertyValue = computedFn(function getPropertyValue(idx, propertyId) {
		if (!this.notifications.length || typeof this.notifications[idx] === 'undefined' || typeof this.notifications[idx][propertyId] === 'undefiend') {
			return null
		}

		return this.notifications[idx][propertyId];
	})
}
