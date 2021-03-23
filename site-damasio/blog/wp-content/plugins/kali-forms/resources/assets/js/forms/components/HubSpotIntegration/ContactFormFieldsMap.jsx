import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid'
import FieldComponentSelect from './FieldComponentSelect'
const { __ } = wp.i18n;
const ContactFormFieldsMap = (props) => {
	const [mappedFields, setMappedFields] = useState(
		{
			email: props.formFieldsMap.email,
			firstName: props.formFieldsMap.firstName,
			lastName: props.formFieldsMap.lastName
		}
	);

	const selectChange = (data) => {
		let currentState = mappedFields;
		currentState[data.field] = data.value;
		setMappedFields({ ...currentState })
		props.setFormFieldsMap({ ...currentState })
	}

	return (
		<div>
			<Grid direction="row" container spacing={4}>
				<Grid item xs={6}>
					<FieldComponentSelect
						label={__('Email', 'kaliforms')}
						selectedValue={mappedFields.email}
						field="email"
						onChange={selectChange} />
				</Grid>
			</Grid>
			<Grid direction="row" container spacing={4}>
				<Grid item xs={6}>
					<FieldComponentSelect
						label={__('First name', 'kaliforms')}
						selectedValue={mappedFields.firstName}
						field="firstName"
						onChange={selectChange} />
				</Grid>
			</Grid>
			<Grid direction="row" container spacing={4}>
				<Grid item xs={6}>
					<FieldComponentSelect
						label={__('Last name', 'kaliforms')}
						selectedValue={mappedFields.lastName}
						field="lastName"
						onChange={selectChange} />
				</Grid>
			</Grid>
		</div>
	);
}

export default ContactFormFieldsMap;
