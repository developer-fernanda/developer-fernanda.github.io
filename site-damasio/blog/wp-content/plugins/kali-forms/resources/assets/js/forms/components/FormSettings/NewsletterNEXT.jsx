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
import FieldComponentSelect from './../HubSpotIntegration/FieldComponentSelect';
import Checkbox from './../Misc/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import is from 'is_js';
const { __ } = wp.i18n;
const Newsletter = observer(props => {
	const [mailChimpData] = React.useState(
		is.falsy(KaliFormsNewsletter.mailchimp) ? { error: 'Something went wrong' } : KaliFormsNewsletter.mailchimp
	);
	const [convertKit] = React.useState(
		is.falsy(KaliFormsNewsletter.convertkit) ? { error: 'Something went wrong' } : KaliFormsNewsletter.convertkit
	);
	const [activeCampaign] = React.useState(
		is.falsy(KaliFormsNewsletter.activecampaign) ? { error: 'Something went wrong' } : KaliFormsNewsletter.activecampaign
	);
	const [mailerLiteData] = React.useState(
		is.falsy(KaliFormsNewsletter.mailerlite) ? { error: 'Something went wrong' } : KaliFormsNewsletter.mailerlite
	);
	const [mailPoetData] = React.useState(
		is.falsy(KaliFormsNewsletter.mailpoet) ? { error: 'Something went wrong' } : KaliFormsNewsletter.mailpoet
	);
	const [sendFoxData] = React.useState(
		is.falsy(KaliFormsNewsletter.sendfox) ? { error: 'Something went wrong' } : KaliFormsNewsletter.sendfox
	);
	const [sendinblueData] = React.useState(
		is.falsy(KaliFormsNewsletter.sendinblue) ? { error: 'Something went wrong' } : KaliFormsNewsletter.sendinblue
	);
	const [moosendData] = React.useState(
		is.falsy(KaliFormsNewsletter.moosend) ? { error: 'Something went wrong' } : KaliFormsNewsletter.moosend
	);
	const [campaignmonitor] = React.useState(
		is.falsy(KaliFormsNewsletter.campaignmonitor) ? { error: 'Something went wrong' } : KaliFormsNewsletter.campaignmonitor
	);

	const selectableTypes = ['select', 'dropdown', 'checkbox', 'radio', 'choices', 'imageRadio'];
	const getNlData = (provider = '', id = '') => {
		if (is.empty(provider)) {
			return false;
		}
		provider = provider.toLowerCase();

		let nlData = {
			activecampaign: activeCampaign,
			mailchimp: mailChimpData,
			moosend: moosendData,
			sendfox: sendFoxData,
			sendinblue: sendinblueData,
			mailerlite: mailerLiteData,
			mailpoet: mailPoetData,
			convertkit: convertKit,
			campaignmonitor: campaignmonitor
		}

		if (!nlData.hasOwnProperty(provider)) {
			return false;
		}

		let currentDataPack = nlData[provider];
		let data = false;

		if (is.empty(id)) {
			return currentDataPack
		}
	}

	const providers = [
		{
			id: 'mailchimp',
			label: 'MailChimp'
		},
		{
			id: 'convertkit',
			label: 'ConvertKit'
		},
		{
			id: 'activecampaign',
			label: 'Active Campaign'
		},
		{
			id: 'mailerlite',
			label: 'MailerLite'
		},
		{
			id: 'mailpoet',
			label: 'MailPoet'
		},
		{
			id: 'sendfox',
			label: 'Sendfox'
		},
		{
			id: 'sendinblue',
			label: 'Sendinblue'
		},
		{
			id: 'moosend',
			label: 'Moosend'
		},
		{
			id: 'campaignmonitor',
			label: 'Campaign Monitor'
		}
	].filter(provider => {
		return !getNlData(provider.id).hasOwnProperty('error');
	});

	const fieldChanged = data => {
		store._NEWSLETTER_.fields[data.field] = data.value
		store._NEWSLETTER_.fields['userConsentFieldType'] = data.type
	}

	const providerChanged = provider => {
		store._NEWSLETTER_.fields = {};
		store._NEWSLETTER_.list = '';
		store._NEWSLETTER_.form = '';

		if (store._NEWSLETTER_.provider === provider) {
			store._NEWSLETTER_.provider = '0';

			return;
		}

		store._NEWSLETTER_.provider = provider;
	}

	const keysFound = () => {
		let response = false;
		const obj = {
			mailChimp: !mailChimpData.hasOwnProperty('error'),
			convertKit: !convertKit.hasOwnProperty('error'),
			activeCampaign: !activeCampaign.hasOwnProperty('error'),
			mailerLite: !mailerLiteData.hasOwnProperty('error'),
			mailPoet: !mailPoetData.hasOwnProperty('error'),
			sendfox: !sendFoxData.hasOwnProperty('error'),
			sendinblue: !sendinblueData.hasOwnProperty('error'),
			moosend: !moosendData.hasOwnProperty('error'),
			campaignmonitor: !campaignmonitor.hasOwnProperty('error'),
		}

		Object.keys(obj).map(e => {
			response = response ? true : obj[e]
		})

		return response
	}

	const getListsOrForms = () => {
		let data = getNlData(store._NEWSLETTER_.provider);

		if (is.falsy(data)) {
			return {
				type: 'list',
				entities: []
			}
		}
		let retObj = {
			type: data.hasOwnProperty('lists') ? 'list' : 'form',
			entities: data.hasOwnProperty('lists') ? data.lists : data.forms,
		}

		return retObj;
	}

	const getFieldsFromEntity = () => {
		let type = getListsOrForms().type
		let selectedEntity = store._NEWSLETTER_[type];
		let data = getNlData(store._NEWSLETTER_.provider, selectedEntity);
	}

	const entitySelected = () => {
		let type = getListsOrForms().type
		return store._NEWSLETTER_[type] !== '';
	}

	const providerLists = getListsOrForms();
	const providerFields = getFieldsFromEntity();

	return (
		<React.Fragment>
			<Container maxWidth="md">
				<SectionTitle title={__('Newsletter settings', 'kaliforms')} />
				<If condition={!keysFound()}>
					<Grid container direction="row" spacing={3}>
						<Grid item xs={12}>
							<Typography>{__('No api keys provided. Please check your settings.', 'kaliforms')}</Typography>
						</Grid>
					</Grid>
				</If>

				<Grid container direction="row" spacing={3}>
					{providers.map(provider =>
						<Grid key={provider.id} item xs={3}>
							<FormGroup row>
								<FormControlLabel
									control={
										<Checkbox
											checked={store._NEWSLETTER_.provider === provider.id}
											onChange={e => providerChanged(provider.id)}
										/>
									}
									label={__('Enable ', 'kaliforms') + provider.label}
								/>
							</FormGroup>
						</Grid>
					)}
				</Grid>

				<Grid container direction="row" spacing={3}>
					<If condition={
						(
							!is.empty(store._NEWSLETTER_.provider) &&
							store._NEWSLETTER_.provider !== '0'
						)
						&&
						!getNlData(store._NEWSLETTER_.provider).hasOwnProperty('error')
					}>
						<If condition={providerLists.entities.length}>
							<Grid item xs={12}>
								<FormControl>
									<InputLabel shrink>
										<If condition={providerLists.type === 'list'}>
											{__('List', 'kaliforms')}
										</If>
										<If condition={providerLists.type === 'form'}>
											{__('Form', 'kaliforms')}
										</If>
									</InputLabel>
									<Select
										value={providerLists.type === 'list' ? store._NEWSLETTER_.list : store._NEWSLETTER_.form}
										multiple={false}
										onChange={
											e => providerLists.type === 'list'
												? store._NEWSLETTER_.list = e.target.value
												: store._NEWSLETTER_.form = e.target.value
										}
										input={<BootstrapInput />}
									>
										{providerLists.entities.map(entity => <MenuItem key={entity.id} value={entity.id}>{entity.name}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
						</If>
						<If condition={!providerLists.entities.length}>
							<Grid item xs={12}>
								<Typography>{__('No lists associated with your account. Please configure your newsletter settings before integrating it with Kali Forms', 'kaliforms')}</Typography>
							</Grid>
						</If>
						<If condition={entitySelected() && providerFields.length}></If>
					</If>
				</Grid>

				<If condition={store._NEWSLETTER_.provider !== '0' && store._NEWSLETTER_.provider !== ''}>
					<Grid container direction="row" spacing={3}>
						<Grid item xs={12}>
							<Typography>
								{__('Subscribe users to your newsletter only if a field has a certain value', 'kaliforms')}
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<FieldComponentSelect
								label={__('User consent field', 'kaliforms')}
								selectedValue={store._NEWSLETTER_.fields.userConsent || ''}
								field="userConsent"
								onChange={fieldChanged}
							/>
						</Grid>
						<Grid item xs={6}>
							<FormControl>
								<InputLabel shrink>
									{__('User consent value', 'kaliforms')}
								</InputLabel>
								<If condition={typeof store._NEWSLETTER_.fields.userConsentFieldType !== 'undefined' && selectableTypes.includes(store._NEWSLETTER_.fields.userConsentFieldType)}>
									<Select
										multiple={false}
										input={<BootstrapInput />}
										value={store._NEWSLETTER_.fields.userConsentValue || ''}
										onChange={e => store._NEWSLETTER_.fields.userConsentValue = e.target.value}
										fullWidth={true}
									>
										{
											typeof store._FIELD_COMPONENTS_.fieldConditionersByName[store._NEWSLETTER_.fields.userConsent] !== 'undefined'
											&& store._FIELD_COMPONENTS_.fieldConditionersByName[store._NEWSLETTER_.fields.userConsent].values.map((e, index) => (
												<MenuItem key={index + e.value} value={e.value}>
													{e.label}
												</MenuItem>
											))
										}
									</Select>
								</If>
								<If condition={
									typeof store._NEWSLETTER_.fields.userConsentFieldType === 'undefined'
									|| !selectableTypes.includes(store._NEWSLETTER_.fields.userConsentFieldType)}>
									<BootstrapInput
										value={store._NEWSLETTER_.fields.userConsentValue || ''}
										fullWidth={true}
										onChange={e => store._NEWSLETTER_.fields.userConsentValue = e.target.value} />
								</If>
							</FormControl>
						</Grid>
					</Grid>
				</If>
			</Container>
		</React.Fragment >
	);
})
export default Newsletter;
