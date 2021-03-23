import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { observer } from "mobx-react";
import React from 'react';
import { store } from "./../../store/store";
import emailBuilderSidebarStyles from './EmailBuilderSidebarStyles';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import SidebarTabs from './../../components/Misc/SidebarTabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
const { __ } = wp.i18n;
const StyledBadge = withStyles(theme => ({
	badge: {
		color: '#fff',
		right: -30,
		top: 12,
		color: '#fff',
		borderRadius: 4,
		padding: '0 8px',
		fontWeight: 'bold',
		textTransform: 'uppercase',
		background: theme.palette.primary.main
	},
}))(Badge);

const EmailBuilderSidebar = observer((props) => {
	const classes = emailBuilderSidebarStyles(props);
	const [smsInstalled] = React.useState(typeof KaliFormsObject.smsInstalled !== 'undefined');
	const toggle = (e, tab) => {
		if (!smsInstalled && tab === 'sms') {
			return redirectToPricing();
		}
		if (store._UI_.activeTabInNotificationSidebar !== tab) {
			store._UI_.setActiveTabInNotificationSidebar(tab);
		}
	}
	const displayStyles = {
		email: store._UI_.activeTabInNotificationSidebar === 'email' ? { display: 'block' } : { display: 'none' },
		sms: store._UI_.activeTabInNotificationSidebar === 'sms' ? { display: 'block' } : { display: 'none' },
	}

	const newSms = () => {
		return { name: 'Sms notification', provider: 'empty', to: '', from: '', message: '', conditions: { conditions: [{ conditionalIndex: 0, formField: '', formFieldType: '', condition: 'is', value: '' }], conditionalLogic: 'always' } }
	}
	const redirectToPricing = event => {
		window.open('https://www.kaliforms.com/pricing?utm_source=formNotifications-SmsNotifications&utm_campaign=userInterests&utm_medium=proBadge', '_blank');
	}
	return (
		<React.Fragment>
			<SidebarTabs
				value={store._UI_.activeTabInNotificationSidebar}
				indicatorColor="primary"
				textColor="primary"
				onChange={toggle}
			>
				<Tab value="email" label={__('Email', 'kaliforms')} />
				<If condition={smsInstalled}>
					<Tab value="sms" label={__('SMS', 'kaliforms')} />
				</If>
				<If condition={!smsInstalled}>
					<Tab value="sms" label={
						<React.Fragment>
							<StyledBadge badgeContent={'Pro'} color="secondary">
								{__('SMS', 'kaliforms')}
							</StyledBadge>
						</React.Fragment>
					} />
				</If>
			</SidebarTabs>
			<Box style={displayStyles.email}>
				<List className={classes.notificationList}>
					<ListItem button onClick={event => store._EMAILS_.emailWizardVisibility = true} className={classes.addEmailButtonParent}>
						<ListItemText
							primary={<React.Fragment>
								<Icon className={'icon-add-new'} /> {__('Create new email notification', 'kaliforms')}
							</React.Fragment>}
							className={classes.addEmailButton}
						/>
					</ListItem>
					{
						store._EMAILS_.emails.map((e, idx) => (
							<ListItem
								key={idx}
								button
								selected={store._UI_.activeEmailInSidebar === idx}
								onClick={event => store._UI_.setActiveEmailInSidebar(idx)}
							>
								<ListItemText className={classes.listItem} primary={'#' + (idx + 1) + ' ' + store._EMAILS_.emails[idx].emailSubject} />
							</ListItem>
						))
					}
				</List>
			</Box>
			<Box style={displayStyles.sms}>
				<List className={classes.notificationList}>
					<ListItem button onClick={event => store._SMS_.addSms(newSms())} className={classes.addEmailButtonParent}>
						<ListItemText
							primary={<React.Fragment>
								<Icon className={'icon-add-new'} /> {__('Create new SMS notification', 'kaliforms')}
							</React.Fragment>}
							className={classes.addEmailButton}
						/>
					</ListItem>
					{
						store._SMS_.notifications !== null && store._SMS_.notifications.map((e, idx) => (
							<ListItem
								key={idx}
								button
								selected={store._UI_.activeSMSInSidebar === idx}
								onClick={event => store._UI_.setActiveSMSInSidebar(idx)}
							>
								<ListItemText className={classes.listItem} primary={'#' + (idx + 1) + ' ' + store._SMS_.notifications[idx].name} />
							</ListItem>
						))
					}
				</List>
			</Box>
		</React.Fragment>
	)
})

export default EmailBuilderSidebar;
