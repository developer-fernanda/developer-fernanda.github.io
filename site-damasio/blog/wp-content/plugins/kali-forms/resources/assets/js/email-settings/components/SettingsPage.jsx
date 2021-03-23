import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MailerSelect from './Forms/MailerSelect';
import CustomSMTP from './Forms/CustomSMTP';
import Mailgun from './Forms/Mailgun';
import SMTPCom from './Forms/SMTPCom';
import Sendinblue from './Forms/Sendinblue';
import Postmark from './Forms/Postmark';
import Checkbox from './Misc/Checkbox';
import BootstrapInput from './Misc/BootstrapInput'
import Button from '@material-ui/core/Button';
// import PortStatus from './Misc/PortStatus';
const { __ } = wp.i18n;
const SettingsPage = props => {
	const [provider, setProvider] = React.useState(props.settings.smtp_provider)
	const [emailLog, setEmailLog] = React.useState(
		props.settings.email_log === '1' ? true : false
	)
	const [returnPath, setReturnPath] = React.useState(props.settings.return_path || '')
	/**
	 * On initial load - move the setting fields here
	 */
	React.useEffect(() => {
		let settingsField = document.getElementById('kali-settings-fields');
		document.getElementById('kali-email-form').appendChild(settingsField)

		return () => {
			document.getElementById('wpwrap').appendChild(settingsField)
		}
	}, [])

	return (
		<React.Fragment>
			<Typography variant={'h6'}>
				{__('General Settings', 'kaliforms')}
			</Typography>
			<hr />
			<form method="POST" action="options.php" id="kali-email-form" autoComplete="off">
				<Grid container direction="row" style={{ marginBottom: 16 }}>
					<Grid item xs={9}>
						<Grid container direction="row" style={{ marginBottom: 16 }}>
							<Grid item xs={3}>
								<Typography variant="body1">
									{__('Send emails using', 'kaliforms')}
								</Typography>
							</Grid>
							<Grid item xs={9}>
								<MailerSelect providers={props.providers} selected={provider} setProvider={setProvider} />
								<input type="hidden" value={provider} name="kaliforms_smtp_provider" />
								<Typography style={{ maxWidth: 400, marginBottom: 16, color: 'rgba(0, 0, 0, 0.54)' }} variant="body2">
									{__('Select the method or service for sending out your form emails.', 'kaliforms')}
								</Typography>
							</Grid>
						</Grid>
						<Grid container direction="row">
							<Grid item xs={3}>
								<Typography variant="body1">
									<label htmlFor={'kali-email-log'}>{__('Enable mail log', 'kaliforms')}</label>
								</Typography>
							</Grid>
							<Grid item xs={9}>
								<Checkbox
									name={'kaliforms_email_log'}
									value="on"
									checked={emailLog}
									id={'kali-email-log'}
									onChange={evt => setEmailLog(evt.target.checked)} />
								<Typography style={{ maxWidth: 400, marginBottom: 16, color: 'rgba(0, 0, 0, 0.54)' }} variant="body2">
									{__('Record each attempt to send out an email notification, this will help you resolve any potential errors with the email sending functionality or provide a confirmation that an email has been sent.', 'kaliforms')}
								</Typography>
							</Grid>
						</Grid>
						<Grid container direction="row">
							<Grid item xs={3}>
								<Typography variant="body1">
									<label htmlFor={'kali-email-return-path'}>{__('Failure email', 'kaliforms')}</label>
								</Typography>
							</Grid>
							<Grid item xs={9}>
								<BootstrapInput
									id={'kali-email-return-path'}
									name={'kaliforms_return_path'}
									type={'email'}
									value={returnPath}
									onChange={evt => setReturnPath(evt.target.value)}
									autoComplete={'off'}
								/>
								<Typography style={{ maxWidth: 400, marginBottom: 16, color: 'rgba(0, 0, 0, 0.54)' }} variant="body2">
									{__('When an email fails to be delivered, a notification will be received at this email in the form of a non-delivery receipt or bounce message. If you do not set an email in this field then bounce emails may be lost.', 'kaliforms')}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					{/* <Grid item xs={3}>
						<PortStatus {...props} />
					</Grid> */}
				</Grid>
				<If condition={provider === 'smtp'}>
					<CustomSMTP {...props} />
				</If>
				<If condition={provider === 'smtpcom'}>
					<SMTPCom {...props} />
				</If>
				<If condition={provider === 'sendinblue'}>
					<Sendinblue	 {...props} />
				</If>
				<If condition={provider === 'mailgun'}>
					<Mailgun {...props} />
				</If>
				<If condition={provider === 'postmark'}>
					<Postmark {...props} />
				</If>
				<Grid container direction="row">
					<Button type="submit" variant="contained" color="primary" >{__('Save', 'kaliforms')}</Button>
				</Grid>
			</form>
		</React.Fragment>
	);
}
export default SettingsPage;
