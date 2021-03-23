import React from 'react';
import Button from './../Misc/MinimalButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { observer } from "mobx-react";
import { store } from "./../../store/store";
import is from 'is_js';
const { __ } = wp.i18n;

const ConfirmationDialog = observer((props) => {
	const handleClose = (e) => {
		store._CONFIRMATION_DIALOG_.resetState()
	}
	const handleAccept = () => {
		if (typeof store._CONFIRMATION_DIALOG_.action === 'function') {
			store._CONFIRMATION_DIALOG_.action.call(this, store._CONFIRMATION_DIALOG_.actionProps);
		}

		store._CONFIRMATION_DIALOG_.resetState();
	}
	const handleAdditionalAction = () => {
		switch (store._CONFIRMATION_DIALOG_.additionalButton.actionType) {
			case 'redirect':
				window.open(store._CONFIRMATION_DIALOG_.additionalButton.action, '_blank');
				break;
			default:
				break;
		}
	}

	return (
		<React.Fragment>
			<Dialog
				open={store._CONFIRMATION_DIALOG_.state}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{store._CONFIRMATION_DIALOG_.title}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description" >
						{store._CONFIRMATION_DIALOG_.message}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<If condition={!store._CONFIRMATION_DIALOG_.hideCancelButton}>
						<Button onClick={handleClose} style={{ padding: '6px 16px', height: 44 }}>
							{__('Cancel', 'kaliforms')}
						</Button>
					</If>
					<If condition={!is.null(store._CONFIRMATION_DIALOG_.additionalButton)}>
						<Button onClick={handleAdditionalAction} style={{ padding: '6px 16px', height: 44 }}>
							{store._CONFIRMATION_DIALOG_.additionalButton.buttonText}
						</Button>
					</If>
					<Button onClick={handleAccept} style={{ padding: '6px 16px', height: 44 }} autoFocus>
						{__('Ok', 'kaliforms')}
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
});

export default ConfirmationDialog;
