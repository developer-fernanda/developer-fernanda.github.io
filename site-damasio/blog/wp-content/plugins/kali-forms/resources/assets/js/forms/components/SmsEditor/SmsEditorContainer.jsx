import { observer } from "mobx-react";
import React from 'react';
import { store } from "./../../store/store";
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import StyledButton from './../StyledButton'
import SmsEditor from './SmsEditor';
const { __ } = wp.i18n;

const smsEmailsContainerStyles = makeStyles(theme => {
	return {
		formEmailsPlaceholder: {
			position: 'relative',
			padding: theme.spacing(2), marginTop: theme.spacing(2),
			maxWidth: 745,
			marginLeft: 525,
		}
	}
});

const SmsEditorContainer = observer(props => {
	const classes = smsEmailsContainerStyles();
	const newSms = () => {
		return { name: __('Sms notification', 'kaliforms'), provider: 'empty', to: '', from: '', message: '', conditions: { conditions: [{ conditionalIndex: 0, formField: '', formFieldType: '', condition: 'is', value: '' }], conditionalLogic: 'always' } }
	}
	return (
		<React.Fragment>
			<Choose>
				<When condition={!store._SMS_.notifications.length}>
					<Paper className={classes.formEmailsPlaceholder}>
						<Typography variant="subtitle1">{__('You currently do not have any SMS configured.', 'kaliforms')}</Typography>
						<StyledButton onClick={event => store._SMS_.addSms(newSms())}>{__('Add your first SMS!', 'kaliforms')}</StyledButton>
					</Paper>
				</When>
				<When condition={store._SMS_.notifications.length && store._UI_.activeSMSInSidebar === false}>
					<Paper className={classes.formEmailsPlaceholder}>
						<Typography variant="subtitle1">{__('Please select a SMS from the list', 'kaliforms')}</Typography>
					</Paper>
				</When>
				<Otherwise>
					<Paper className={classes.formEmailsPlaceholder}>
						<SmsEditor />
					</Paper>
				</Otherwise>
			</Choose>
		</React.Fragment>
	);
})

export default SmsEditorContainer;

