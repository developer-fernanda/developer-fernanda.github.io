import MenuItem from '@material-ui/core/MenuItem'
import React from 'react';
import BootstrapInput from './../BootstrapInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

const HubSpotProperties = (props) => {
	const properties = [...KaliFormsHubSpot.fieldMapProperties[0].fields, ...KaliFormsHubSpot.fieldMapProperties[1].fields]

	return (
		<FormControl>
			<InputLabel shrink>
				{props.label}
			</InputLabel>
			<Select
				multiple={false}
				input={<BootstrapInput />}
				value={props.selectedValue}
				onChange={e => props.onChange({ field: props.field, value: e.target.value })}
				fullWidth={true}
			>
				{properties.map((field, idx) => (
					<MenuItem
						key={field.name + '-' + idx}
						value={field.name}>
						{field.label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}

export default HubSpotProperties;
