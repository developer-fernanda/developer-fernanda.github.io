import { observable, action, computed, makeObservable } from 'mobx';
import { computedFn } from "mobx-utils"
export default class GlobalNotifications {
    notifications = KaliFormsObject.globalNotifications;

    constructor() {
        makeObservable(this, {
            notifications: observable,
            pushNotification: action,
            removeNotification: action,
            count: computed,
            notificationsExist: computed
        });
    }

    pushNotification(notification) {
		this.notifications.push(notification);
	}
    removeNotification(id) {
		this.notifications = this.notifications.filter(e => e.id !== id);
	}
    get count() {
		return this.notifications.length;
	}
    get notificationsExist() {
		return this.notifications.length > 0;
	}
    getNotification = computedFn(function getNotification(id) {
		return this.notifications.find(e => e.id === id);
	})
}
