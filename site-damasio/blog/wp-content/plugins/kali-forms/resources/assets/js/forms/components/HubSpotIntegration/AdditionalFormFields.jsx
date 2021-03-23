import React from 'react';
import FieldComponentSelect from './FieldComponentSelect'
import Grid from '@material-ui/core/Grid'
import HubSpotProperties from './HubSpotProperties'
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
const { __ } = wp.i18n;
const AdditionalFormFields = (props) => {
	const selectChange = (data) => {
		let currentState = props.additionalFormFields;
		currentState[data.field].assignedFormField = data.value
		props.setAdditionalFormFields([...currentState]);
	}

	const hubSpotPropertyChange = (data) => {
		let currentState = props.additionalFormFields;
		currentState[data.field].hubspotProperty = data.value
		props.setAdditionalFormFields([...currentState]);
	}

	const setDefaultFormField = () => {
		let currentState = props.additionalFormFields;
		currentState[0] = { additionalFieldIndex: props.additionalFormFields.length, hubspotProperty: '', assignedFormField: '' }
		props.setAdditionalFormFields([...currentState]);
	}

	const addAdditionalFormField = () => {
		let currentState = props.additionalFormFields;
		props.setAdditionalFormFields(
			[
				...currentState,
				{ additionalFieldIndex: props.additionalFormFields.length, hubspotProperty: '', assignedFormField: '' }
			]
		)
	}

	const removeAdditionalFormField = (idx) => {
		let currentState = props.additionalFormFields;
		currentState.splice(idx, 1);
		props.setAdditionalFormFields([...currentState]);
	}

	return (
		<Grid container direction="row" spacing={4}>
			<Grid item xs={4}>
				<HubSpotProperties
					label={__('HubSpot Property', 'kaliforms')}
					field={props.additionalFieldIndex}
					selectedValue={props.hubSpotProperty}
					onChange={hubSpotPropertyChange} />
			</Grid>
			<Grid item xs={4}>
				<FieldComponentSelect
					label={__('Form field', 'kaliforms')}
					field={props.additionalFieldIndex}
					selectedValue={props.assignedFormField}
					onChange={selectChange} />
			</Grid>
			<Grid item xs={4} style={{ paddingTop: 42 }}>
				<Button
					aria-label={__('Add form field', 'kaliforms')}
					variant="text"
					onClick={() => addAdditionalFormField()}
				>
					<Icon className="icon-add" />
				</Button>
				<Button
					aria-label={__('Remove form field', 'kaliforms')}
					variant="text"
					onClick={() => props.additionalFormFields.length === 1 ? setDefaultFormField() : removeAdditionalFormField(props.additionalFieldIndex)}
				>
					<Icon className="icon-remove" />
				</Button>
			</Grid>
		</Grid>
	);
}

export default AdditionalFormFields;
