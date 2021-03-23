import React from 'react';
import { observer } from "mobx-react";
import { store } from "./../../store/store";
import Grid from '@material-ui/core/Grid';
import FormControlLabel from './../Misc/FormControlLabel';
import PlaceholderDialogOpener from './../../components/PlaceholderDialog/PlaceholderDialogOpener'
import BootstrapInput from './../BootstrapInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from './../Misc/Checkbox';
import Button from './../Misc/MinimalButton';
import Icon from '@material-ui/core/Icon';
import ConditionalEntity from './../Misc/ConditionalEntity';
import slackActionEditorStyles from './SlackActionEditorStyles';
const { __ } = wp.i18n;
const SlackActionEditor = observer(props => {
	const [data] = React.useState(KaliFormsSlack);
	const editedAction = store._SLACK_.actions[props.actionIdx];
	const classes = slackActionEditorStyles();
	const changeFieldsCheckbox = (e, val) => {
		editedAction.fields = editedAction.fields.filter(name => store._FIELD_COMPONENTS_.fieldNames.includes(name));
		e.target.checked ? editedAction.fields.push(val) : editedAction.fields = editedAction.fields.filter(e => e !== val)
	}

	const conditionalChanged = data => {
		editedAction.conditions = data;
	}

	return (
		<React.Fragment>
			<Grid container direction="row" spacing={3}>
				<Grid item xs={12}>
					<FormControl>
						<InputLabel shrink>
							{__('Action name', 'kaliforms')}
						</InputLabel>
						<BootstrapInput
							value={editedAction.name || ''}
							onChange={e => editedAction.name = e.target.value}
							fullWidth={true}
							endAdornment={(
								<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
							)}
						/>
					</FormControl>
				</Grid>
			</Grid>
			<Grid container direction="row" spacing={3}>
				<Grid item xs={6}>
					<FormControl>
						<InputLabel shrink>
							{__('Message type (text, block)', 'kaliforms')}
						</InputLabel>
						<Select
							value={editedAction.type || 'text'}
							multiple={false}
							onChange={e => editedAction.type = e.target.value}
							input={<BootstrapInput />}
						>
							<MenuItem value={'text'}>
								{__('Text', 'kaliforms')}
							</MenuItem>
							<MenuItem value={'block'}>
								{__('Block', 'kaliforms')}
							</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={6}>
					<FormControl>
						<InputLabel shrink>
							{__('Where', 'kaliforms')}
						</InputLabel>
						<Select
							value={editedAction.where || 'text'}
							multiple={false}
							onChange={e => editedAction.where = e.target.value}
							input={<BootstrapInput />}
							className={classes.selectImg}
						>
							<MenuItem value={'empty'}>{__('-- Please select --', 'kaliforms')}</MenuItem>
							{
								data.channels.map(channel => (<MenuItem key={channel.id} value={channel.id}>#{channel.name}</MenuItem>))
							}
							{
								data.users.map(user => (<MenuItem key={user.id} value={user.id} style={{ paddingLeft: 40 }}><img style={{ width: 20, height: 20, borderRadius: 50, marginRight: 10, display: 'inlineBlock', position: 'absolute', left: 10, top: 7 }} src={user.avatar} /> {user.real_name}</MenuItem>))
							}

						</Select>
					</FormControl>
				</Grid>
			</Grid>
			<Grid container direction="row" spacing={3}>
				<Grid item xs={12}>
					<If condition={editedAction.type === 'block'}>
						<FormControl>
							<InputLabel shrink>
								{__('Select fields to send through the block message', 'kaliforms')}
							</InputLabel>
						</FormControl>
						{
							store._FIELD_COMPONENTS_.fieldComponents.map(e => {
								if (
									!['grecaptcha', 'button', 'submitButton', 'smartTextOutput', 'freeText', 'pageBreak', 'payPal', 'divider'].includes(e.id)
								) {
									return (<FormControlLabel
										key={e.internalId}
										control={
											<Checkbox
												checked={editedAction.fields.includes(e.properties.name)}
												onChange={evt => changeFieldsCheckbox(evt, e.properties.name)}
												key={e.properties.internalId}
												value={e.properties.name} />
										}
										label={e.properties.caption || e.properties.name}
									/>)
								}
							})
						}
					</If>
					<If condition={editedAction.type === 'text'}>
						<FormControl>
							<InputLabel shrink>
								{__('Message', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								value={editedAction.message || ''}
								onChange={e => editedAction.message = e.target.value}
								endAdornment={(
									<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
								)}
								fullWidth={true}
							/>
						</FormControl>
					</If>
				</Grid>
			</Grid>
			<Grid container direction="row" spacing={3}>
				<Grid item xs={12}>
					<ConditionalEntity
						label={__('Should send notification', 'kaliforms')}
						onChange={conditionalChanged}
						changer={props.actionIdx}
						conditions={editedAction.conditions} />
				</Grid>
			</Grid>
			<Grid container direction="row" spacing={3}>
				<Grid item xs={12}>
					<Button onClick={() => props.setEditingAction(false)} style={{ paddingLeft: 16, paddingRight: 16 }}>
						<Icon className={'icon-back'} style={{ fontSize: 14, marginRight: 8 }} />
						{__('Back', 'kaliforms')}
					</Button>
				</Grid>
			</Grid>
		</React.Fragment>
	)
})

export default SlackActionEditor;
