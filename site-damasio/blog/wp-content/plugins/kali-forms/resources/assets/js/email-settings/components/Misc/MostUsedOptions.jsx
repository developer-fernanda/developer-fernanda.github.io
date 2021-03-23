import React from 'react';
import Typography from '@material-ui/core/Typography';
import BootstrapInput from './BootstrapInput'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
const { __ } = wp.i18n;
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => {
	return {
		cardContentItem: {
			display: 'flex',
			flexDirection: 'row',
			'& span:first-of-type': {
				width: 75,
				fontWeight: 'bold'
			}
		}
	}
});


const MostUsedOptions = props => {
	const classes = useStyles();
	const [optionSet, setOptionSet] = React.useState('gmail');
	const predefinedSettings = {
		mailgun: {
			host: 'smtp.mailgun.org',
			port: 587,
			ssl: 'STARTTLS',
		},
		mandrill: {
			host: 'smtp.mandrillapp.com',
			port: 587,
			ssl: 'TLS',
		},
		sendgrid: {
			host: 'smtp.sendgrid.net',
			port: 587,
			ssl: 'TLS',
		},
		gmail: {
			host: 'smtp.gmail.com',
			port: 587,
			ssl: 'TLS',
		},
		outlook: {
			host: 'smtp.office365.com',
			port: 587,
			ssl: 'STARTTLS',
		}
	}

	const useSettings = () => {
		let currentFormValues = props.formValues;
		currentFormValues.host = predefinedSettings[optionSet].host
		currentFormValues.port = predefinedSettings[optionSet].port
		currentFormValues.secure = predefinedSettings[optionSet].ssl
		currentFormValues.auth = true;

		props.setFormValues({ ...currentFormValues });
	}
	return (
		<React.Fragment>
			<Typography variant={'subtitle2'}>
				{__('Most used options', 'kaliforms')}

				<Select
					value={'none'}
					multiple={false}
					value={optionSet}
					onChange={e => setOptionSet(e.target.value)}
					input={<BootstrapInput />}
					style={{ maxWidth: 245 }}
				>
					<MenuItem value="none">{__('-- Select an option --', 'kaliforms')}</MenuItem>
					<MenuItem value="gmail">Google</MenuItem>
					<MenuItem value="mandrill">Mandrill</MenuItem>
					<MenuItem value="mailgun">Mailgun</MenuItem>
					<MenuItem value="sendgrid">Sendgrid</MenuItem>
					<MenuItem value="outlook">Outlook</MenuItem>
				</Select>
			</Typography>
			<If condition={optionSet !== 'none'}>
				<Card variant="outlined">
					<CardContent>
						<Typography variant="body2" component="p" className={classes.cardContentItem}>
							<span>{__('Host:', 'kaliforms')}</span> <span>{predefinedSettings[optionSet].host}</span>
						</Typography>
						<Typography variant="body2" component="p" className={classes.cardContentItem}>
							<span>{__('Port:', 'kaliforms')}</span> <span>{predefinedSettings[optionSet].port}</span>
						</Typography>
						<Typography variant="body2" component="p" className={classes.cardContentItem}>
							<span>{__('Secure:', 'kaliforms')}</span> <span>{predefinedSettings[optionSet].ssl}</span>
						</Typography>
					</CardContent>
					<CardActions>
						<Button size="small" variant="outlined" color="primary" onClick={e => useSettings()}>{__('Use', 'kaliforms')}</Button>
					</CardActions>
				</Card>
			</If>
		</React.Fragment>
	)
}

export default MostUsedOptions;
