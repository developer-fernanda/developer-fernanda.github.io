import { observer } from "mobx-react";
import { store } from "./../../store/store";
import Grid from '@material-ui/core/Grid';
import React, { } from 'react';
import PlaceholderDialogOpener from './../../components/PlaceholderDialog/PlaceholderDialogOpener'
import Button from '@material-ui/core/Button';
import BootstrapInput from './../BootstrapInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import smsEditorStyles from './SmsEditorStyles';
import ConditionalEntity from './../Misc/ConditionalEntity';
const { __ } = wp.i18n;
const SmsEditor = observer(() => {
	const classes = smsEditorStyles();

	/**
	 * Remove email ( happens after dialog )
	 */
	const _removeSms = () => {
		let idx = store._UI_.activeSMSInSidebar;
		store._UI_.setActiveSMSInSidebar(false);
		store._SMS_.removeSms(idx);
	}
	/**
	 * Duplicate SMS ( happens after dialog )
	 */
	const _duplicateSms = () => {
		store._SMS_.duplicateSms(store._UI_.activeSMSInSidebar);
	}
	/**
	 * Duplicates an sms
	 */
	const duplicateSms = () => {
		store._CONFIRMATION_DIALOG_.setTitle(__('Duplicate notification', 'kaliforms'));
		store._CONFIRMATION_DIALOG_.setMessage(__('Are you sure you want to duplicate this notification', 'kaliforms'));
		store._CONFIRMATION_DIALOG_.setAction(_duplicateSms)
		store._CONFIRMATION_DIALOG_.setState(true);
	}
	/**
	 * Removes an sms from the list
	 */
	const removeSms = () => {
		store._CONFIRMATION_DIALOG_.setTitle(__('Remove notification', 'kaliforms'));
		store._CONFIRMATION_DIALOG_.setMessage(__('Are you sure you want to delete this notification', 'kaliforms'));
		store._CONFIRMATION_DIALOG_.setAction(_removeSms)
		store._CONFIRMATION_DIALOG_.setState(true);
	}

	const conditionalChanged = data => {
		store._SMS_.setSmsProp(store._UI_.activeSMSInSidebar, 'conditions', data)
	}

	return (
		<React.Fragment>
			<Grid container direction="row" spacing={3}>
				<Grid item xs={8}>
					<FormControl>
						<InputLabel shrink>
							{__('Name', 'kaliforms')}
						</InputLabel>
						<BootstrapInput
							value={store._SMS_.getPropertyValue(store._UI_.activeSMSInSidebar, 'name')}
							placeholder={__('Name of your SMS notification...', 'kaliforms')}
							fullWidth={true}
							onChange={e => store._SMS_.setSmsProp(store._UI_.activeSMSInSidebar, 'name', e.target.value)} />
					</FormControl>
				</Grid>
				<Grid item xs={4}>
					<FormControl>
						<InputLabel shrink>
							{__('Provider', 'kaliforms')}
						</InputLabel>
						<Select
							multiple={false}
							input={<BootstrapInput />}
							value={store._SMS_.getPropertyValue(store._UI_.activeSMSInSidebar, 'provider') || 'empty'}
							onChange={e => store._SMS_.setSmsProp(store._UI_.activeSMSInSidebar, 'provider', e.target.value)}
							fullWidth={true}
						>
							<MenuItem value="empty">{__('-- Please select a provider --', 'kaliforms')}</MenuItem>
							<MenuItem value="twilio">Twilio</MenuItem>
							<MenuItem value="clickatell">Clickatell</MenuItem>
							<MenuItem value="smsglobal">SMSGlobal</MenuItem>
							<MenuItem value="nexmo">Nexmo</MenuItem>
							{/* <MenuItem value="clockwork">Clockwork</MenuItem> */}
						</Select>
					</FormControl>
				</Grid>
			</Grid>
			<Grid container direction="row" spacing={3}>
				<Grid item xs={6}>
					<FormControl>
						<InputLabel shrink>
							{__('To number', 'kaliforms')}
						</InputLabel>
						<BootstrapInput
							value={store._SMS_.getPropertyValue(store._UI_.activeSMSInSidebar, 'to')}
							placeholder={__('+123456789', 'kaliforms')}
							fullWidth={true}
							endAdornment={(
								<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
							)}
							onChange={e => store._SMS_.setSmsProp(store._UI_.activeSMSInSidebar, 'to', e.target.value)} />
					</FormControl>
				</Grid>
				<Grid item xs={6}>
					<FormControl>
						<InputLabel shrink>
							{__('From number or short number', 'kaliforms')}
						</InputLabel>
						<BootstrapInput
							value={store._SMS_.getPropertyValue(store._UI_.activeSMSInSidebar, 'from')}
							placeholder={__('+987654321', 'kaliforms')}
							fullWidth={true}
							endAdornment={(
								<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
							)}
							onChange={e => store._SMS_.setSmsProp(store._UI_.activeSMSInSidebar, 'from', e.target.value)} />
					</FormControl>
				</Grid>
			</Grid>
			<Grid container direction="row" spacing={3}>
				<Grid item xs={12}>
					<FormControl>
						<InputLabel shrink>
							{__('Message body', 'kaliforms')} ({store._SMS_.getPropertyValue(store._UI_.activeSMSInSidebar, 'message').length}/160)
						</InputLabel>
						<BootstrapInput
							value={store._SMS_.getPropertyValue(store._UI_.activeSMSInSidebar, 'message')}
							placeholder={__('A new form submission!', 'kaliforms')}
							fullWidth={true}
							multiline={true}
							inputProps={{
								maxLength: 160
							}}
							rows={4}
							rowsMax={4}
							endAdornment={(
								<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
							)}
							onChange={e => store._SMS_.setSmsProp(store._UI_.activeSMSInSidebar, 'message', e.target.value)} />
					</FormControl>
				</Grid>
			</Grid>
			<Grid container direction="row" spacing={3}>
				<Grid item xs={12}>
					<ConditionalEntity
						label={__('Should send sms', 'kaliforms')}
						onChange={conditionalChanged}
						changer={store._UI_.activeSMSInSidebar}
						conditions={store._SMS_.getPropertyValue(store._UI_.activeSMSInSidebar, 'conditions')} />
				</Grid>
			</Grid>
			<Box className={classes.smsFooterPlaceholder}></Box>
			<Box className={classes.smsEditorFooter}>
				<Button
					variant="text"
					onClick={() => duplicateSms()}
				>
					<Icon className="icon-copy" />
					{__('Duplicate SMS', 'kaliforms')}
				</Button>

				<Button variant="text"
					onClick={() => removeSms()}>
					<Icon className="icon-remove" />
					{__('Remove SMS', 'kaliforms')}
				</Button>
			</Box>
		</React.Fragment>
	);
})

export default SmsEditor;

