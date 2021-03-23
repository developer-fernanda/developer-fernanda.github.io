import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { store } from "./../../store/store";
import BootstrapInput from './../BootstrapInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

const FieldComponentSelect = (props) => {
	return (
		<FormControl>
			<InputLabel shrink>
				{props.label}
			</InputLabel>
			<Select
				multiple={false}
				input={<BootstrapInput />}
				value={''}
				onChange={e => console.log(e)}
				fullWidth={true}
			>
				{store._FIELD_COMPONENTS_.fieldComponents.map(field => {
					if (
						(field.properties.name !== '')
						&& (
							field.id === 'radio'
							|| field.id === 'dropdown'
							|| field.id === 'choices'
							|| field.id === 'textbox'
							|| field.id === 'number'
							|| field.id === 'dateTimePicker'
							|| field.id === 'url'
							|| field.id === 'telephone'
						)
					) {
						console.log(field);
						let label = (typeof field.properties.caption !== 'undefined' && field.properties.caption !== '') ? field.properties.caption : field.properties.name
						return (
							<MenuItem
								key={field.internalId}
								value={field.properties.name}>
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
