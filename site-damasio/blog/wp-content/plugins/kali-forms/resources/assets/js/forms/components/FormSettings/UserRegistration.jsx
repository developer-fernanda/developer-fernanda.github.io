import React from 'react';
import Typography from '@material-ui/core/Typography';
import { observer } from "mobx-react";
import { store } from "./../../store/store";
import Container from './../LayoutComponents/Container';
import SectionTitle from './../Misc/SectionTitle'
import Grid from '@material-ui/core/Grid';
import FormControlLabel from './../Misc/FormControlLabel';
import BootstrapInput from './../BootstrapInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from './../Misc/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormFieldMapper from './../Misc/FormFieldMapper';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import is from 'is_js';
const { __ } = wp.i18n;
const UserRegistration = observer(props => {
	const [newCustomFieldKey, setNewCustomFieldKey] = React.useState('');
	const [newCustomFieldLabel, setNewCustomFieldLabel] = React.useState('');
	const [fieldsToMap, setFieldsToMap] = React.useState([
		{ id: 'user_login', label: __('Username', 'kaliforms') },
		{ id: 'user_email', label: __('Email', 'kaliforms') },
		{ id: 'first_name', label: __('First name', 'kaliforms') },
		{ id: 'last_name', label: __('Last name', 'kaliforms') },
		{ id: 'display_name', label: __('Display name', 'kaliforms') },
		{ id: 'nickname', label: __('Nick name', 'kaliforms') },
		{ id: 'user_url', label: __('Website', 'kaliforms') },
		{ id: 'user_pass', label: __('Password', 'kaliforms') },
	]);

	const addCustomField = () => {
		let newCustomField = {
			id: newCustomFieldKey,
			label: newCustomFieldLabel,
			removable: true,
		}

		store._USER_REGISTRATION_.addCustomField(newCustomField);

		setNewCustomFieldKey('');
		setNewCustomFieldLabel('');
	}

	return (
		<React.Fragment>
			<Container maxWidth="md">
				<SectionTitle title={__("User registration", 'kaliforms')} />
				<Grid container direction="row" spacing={3}>
					<Grid item xs={12}>
						<FormGroup row>
							<FormControlLabel
								control={
									<Checkbox
										checked={store._USER_REGISTRATION_.enabled === '1'}
										onChange={e => store._USER_REGISTRATION_.setEnabled(e.target.checked ? '1' : '0')}
									/>
								}
								label={__('Enable user registration', 'kaliforms')}
							/>
						</FormGroup>
					</Grid>
				</Grid>
				<If condition={store._USER_REGISTRATION_.enabled === '1'}>
					<Grid container direction="row" spacing={3}>
						<Grid item xs={12}>
							<FormFieldMapper
								fieldsToMap={fieldsToMap}
								values={store._USER_REGISTRATION_.fields || []}
								onChange={val => store._USER_REGISTRATION_.setFields(val)}
							/>
						</Grid>
						<Grid item xs={6}>
							<InputLabel shrink>
								{__('User role', 'kaliforms')}
							</InputLabel>
							<Select
								multiple={false}
								input={<BootstrapInput />}
								value={store._USER_REGISTRATION_.role || 'subscriber'}
								onChange={e => store._USER_REGISTRATION_.setRole(e.target.value)}
								fullWidth={true}
							>
								{
									Object.keys(KaliFormsUserRegistration.roles).map(e => (
										<MenuItem key={e} value={e}>
											{KaliFormsUserRegistration.roles[e]}
										</MenuItem>
									))
								}
							</Select>
						</Grid>
					</Grid>

					<Grid container direction="row" spacing={3} style={{ marginBottom: 16, marginTop: 16 }}>
						<Grid item xs={12}>
							<Typography variant="body1">{__('Custom fields', 'kaliforms')}</Typography>
						</Grid>
					</Grid>

					<If condition={is.not.empty(store._USER_REGISTRATION_.customFields)}>
						<Grid container direction="row" spacing={3}>
							<Grid item xs={12}>
								<FormFieldMapper
									fieldsToMap={store._USER_REGISTRATION_.customFields}
									values={store._USER_REGISTRATION_.customFieldsValues || []}
									removableFunc={store._USER_REGISTRATION_.removeCustomField.bind(store._USER_REGISTRATION_)}
									onChange={val => store._USER_REGISTRATION_.setCustomFieldsValues(val)}
								/>
							</Grid>
						</Grid>
					</If>

					<Grid container direction="row" spacing={3}>
						<Grid item xs={5}>
							<FormControl>
								<InputLabel shrink>
									{__('Custom field key', 'kaliforms')}
								</InputLabel>
								<BootstrapInput
									value={newCustomFieldKey}
									onChange={e => setNewCustomFieldKey(e.target.value)}
									fullWidth={true}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={5}>
							<FormControl>
								<InputLabel shrink>
									{__('Custom field label', 'kaliforms')}
								</InputLabel>
								<BootstrapInput
									value={newCustomFieldLabel}
									onChange={e => setNewCustomFieldLabel(e.target.value)}
									fullWidth={true}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={2} style={{ paddingTop: 38 }}>
							<Button
								variant="text"
								onClick={() => addCustomField()}
							>
								<Icon className="icon-add" />
							</Button>
						</Grid>
					</Grid>
				</If>
			</Container>
		</React.Fragment >
	);
})
export default UserRegistration;
