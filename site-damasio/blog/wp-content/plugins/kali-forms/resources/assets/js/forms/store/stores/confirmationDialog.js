import { observable, action, computed, makeObservable } from 'mobx';

export default class ConfirmationDialog {
    state = false;
    message = '';
    title = '';
    action = null;
    actionProps = null;
    additionalButton = null;
    hideCancelButton = false;

    constructor() {
        makeObservable(this, {
            state: observable,
            message: observable,
            title: observable,
            action: observable,
            actionProps: observable,
            additionalButton: observable,
            hideCancelButton: observable,
            setHideCancelButton: action,
            setTitle: action,
            setMessage: action,
            setState: action,
            setAdditionalButton: action,
            resetState: action,
            setAction: action,
            setActionProps: action
        });
    }

    setHideCancelButton(state) {
		this.hideCancelButton = state;
	}
    setTitle(title) {
		this.title = title;
	}
    setMessage(message) {
		this.message = message;
	}
    setState(state) {
		this.state = state;
	}
    setAdditionalButton(buttonAction) {
		this.additionalButton = buttonAction;
	}
    resetState() {
		this.title = '';
		this.message = '';
		this.state = false;
		this.additionalButton = null;
		this.action = null;
		this.actionProps = null;
		this.hideCancelButton = false;
	}
    setAction(action) {
		this.action = action
	}
    setActionProps(props) {
		this.actionProps = props
	}
}
