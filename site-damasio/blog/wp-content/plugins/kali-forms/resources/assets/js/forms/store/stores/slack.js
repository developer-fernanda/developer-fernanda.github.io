import { observable, action, computed, makeObservable } from 'mobx';

export default class Slack {
    actions = KaliFormsObject.hasOwnProperty('slack') ? KaliFormsObject.slack : [];

    constructor() {
        makeObservable(this, {
            actions: observable,
            addAction: action,
            removeAction: action,
            duplicateAction: action
        });
    }

    addAction(item) {
		this.actions.push(item)
	}

    removeAction(action) {
		this.actions = [...this.actions].filter(field => JSON.stringify(field) !== JSON.stringify(action));
	}

    duplicateAction(action) {
		this.actions.map((e, idx) => {
			if (JSON.stringify(e) === JSON.stringify(action)) {
				let newAction = { ...e }
				newAction.name += ' (duplicate)';
				this.addAction(newAction)
			}
		})
	}
}
