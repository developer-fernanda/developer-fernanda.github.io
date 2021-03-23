import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { store } from "./../../store/store";
import BootstrapInput from './../BootstrapInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
const { __ } = wp.i18n;
const FieldComponentSelect = (props) => {

	return (
		<FormControl>
			<If condition={props.label !== ''}>
				<InputLabel shrink>
					{props.label} {props.help !== '' && (<em>{props.help}</em>)}
				</InputLabel>
			</If>
			<Select
				multiple={false}
				input={<BootstrapInput />}
				value={props.selectedValue || 'empty'}
				onChange={e => {
					let type = 'unknown';
					if (e.hasOwnProperty('nativeEvent')) {
						type = e.nativeEvent.target.dataset.fieldtype
					}
					props.onChange({ field: props.field, value: e.target.value, type })
				}}
				fullWidth={true}
			>
				<MenuItem value={'empty'}>{__('-- Select a field --', 'kaliforms')}</MenuItem>
				{store._FIELD_COMPONENTS_.fieldComponents.map(field => {
					if (
						(field.properties.name !== '')
						&& (field.id === 'checkbox'
							|| field.id === 'select'
							|| field.id === 'textbox'
							|| field.id === 'telephone'
							|| field.id === 'email'
							|| field.id === 'radio'
							|| field.id === 'hidden'
							|| field.id === 'dropdown'
							|| field.id === 'textarea'
							|| field.id === 'date'
							|| field.id === 'range'
							|| field.id === 'choices'
							|| field.id === 'number'
							|| field.id === 'dateTimePicker'
							|| field.id === 'url'
							|| field.id === 'telephone'
							|| field.id === 'digitalSignature'
							|| field.id === 'total'
							|| field.id === 'imageRadio'
							|| field.id === 'password'
							|| field.id === 'gdpr'
							|| field.id === 'termsAndConditions'
							|| field.id === 'colorPicker'
							|| field.id === 'rating'
							|| field.id === 'fileUpload'
							|| field.id === 'digitalSignature'
						)
					) {

						let label = (typeof field.properties.caption !== 'undefined' && field.properties.caption !== '') ? field.properties.caption : field.properties.name
						return (
							<MenuItem
								key={field.internalId}
								value={field.properties.name}
								data-fieldtype={field.id}
							>
								{label}
							</MenuItem>
						)
					}
				})}
			</Select>
		</FormControl>
	);
}

export default FieldComponentSelect
