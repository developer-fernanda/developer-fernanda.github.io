import MomentUtils from '@date-io/moment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { observer } from "mobx-react";
import moment from 'moment';
import React from 'react';
import AddableImage from '../AddableImage/AddableImage';
import AddableList from '../AddableList/AddableList';
import AddableProduct from '../AddableProduct/AddableProduct';
import { store } from "./../../store/store";
import BootstrapInput from './../BootstrapInput';
import BootstrapTimePicker from './../BootstrapTimePicker';
import BootstrapDatePicker from './../BootstrapDatePicker';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from './../Misc/Checkbox';
import sidebarFieldTypeStyles from './SidebarFieldTypeStyles';
import ExtensionPicker from './../Misc/ExtensionPicker';
import MediaManager from './../Misc/MediaManager';
import ButtonStyles from '../Misc/ButtonStyles';
const { __ } = wp.i18n;
moment.defaultFormat = 'DD-MM-YYYY'
/**
 * Renders a field in the template
 * @param key
 */
const SidebarFieldType = observer((props) => {
	const classes = sidebarFieldTypeStyles();

	const translateCalendarValue = (value) => {
		return value !== '' ? moment(value, 'DD-MM-YYYY').toDate() : null
	}

	const translateTimePickerValue = value => {
		return value !== '' ? moment(value, 'HH:mm').toDate() : null
	}

	switch (props.field.type) {
		case 'extensionPicker':
			return (
				<ExtensionPicker {...props} />
			);
		case 'buttonStyles':
			return (
				<FormControl>
					<InputLabel shrink>
						{props.field.label}
					</InputLabel>
					<ButtonStyles {...props} />
				</FormControl>
			)
		case 'mediaManager':
			return (
				<FormControl>
					<InputLabel shrink>
						{props.field.label}
					</InputLabel>
					<MediaManager
						title={__('Select image', 'kaliforms')}
						buttonLabel={__('Use selected image', 'kaliforms')}
						mediaValue={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id)}
						onChange={val => store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, val)}
					/>
				</FormControl>
			)
			return;
		case 'textbox':
			return (
				<FormControl>
					<InputLabel shrink>
						{props.field.label}
					</InputLabel>
					<BootstrapInput
						value={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id)}
						onChange={e => store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, e.target.value)}
						fullWidth={true}
						error={props.field.error}
						placeholder={props.field.label}
					/>
				</FormControl>
			);
		case 'url':
			return (
				<FormControl>
					<InputLabel shrink>
						{props.field.label}
					</InputLabel>
					<BootstrapInput
						value={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id)}
						onChange={e => store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, e.target.value)}
						type="url"
						fullWidth={true}
						error={props.field.error}
						placeholder={props.field.label}
					/>
				</FormControl>
			);
		case 'color':
			return (
				<FormControl className={classes.colorInput}>
					<InputLabel shrink>
						{props.field.label}
					</InputLabel>
					<BootstrapInput
						value={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id)}
						onChange={e => store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, e.target.value)}
						fullWidth={true}
						error={props.field.error}
						placeholder={props.field.label}
						type="color"
					/>
				</FormControl>
			);
		case 'textarea':
			return (
				<FormControl>
					<InputLabel shrink>
						{props.field.label}
					</InputLabel>
					<BootstrapInput
						value={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id)}
						onChange={e => store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, e.target.value)}
						fullWidth={true}
						error={props.field.error}
						placeholder={props.field.label}
						multiline={true}
						rows={2}
					/>
				</FormControl>
			);
		case 'fieldDependancyByType':
			let options = store._FIELD_COMPONENTS_.getFieldsByType(props.field.choice_source);
			let currentField = store._FIELD_COMPONENTS_.getActiveFieldComponent(store._UI_.activeFormFieldInSidebar);
			return (
				<FormControl>
					<InputLabel shrink>
						{props.field.label}
					</InputLabel>
					<Select
						multiple={false}
						value={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id)}
						onChange={e => store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, e.target.value)}
						input={<BootstrapInput />}
					>
						<MenuItem value={'kf-select-field'}>
							{__('Select a field', 'kaliforms')}
						</MenuItem>
						{
							options.map((el, index) => {
								return el.internalId !== currentField.internalId &&
									<MenuItem key={index + el.internalId} value={el.internalId}>
										{el.name}
									</MenuItem>
							})
						}
					</Select>
				</FormControl>
			);
			break;
		case 'fieldDependancy':
			return (
				<FormControl>
					<InputLabel shrink>
						{props.field.label}
					</InputLabel>
					<Select
						multiple={false}
						value={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id)}
						onChange={e => store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, e.target.value)}
						input={<BootstrapInput />}
					>
						<MenuItem value={'kf-select-field'}>
							{__('Select a field', 'kaliforms')}
						</MenuItem>
						{
							Object.keys(store._FIELD_COMPONENTS_.fieldConditioners).map((key, index) => {
								// A field cant condition itself
								return (
									<MenuItem key={index + key} value={key}>
										{store._FIELD_COMPONENTS_.fieldConditioners[key].caption}
									</MenuItem>
								)
							})
						}
					</Select>
				</FormControl>
			);
		case 'select':
			return (
				<FormControl>
					<InputLabel shrink>
						{props.field.label}
					</InputLabel>
					<Select
						multiple={false}
						value={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id)}
						onChange={e => store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, e.target.value)}
						input={<BootstrapInput />}
					>
						<Choose>
							<When condition={props.field.choices.hasOwnProperty('length')}>
								{props.field.choices.map((e, indx) => (
									<Choose>
										<When condition={e.hasOwnProperty('value') && e.hasOwnProperty('label')}>
											<MenuItem key={e.value + indx} value={e.value}>
												{e.label}
											</MenuItem>
										</When>
										<Otherwise>
											<MenuItem key={e + indx} value={e}>
												{e}
											</MenuItem>
										</Otherwise>
									</Choose>
								))}
							</When>
							<Otherwise>
								{
									Object.keys(props.field.choices).map((e, index) =>
									(
										<MenuItem key={e + index} value={e}>
											{props.field.choices[e]}
										</MenuItem>
									)
									)
								}
							</Otherwise>
						</Choose>
					</Select>
				</FormControl>
			);
		case 'number':
			return (
				<FormControl>
					<InputLabel shrink>
						{props.field.label}
					</InputLabel>
					<BootstrapInput
						value={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id)}
						onChange={e => store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, e.target.value)}
						fullWidth={true}
						type="number"
						error={props.field.error}
						placeholder={props.field.label}
					/>
				</FormControl>
			);
		case 'toggle':
			return (
				<FormGroup row>
					<FormControlLabel
						control={
							<Checkbox
								value={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id) || false}
								onChange={e => store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, e.target.checked)}
								checked={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id) || false}
							/>
						}
						label={props.field.label}
					/>
				</FormGroup>
			);
		case 'addableImage':
			return (
				<div>
					<FormLabel>{props.field.label}</FormLabel>
					<AddableImage
						key={store._UI_.activeFormFieldInSidebar}
						default={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, 'default')}
						onChange={val => store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, [...val])}
						choices={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id)}
					/>
				</div>
			);
		case 'addableList':
			return (
				<div>
					<FormLabel>{props.field.label}</FormLabel>
					<AddableList
						key={store._UI_.activeFormFieldInSidebar}
						selectableType={props.field.selectableType || 'single'}
						onChange={e => store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, [...e])}
						choices={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id)}
					/>
				</div>
			);
		case 'addableProduct':
			return (
				<div>
					<FormLabel>{props.field.label}</FormLabel>
					<AddableProduct
						key={store._UI_.activeFormFieldInSidebar}
						default={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, 'default')}
						onChange={e => store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, [...e])}
						products={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id)}
					/>
				</div>
			);
			break;
		case 'timePicker':
			return (
				<div>
					<MuiPickersUtilsProvider utils={MomentUtils}>
						<InputLabel shrink>
							{props.field.label}
						</InputLabel>
						<BootstrapTimePicker
							value={translateTimePickerValue(store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id))}
							fullWidth={true}
							clearable={true}
							showTodayButton={true}
							className={classes.timePicker}
							onChange={e => store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, e.format('HH:mm'))}
						/>
					</MuiPickersUtilsProvider>
				</div>
			);
		case 'calendar':
			return (
				<div>
					<MuiPickersUtilsProvider utils={MomentUtils}>
						<InputLabel shrink className={classes.datePickerLabel}>
							{props.field.label}
						</InputLabel>
						<BootstrapDatePicker
							value={translateCalendarValue(store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id))}
							clearable={true}
							margin="normal"
							fullWidth={true}
							format="DD-MM-YYYY"
							className={classes.datePicker}
							onChange={e => {
								if (e === null) {
									return store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, '');
								}
								store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, e.format('DD-MM-YYYY'))
							}}
						/>
					</MuiPickersUtilsProvider>
				</div>
			);
		default:
			return ('')
	}
});

export default SidebarFieldType
