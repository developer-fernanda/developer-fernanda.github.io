import React from 'react';
import Grid from '@material-ui/core/Grid';
import BootstrapInput from './../BootstrapInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from './../Misc/MinimalButton';
import Icon from '@material-ui/core/Icon';
import WebHookEntityCreator from './WebHookEntityCreator';
import ConditionalEntity from './../Misc/ConditionalEntity';
import { observer } from "mobx-react";
import { store } from "./../../store/store";
const { __ } = wp.i18n;
const WebHookEditor = observer(props => {
	let currentHook = store._WEBHOOKS_.hooks[store._WEBHOOKS_.currentEditedHook];

	return (
		<React.Fragment>
			<Grid container direction="row" spacing={3}>
				<Grid item xs={12}>
					<FormControl>
						<InputLabel shrink>
							{__('Webhook name', 'kaliforms')}
						</InputLabel>
						<BootstrapInput
							value={currentHook.name || ''}
							onChange={e => store._WEBHOOKS_.editHook(store._WEBHOOKS_.currentEditedHook, 'name', e.target.value)}
							fullWidth={true}
						/>
					</FormControl>
				</Grid>
			</Grid>
			<Grid container direction="row" spacing={3}>
				<Grid item xs={5}>
					<FormControl>
						<InputLabel shrink>
							{__('Payload URL', 'kaliforms')}
						</InputLabel>
						<BootstrapInput
							value={currentHook.url || ''}
							onChange={e => store._WEBHOOKS_.editHook(store._WEBHOOKS_.currentEditedHook, 'url', e.target.value)}
							fullWidth={true}
						/>
					</FormControl>
				</Grid>
				<Grid item xs={2}>
					<FormControl>
						<InputLabel shrink>
							{__('Method', 'kaliforms')}
						</InputLabel>
						<Select
							value={currentHook.method || 'POST'}
							multiple={false}
							onChange={e => store._WEBHOOKS_.editHook(store._WEBHOOKS_.currentEditedHook, 'method', e.target.value)}
							input={<BootstrapInput />}
						>
							<MenuItem value={'GET'}>
								{__('GET', 'kaliforms')}
							</MenuItem>
							<MenuItem value={'POST'}>
								{__('POST', 'kaliforms')}
							</MenuItem>
							<MenuItem value={'PUT'}>
								{__('PUT', 'kaliforms')}
							</MenuItem>
							<MenuItem value={'PATCH'}>
								{__('PATCH', 'kaliforms')}
							</MenuItem>
							<MenuItem value={'DELETE'}>
								{__('DELETE', 'kaliforms')}
							</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={2}>
					<FormControl>
						<InputLabel shrink>
							{__('Format', 'kaliforms')}
						</InputLabel>
						<Select
							value={currentHook.format || 'json'}
							multiple={false}
							onChange={e => store._WEBHOOKS_.editHook(store._WEBHOOKS_.currentEditedHook, 'format', e.target.value)}
							input={<BootstrapInput />}
						>
							<MenuItem value={'json'}>
								{__('JSON', 'kaliforms')}
							</MenuItem>
							<MenuItem value={'form'}>
								{__('FORM', 'kaliforms')}
							</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={3}>
					<FormControl>
						<InputLabel shrink>
							{__('Trigger event', 'kaliforms')}
						</InputLabel>
						<Select
							value={currentHook.event || 'afterFormProcess'}
							multiple={false}
							onChange={e => store._WEBHOOKS_.editHook(store._WEBHOOKS_.currentEditedHook, 'event', e.target.value)}
							input={<BootstrapInput />}
						>
							<MenuItem value={'beforeFormProcess'}>
								{__('Before form process', 'kaliforms')}
							</MenuItem>
							<MenuItem value={'afterFormProcess'}>
								{__('After form process', 'kaliforms')}
							</MenuItem>
						</Select>
					</FormControl>
				</Grid>
			</Grid>
			<Grid container direction="row" spacing={3}>
				<Grid item xs={12}>
					<FormControl>
						<InputLabel shrink>
							{__('Authentication secret', 'kaliforms')}
						</InputLabel>
						<BootstrapInput
							value={currentHook.authentication || ''}
							onChange={e => store._WEBHOOKS_.editHook(store._WEBHOOKS_.currentEditedHook, 'authentication', e.target.value)}
							fullWidth={true}
						/>
					</FormControl>
				</Grid>
			</Grid>
			<Grid container direction="row" spacing={3}>
				<Grid item xs={6}>
					<WebHookEntityCreator onChange={
						data => store._WEBHOOKS_.editHook(store._WEBHOOKS_.currentEditedHook, 'body', data)
					}
						entity={{ label: __('Request Body', 'kaliforms'), id: 'body' }} map={true} />
				</Grid>
				<Grid item xs={6}>
					<WebHookEntityCreator onChange={
						data => store._WEBHOOKS_.editHook(store._WEBHOOKS_.currentEditedHook, 'headers', data)
					}
						entity={{ label: __('Request Headers', 'kaliforms'), id: 'headers' }} />
				</Grid>
			</Grid>
			<Grid container direction="row" spacing={3}>
				<Grid item xs={12}>
					<ConditionalEntity
						label={__('Should send webhook', 'kaliforms')}
						onChange={data => store._WEBHOOKS_.editHook(store._WEBHOOKS_.currentEditedHook, 'conditions', data)}
						changer={store._WEBHOOKS_.currentEditedHook}
						conditions={currentHook.conditions || []}
					/>
				</Grid>
			</Grid>
			<Grid container direction="row" spacing={3}>
				<Grid item xs={12}>
					<Button onClick={() => {
						props.setEditingHook(false)
						store._WEBHOOKS_.setEditedHook(false)
					}} style={{ paddingLeft: 16, paddingRight: 16 }}>
						<Icon className={'icon-back'} style={{ fontSize: 14, marginRight: 8 }} />
						{__('Back', 'kaliforms')}
					</Button>
				</Grid>
			</Grid>
		</React.Fragment>
	)
})

export default WebHookEditor;
