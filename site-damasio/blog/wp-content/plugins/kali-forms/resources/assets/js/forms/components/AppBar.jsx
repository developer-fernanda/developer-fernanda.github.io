import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import { observer } from "mobx-react";
import React from 'react';
import { clear, store } from './../store/store';
import AppBarBackButton from './Misc/AppBarBackButton';
import AppBarInput from './Misc/AppBarInput';
import AppBarNotificationsButton from './Misc/AppBarNotificationsButton';
import AppBarSaveButton from './Misc/AppBarSaveButton';
import AppNavigationBar from './Misc/AppNavigationBar';
import EmbedButtons from './Misc/EmbedButtons';
import NavigationTabs from './Misc/NavigationTabs';
import ToolbarDivider from './Misc/ToolbarDivider';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
const { __ } = wp.i18n;
const styles = makeStyles(theme => {
	return {
		pullRightContainer: {
			marginLeft: 'auto',
		}
	}
})

const AppBar = props => {
	const classes = styles();
	/**
	 * Handle click
	 */
	const handleClick = (event, name) => {
		let action = name.toLowerCase();
		switch (action) {
			case 'delete':
				document.querySelector('#delete-action a').click();
				break;
			case 'save':
				document.getElementById('publish').click();
				break;
			case 'add-new':
				document.querySelector('.page-title-action').click();
				break;
			case 'back-to-wp':
				// When user clicks to close the form, we dont need to remember where he left off so lets clear the storage
				clear();
				window.location.href = KaliFormsObject.exit_url
				break;
			default:
				break;
		}
	};

	/**
	 * Tab toggler
	 * @param tab
	 */
	/**
	 * Changes the form name
	 */
	const changeFormName = (event) => {
		let val = event.target.value;
		document.querySelector('#title').value = val
		store._FORM_INFO_.formName = val;
	}

	return (
		<AppNavigationBar position="fixed" elevation={0} id="kali-appbar">
			<Toolbar variant="dense">
				<AppBarBackButton />
				<ToolbarDivider />
				<If condition={!store._UI_.templateSelecting}>
					<NavigationTabs value={store._UI_.appBar} onChange={(e, tab) => store._UI_.setAppBar(tab)}>
						<Tab value="formBuilder" label={
							<React.Fragment>
								<Icon className="icon-builder" />
								{__('Builder', 'kaliforms')}
							</React.Fragment>
						} />
						<Tab value="emailBuilder" label={
							<React.Fragment>
								<Icon className="icon-notification" />
								{__('Notifications', 'kaliforms')}
							</React.Fragment>
						} />
						<Tab value="formSettings" label={
							<React.Fragment>
								<Icon className="icon-settings" />
								{__('Settings', 'kaliforms')}
							</React.Fragment>
						} />
					</NavigationTabs>
					<AppBarInput
						onChange={e => changeFormName(e)}
						placeholder={__('Form name', 'kaliforms')}
						value={store._FORM_INFO_.formName}
						startAdornment={(<Icon style={{ color: '#fff' }} className="icon-edit" />)}
					/>
					<Box className={classes.pullRightContainer}>
						<AppBarNotificationsButton />
						<EmbedButtons />
						<AppBarSaveButton />
					</Box>
				</If>
			</Toolbar>
		</AppNavigationBar>
	)
}
export default observer(AppBar);

