import { observable, action, makeObservable } from 'mobx';
export default class Errors {
    errors = [];

    constructor() {
        makeObservable(this, {
            errors: observable,
            addError: action,
            removeError: action
        });
    }

    addError(error) {
		this.errors.push(error)
	}

    removeError(idx) {
		this.errors = [...this.errors].filter((error, i) => idx !== i);
	}
}
