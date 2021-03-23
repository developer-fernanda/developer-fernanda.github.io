import { observer } from "mobx-react";
import React from 'react';
import EmailEditor from './../components/EmailBuilder/EmailEditor';
import { store } from "./../store/store";
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import EmailWizard from './../components/EmailWizard/EmailWizard';
import Typography from '@material-ui/core/Typography';
import StyledButton from './../components/StyledButton';
const { __ } = wp.i18n;

const emailContainerStyles = makeStyles(theme => {
	return {
		formEmailsPlaceholder: {
			position: 'relative',
			padding: theme.spacing(2), marginTop: theme.spacing(2),
			maxWidth: 745,
			marginLeft: 525,
		}
	}
});

const EmailEditorContainer = observer(props => {
	const classes = emailContainerStyles();
	return (
		<React.Fragment>
			<Choose>
				<When condition={!store._EMAILS_.emails.length}>
					<Paper className={classes.formEmailsPlaceholder}>
						<Typography variant="subtitle1">{__('You currently do not have any emails configured.', 'kaliforms')}</Typography>
						<StyledButton onClick={event => store._EMAILS_.emailWizardVisibility = true}>{__('Add your first email', 'kaliforms')}</StyledButton>
					</Paper>
				</When>
				<When condition={store._EMAILS_.emails.length && store._UI_.activeEmailInSidebar === false}>
					<Paper className={classes.formEmailsPlaceholder}>
						<Typography variant="subtitle1">{__('Please select an email from the list', 'kaliforms')}</Typography>
					</Paper>
				</When>
				<Otherwise>
					<EmailEditor />
				</Otherwise>
			</Choose>
			<EmailWizard />
		</React.Fragment>
	);
})

export default EmailEditorContainer;
