import Grid from '@material-ui/core/Grid';
import React from 'react';
import Box from '@material-ui/core/Box';
import BootstrapInput from './../BootstrapInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import WebHookEditor from './WebHookEditor';
import WebHookList from './WebHookList';
import webHookStyles from './WebHookStyles';
import { observer } from "mobx-react";
import { store } from "./../../store/store";
const { __ } = wp.i18n;
const WebHooks = observer(props => {
	const classes = webHookStyles(props);
	const [editingHook, setEditingHook] = React.useState(false);
	const [newHookName, setNewHookName] = React.useState('');

	const addWebHook = () => {
		let newHook = {
			name: newHookName !== '' ? newHookName : __('Webhook #') + (store._WEBHOOKS_.hooks.length + 1),
			url: '',
			event: 'afterFormProcess',
			body: [
				{ key: '', value: '' }
			],
			headers: [
				{ key: '', value: '' }
			],
			authentication: '',
			method: 'POST',
			format: 'json',
			conditions: {
				conditions: [{ conditionalIndex: 0, formField: '', formFieldType: '', condition: 'is', value: '' }],
				conditionalLogic: 'always'
			}
		}

		store._WEBHOOKS_.addHook(newHook);
		store._WEBHOOKS_.setEditedHook(store._WEBHOOKS_.hooks.length - 1);
		setEditingHook(true)
		setNewHookName('');
	}

	return (
		<React.Fragment>
			<If condition={!editingHook}>
				<Grid container direction="row">
					<Grid item xs={12}>
						<FormControl>
							<InputLabel shrink>
								{__('Add a name for your Webhook', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								value={newHookName}
								onChange={e => setNewHookName(e.target.value)}
								fullWidth={true}
								endAdornment={(
									<Box className={classes.createButton}
										onClick={() => addWebHook()}>
										{__('Create', 'kaliforms')}
									</Box>
								)}
							/>
						</FormControl>
					</Grid>
				</Grid>
				<If condition={store._WEBHOOKS_.hooks.length}>
					<WebHookList hooks={store._WEBHOOKS_.hooks} setEditingHook={setEditingHook} />
				</If>
			</If>

			<If condition={editingHook && store._WEBHOOKS_.currentEditedHook !== false}>
				<WebHookEditor setEditingHook={setEditingHook} />
			</If>
		</React.Fragment>
	);
});
export default WebHooks;
