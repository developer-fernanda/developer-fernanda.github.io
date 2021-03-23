import React from 'react'
import BootstrapInput from './../BootstrapInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import { observer } from "mobx-react";
import { store } from "./../../store/store";
import FieldComponentSelect from './../HubSpotIntegration/FieldComponentSelect';
import webHookEntityCreatorStyles from './WebHookEntityCreatorStyles';
const { __ } = wp.i18n;
const WebHookEntityCreator = observer(props => {
	const classes = webHookEntityCreatorStyles();
	let localState = store._WEBHOOKS_.hooks[store._WEBHOOKS_.currentEditedHook][props.entity.id];

	const addEntity = () => {
		localState.push({ key: '', value: '' });
	}

	const removeEntity = idx => {
		localState = localState.filter((el, index) => index !== idx)
		props.onChange(localState);
	}

	const fieldChanged = data => {
		updateLocalState(data.field, 'value', data.value)
	}

	const updateLocalState = (idx, property, value) => {
		if (typeof localState[idx] === 'undefined') {
			return;
		}

		if (!localState[idx].hasOwnProperty(property)) {
			return;
		}

		localState[idx][property] = value;
	}

	return (
		<React.Fragment>
			{localState.map((entity, idx) =>
				<Grid container direction="row" spacing={3} key={idx}>
					<Grid item xs={5}>
						<FormControl>
							<If condition={idx === 0}>
								<InputLabel shrink>
									{props.entity.label} - {__('Key', 'kaliforms')}
								</InputLabel>
							</If>
							<BootstrapInput
								value={entity.key}
								onChange={e => updateLocalState(idx, 'key', e.target.value)}
								fullWidth={true}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<If condition={!props.map}>
							<FormControl>
								<If condition={idx === 0}>
									<InputLabel shrink>
										{__('Value', 'kaliforms')}
									</InputLabel>
								</If>
								<BootstrapInput
									value={entity.value}
									onChange={e => updateLocalState(idx, 'value', e.target.value)}
									fullWidth={true}
								/>
							</FormControl>
						</If>
						<If condition={props.map}>
							<FormControl>
								<FieldComponentSelect
									label={idx === 0 ? __('Field', 'kaliforms') : ''}
									selectedValue={entity.value}
									field={idx}
									onChange={fieldChanged}
								/>
							</FormControl>
						</If>
					</Grid>
					<Grid item xs={1}>
						<If condition={idx === 0}>
							<Icon className={'icon-add-new ' + classes.addOrRemoveIcon} onClick={addEntity} />
						</If>
						<If condition={idx > 0}>
							<Icon className={'icon-remove ' + classes.addOrRemoveIcon + ' ' + classes.removeIcon} onClick={e => removeEntity(idx)} />
						</If>
					</Grid>
				</Grid>
			)}
		</React.Fragment>
	)
})

export default WebHookEntityCreator;
