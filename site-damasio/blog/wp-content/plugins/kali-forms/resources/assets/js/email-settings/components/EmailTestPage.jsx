import React from 'react';
import BootstrapInput from './Misc/BootstrapInput'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import Qs from 'qs';
import Button from '@material-ui/core/Button';
const { __ } = wp.i18n;
const EmailTestPage = props => {
	const [sendTo, setSendTo] = React.useState(KaliFormsEmailSettingsObject.settings.admin_email);
	const [sendFrom, setSendFrom] = React.useState(KaliFormsEmailSettingsObject.settings.from_email);
	const [loading, setLoading] = React.useState(false);
	const [emailSent, setEmailSent] = React.useState(false);
	const sendEmail = () => {
		const data = {
			action: 'kaliforms_test_email',
			args: {
				nonce: KaliFormsEmailSettingsObject.ajax_nonce,
				from: sendFrom,
				to: sendTo,
			}
		}
		setLoading(true)

		axios.post(KaliFormsEmailSettingsObject.ajaxurl, Qs.stringify(data))
			.then(r => {
				if (r.data.success) {
					setLoading(false)
					setEmailSent(true)

					setTimeout(() => setEmailSent(false), 5000)
				}
			})
			.catch(e => {
				console.log(e);
			});
	}
	return (
		<React.Fragment>
			<Typography variant={'h6'}>
				{__('Send a test email', 'kaliforms')}
			</Typography>
			<hr />
			<Grid container direction="row">
				<Grid item xs={9}>
					<Grid container direction="row" style={{ marginBottom: 16 }}>
						<Grid item xs={3}>
							<Typography variant="body1">
								<label htmlFor={'sendFromField'}>{__('Send from', 'kaliforms')}</label>
							</Typography>
						</Grid>
						<Grid item xs={9}>
							<BootstrapInput
								id={'sendFromField'}
								value={sendFrom}
								onChange={evt => setSendFrom(evt.target.value)}
							/>
						</Grid>
					</Grid>
					<Grid container direction="row">
						<Grid item xs={3}>
							<Typography variant="body1">
								<label htmlFor={'sendToField'}>{__('Send to', 'kaliforms')}</label>
							</Typography>
						</Grid>
						<Grid item xs={9}>
							<BootstrapInput
								id={'sendToField'}
								value={sendTo}
								onChange={evt => setSendTo(evt.target.value)}
							/>

							<Typography style={{ maxWidth: 400, marginBottom: 16 }} variant="body2">
								{__('Use an email address that you can access to see if the emails are delivered.', 'kaliforms')}
							</Typography>
						</Grid>
					</Grid>
					<Grid container direction="row">
						<Grid item xs={12}>
							<Button onClick={e => sendEmail()} variant="contained" color="primary" disabled={loading}>
								<If condition={emailSent}>{__('√ Email sent', 'kaliforms')}</If>
								<If condition={!emailSent}>{__('Send', 'kaliforms')}</If>
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}
export default EmailTestPage;
