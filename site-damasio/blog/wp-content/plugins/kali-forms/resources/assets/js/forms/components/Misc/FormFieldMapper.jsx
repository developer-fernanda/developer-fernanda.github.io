import React from 'react';
import Grid from '@material-ui/core/Grid'
import BootstrapInput from './../BootstrapInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { store } from './../../store/store';
import is from 'is_js';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
const { __ } = wp.i18n;
const FormFieldMapper = (props) => {
	const [fieldValue, setFieldValue] = React.useState({});

	React.useEffect(() => {
		let mapper = {};
		let noValues = false;
		if (is.empty(props.values) || is.undefined(props.values)) {
			noValues = true;
		}

		props.fieldsToMap.map(e => {
			mapper[e.id] = noValues
				? 'empty'
				: props.values.hasOwnProperty(e.id) ? props.values[e.id] : '';
		})
		setFieldValue(mapper);
	}, [])

	const changeValue = (field, value) => {
		let currentValue = fieldValue;
		currentValue[field] = value;
		setFieldValue(JSON.parse(JSON.stringify(currentValue)))
		props.onChange(fieldValue);
	}
	return (
		<React.Fragment>
			<Grid container direction="row" spacing={4}>
				{props.fieldsToMap.map((e, idx) =>
					<React.Fragment key={e.id}>
						<Grid item xs={e.hasOwnProperty('removable') && e.removable ? 5 : 6} >
							<FormControl>
								<InputLabel shrink>
									{e.label}
								</InputLabel>
								<Select
									value={fieldValue[e.id] || 'empty'}
									multiple={false}
									onChange={event => changeValue(e.id, event.target.value)}
									input={<BootstrapInput />}
								>
									<MenuItem
										value={'empty'}>
										{__('-- Select a field --', 'kaliforms')}
									</MenuItem>
									{
										Object.keys(store._FIELD_COMPONENTS_.simplifiedFields).map((key, index) => {
											if (
												[
													'freeText',
													'divider',
													'pageBreak',
													'button',
													'submitButton',
													'range',
													'paypal',
													'product',
													'donation',
													'checkbox',
													'dateTimePicker',
													'grecaptcha',
													'fileUpload',
													'smartTextOutput',
													'rating',
												]
													.includes(store._FIELD_COMPONENTS_.simplifiedFields[key].type)) {
												return;
											}
											return (
												<MenuItem
													key={index + key}
													value={store._FIELD_COMPONENTS_.simplifiedFields[key].fieldName}>
													{store._FIELD_COMPONENTS_.simplifiedFields[key].caption}
												</MenuItem>
											)
										})
									}
								</Select>
							</FormControl>
						</Grid>
						<If condition={e.hasOwnProperty('removable') && e.removable}>
							<Grid item xs={1} style={{ paddingTop: 40 }}>
								<Button
									variant="text"
									onClick={() => props.removableFunc(idx)}
								>
									<Icon className="icon-remove" />
								</Button>
							</Grid>
						</If>
					</React.Fragment>
				)}
			</Grid>
		</React.Fragment>
	);
}

export default FormFieldMapper;
