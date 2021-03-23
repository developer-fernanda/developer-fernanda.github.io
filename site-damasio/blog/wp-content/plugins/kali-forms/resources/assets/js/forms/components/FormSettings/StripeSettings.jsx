import Grid from '@material-ui/core/Grid';
import React from 'react';
import { observer } from "mobx-react";
import { store } from "./../../store/store";
import Container from './../LayoutComponents/Container';
import SectionTitle from './../Misc/SectionTitle'
import FormFieldMapper from './../Misc/FormFieldMapper';
import BootstrapInput from './../BootstrapInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from './../Misc/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from './../Misc/FormControlLabel';
const { __ } = wp.i18n;

const StripeSettings = observer((props) => {
	const stripeCountries = {
		AE: __('United Arab Emirates', 'kaliforms'),
		AT: __('Austria', 'kaliforms'),
		AU: __('Australia', 'kaliforms'),
		BE: __('Belgium', 'kaliforms'),
		BG: __('Bulgaria', 'kaliforms'),
		BR: __('Brasil', 'kaliforms'),
		CA: __('Canada', 'kaliforms'),
		CH: __('Switzerland', 'kaliforms'),
		CI: __('Côte d’Ivoire', 'kaliforms'),
		CR: __('Croatia', 'kaliforms'),
		CY: __('Cyprus', 'kaliforms'),
		CZ: __('Czech Republic', 'kaliforms'),
		DE: __('Germany', 'kaliforms'),
		DK: __('Denmark', 'kaliforms'),
		DO: __('Dominican Republic', 'kaliforms'),
		EE: __('Estonia', 'kaliforms'),
		ES: __('Spain', 'kaliforms'),
		FI: __('Finland', 'kaliforms'),
		FR: __('France', 'kaliforms'),
		GB: __('United Kingdom', 'kaliforms'),
		GR: __('Greece', 'kaliforms'),
		GT: __('Guatemala', 'kaliforms'),
		HK: __('Hong Kong', 'kaliforms'),
		HU: __('Hungary', 'kaliforms'),
		ID: __('Indonesia', 'kaliforms'),
		IE: __('Ireland', 'kaliforms'),
		IN: __('India', 'kaliforms'),
		IT: __('Italy', 'kaliforms'),
		JP: __('Japan', 'kaliforms'),
		LT: __('Lithuania', 'kaliforms'),
		LU: __('Luxembourg', 'kaliforms'),
		LV: __('Latvia', 'kaliforms'),
		MT: __('Malta', 'kaliforms'),
		MX: __('Mexico', 'kaliforms'),
		MY: __('Malaysia', 'kaliforms'),
		NL: __('Netherlands', 'kaliforms'),
		NO: __('Norway', 'kaliforms'),
		NZ: __('New Zealand', 'kaliforms'),
		PE: __('Peru', 'kaliforms'),
		PH: __('Philippines', 'kaliforms'),
		PL: __('Poland', 'kaliforms'),
		PT: __('Portugal', 'kaliforms'),
		RO: __('Romania', 'kaliforms'),
		SE: __('Sweden', 'kaliforms'),
		SG: __('Singapore', 'kaliforms'),
		SI: __('Slovenia', 'kaliforms'),
		SK: __('Slovakia', 'kaliforms'),
		SN: __('Senegal', 'kaliforms'),
		TH: __('Thailand', 'kaliforms'),
		TT: __('Trinidad & Tobago', 'kaliforms'),
		US: __('United States', 'kaliforms'),
		UY: __('Uruguay', 'kaliforms')
	};

	return (
		<React.Fragment>
			<Container maxWidth="md">
				<SectionTitle title="Stripe keys" />
				<Grid container direction="row" spacing={3}>
					<Grid item xs={6}>
						<FormControl>
							<InputLabel shrink>
								{__('Publishable key (sandbox)', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								value={store._PAYMENTS_.stripePKey}
								onChange={e => store._PAYMENTS_.stripePKey = e.target.value}
								variant="filled"
								fullWidth={true}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<FormControl>
							<InputLabel shrink>
								{__('Secret key (sandbox)', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								value={store._PAYMENTS_.stripeSKey}
								onChange={e => store._PAYMENTS_.stripeSKey = e.target.value}
								variant="filled"
								fullWidth={true}
							/>
						</FormControl>
					</Grid>
				</Grid>
				<Grid container direction="row" spacing={3}>
					<Grid item xs={6}>
						<FormControl>
							<InputLabel shrink>
								{__('Publishable key (LIVE)', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								value={store._PAYMENTS_.stripePKeyLive}
								onChange={e => store._PAYMENTS_.stripePKeyLive = e.target.value}
								variant="filled"
								fullWidth={true}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<FormControl>
							<InputLabel shrink>
								{__('Secret key (LIVE)', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								value={store._PAYMENTS_.stripeSKeyLive}
								onChange={e => store._PAYMENTS_.stripeSKeyLive = e.target.value}
								variant="filled"
								fullWidth={true}
							/>
						</FormControl>
					</Grid>
				</Grid>
				<SectionTitle title="Stripe options" />
				<Grid container direction="row" spacing={3}>
					<Grid item xs={6}>
						<FormGroup row>
							<FormControlLabel
								control={
									<Checkbox
										checked={store._PAYMENTS_.stripePaymentRequestButton === '1'}
										onChange={e => store._PAYMENTS_.stripePaymentRequestButton = e.target.checked ? '1' : '0'}
									/>
								}
								label={__('Add Pay Now button', 'kaliforms')}
							/>
						</FormGroup>
					</Grid>
					<Grid item xs={6}>
						<FormControl>
							<InputLabel shrink>
								{__('Account country', 'kaliforms')}
							</InputLabel>
							<Select
								value={store._PAYMENTS_.stripeCountry}
								multiple={false}
								onChange={e => store._PAYMENTS_.stripeCountry = e.target.value}
								input={<BootstrapInput />}
							>
								{Object.keys(stripeCountries).map(key => <MenuItem key={key} value={key}>{stripeCountries[key]}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
				</Grid>
				<SectionTitle title="Stripe customer details" />
				<Grid container direction="row" spacing={3}>
					<Grid item xs={12}>
						<FormFieldMapper
							fieldsToMap={[
								{ id: 'name', label: __('Card name', 'kaliforms') },
								{ id: 'email', label: __('Email', 'kaliforms') },
								{ id: 'phone', label: __('Phone', 'kaliforms') },
								{ id: 'city', label: __('City', 'kaliforms') },
								{ id: 'country', label: __('Country (country code)', 'kaliforms') },
								{ id: 'line1', label: __('Address line 1', 'kaliforms') },
								{ id: 'line2', label: __('Address line 2', 'kaliforms') },
								{ id: 'state', label: __('State', 'kaliforms') },
								{ id: 'postal_code', label: __('Postal code', 'kaliforms') }
							]}
							values={store._PAYMENTS_.stripeFields}
							onChange={val => store._PAYMENTS_.stripeFields = val}
						/>
					</Grid>
				</Grid>

			</Container>
		</React.Fragment>
	);
})
export default StripeSettings;
