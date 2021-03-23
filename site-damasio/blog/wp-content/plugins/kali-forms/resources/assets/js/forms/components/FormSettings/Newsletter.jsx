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
	const [campaignMonitorData] = React.useState(
		is.falsy(KaliFormsNewsletter.campaignmonitor) ? { error: 'Something went wrong' } : KaliFormsNewsletter.campaignmonitor
	);
	const [getResponseData] = React.useState(
		is.falsy(KaliFormsNewsletter.getresponse) ? { error: 'Something went wrong' } : KaliFormsNewsletter.getresponse
	);
	const [revueData] = React.useState(
		is.falsy(KaliFormsNewsletter.revue) ? { error: 'Something went wrong' } : KaliFormsNewsletter.revue
	);
	const selectableTypes = ['select', 'dropdown', 'checkbox', 'radio', 'choices', 'imageRadio'];

	const getRevueList = id => {
		let data = false;
		revueData.lists.map(list => {
			if (parseInt(list.id) === parseInt(id)) {
				data = list
			}
		})
		return data;
	}

	const getGetresponseList = id => {
		let data = false;
		getResponseData.lists.map(list => {
			if (list.id === id) {
				data = list;
			}
		})
		return data;
	}

	const getCampaignMonitorList = id => {
		let data = false;
		campaignMonitorData.lists.map(list => {
			if (list.id === id) {
				data = list
			}
		})
		return data;
	}

	const getActiveCampaignList = id => {
		let data = false;
		activeCampaign.lists.map(list => {
			if (list.id === id) {
				data = list;
			}
		})
		return data;
	}
	const getListData = id => {
		let data = false;
		mailChimpData.lists.map(list => {
			if (list.id === id) {
				data = list;
			}
		})

		return data;
	}
	const getMoosendListData = id => {
		let data = false;
		moosendData.lists.map(list => {
			if (list.id === id) {
				data = list;
			}
		})

		return data;
	}
	const getSendfoxListData = id => {
		let data = false;
		sendFoxData.lists.map(list => {
			if (list.id === parseInt(id)) {
				data = list;
			}
		})
		return data;
	}
	const getSendinblueData = id => {
		let data = false;
		sendinblueData.lists.map(list => {
			if (list.id === parseInt(id)) {
				data = list;
			}
		})
		return data;
	}
	const getMailPoetListData = id => {
		let data = false;
		mailPoetData.lists.map(list => {
			if (list.id === id) {
				data = list;
			}
		})
		return data;
	}
	const getMailerLiteListData = id => {
		let data = false;
		mailerLiteData.lists.map(list => {
			if (list.id === id) {
				data = list;
			}
		})
		return data;
	}
	const getFormData = id => {
		let data = false;
		convertKit.forms.map(form => {
			if (parseFloat(form.id) === parseFloat(id)) {
				data = form;
			}
		})
		return data;
	}

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
			campaignMonitor: !campaignMonitorData.hasOwnProperty('error'),
			getresponse: !getResponseData.hasOwnProperty('error'),
			revue: !revueData.hasOwnProperty('error'),
		}

		Object.keys(obj).map(e => {
			response = response ? true : obj[e]
		})

		return response
	}


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
					<If condition={!mailChimpData.hasOwnProperty('error')}>
						<Grid item xs={3}>
							<FormGroup row>
								<FormControlLabel
									control={
										<Checkbox
											checked={store._NEWSLETTER_.provider === 'mailchimp'}
											onChange={e => providerChanged('mailchimp')}
										/>
									}
									label={__('Enable MailChimp', 'kaliforms')}
								/>
							</FormGroup>
						</Grid>
					</If>
					<If condition={!convertKit.hasOwnProperty('error')}>
						<Grid item xs={3}>
							<FormGroup row>
								<FormControlLabel
									control={
										<Checkbox
											checked={store._NEWSLETTER_.provider === 'convertkit'}
											onChange={e => providerChanged('convertkit')}
										/>
									}
									label={__('Enable ConvertKit', 'kaliforms')}
								/>
							</FormGroup>
						</Grid>
					</If>
					<If condition={!activeCampaign.hasOwnProperty('error')}>
						<Grid item xs={3}>
							<FormGroup row>
								<FormControlLabel
									control={
										<Checkbox
											checked={store._NEWSLETTER_.provider === 'activecampaign'}
											onChange={e => providerChanged('activecampaign')}
										/>
									}
									label={__('Enable Active Campaign', 'kaliforms')}
								/>
							</FormGroup>
						</Grid>
					</If>
					<If condition={!mailerLiteData.hasOwnProperty('error')}>
						<Grid item xs={3}>
							<FormGroup row>
								<FormControlLabel
									control={
										<Checkbox
											checked={store._NEWSLETTER_.provider === 'mailerlite'}
											onChange={e => providerChanged('mailerlite')}
										/>
									}
									label={__('Enable MailerLite', 'kaliforms')}
								/>
							</FormGroup>
						</Grid>
					</If>
					<If condition={!mailPoetData.hasOwnProperty('error')}>
						<Grid item xs={3}>
							<FormGroup row>
								<FormControlLabel
									control={
										<Checkbox
											checked={store._NEWSLETTER_.provider === 'mailpoet'}
											onChange={e => providerChanged('mailpoet')}
										/>
									}
									label={__('Enable MailPoet', 'kaliforms')}
								/>
							</FormGroup>
						</Grid>
					</If>
					<If condition={!sendFoxData.hasOwnProperty('error')}>
						<Grid item xs={3}>
							<FormGroup row>
								<FormControlLabel
									control={
										<Checkbox
											checked={store._NEWSLETTER_.provider === 'sendfox'}
											onChange={e => providerChanged('sendfox')}
										/>
									}
									label={__('Enable Sendfox', 'kaliforms')}
								/>
							</FormGroup>
						</Grid>
					</If>
					<If condition={!sendinblueData.hasOwnProperty('error')}>
						<Grid item xs={3}>
							<FormGroup row>
								<FormControlLabel
									control={
										<Checkbox
											checked={store._NEWSLETTER_.provider === 'sendinblue'}
											onChange={e => providerChanged('sendinblue')}
										/>
									}
									label={__('Enable Sendinblue', 'kaliforms')}
								/>
							</FormGroup>
						</Grid>
					</If>
					<If condition={!moosendData.hasOwnProperty('error')}>
						<Grid item xs={3}>
							<FormGroup row>
								<FormControlLabel
									control={
										<Checkbox
											checked={store._NEWSLETTER_.provider === 'moosend'}
											onChange={e => providerChanged('moosend')}
										/>
									}
									label={__('Enable Moosend', 'kaliforms')}
								/>
							</FormGroup>
						</Grid>
					</If>
					<If condition={!getResponseData.hasOwnProperty('error')}>
						<Grid item xs={3}>
							<FormGroup row>
								<FormControlLabel
									control={
										<Checkbox
											checked={store._NEWSLETTER_.provider === 'getresponse'}
											onChange={e => providerChanged('getresponse')}
										/>
									}
									label={__('Enable GetResponse', 'kaliforms')}
								/>
							</FormGroup>
						</Grid>
					</If>
					<If condition={!campaignMonitorData.hasOwnProperty('error')}>
						<Grid item xs={3}>
							<FormGroup row>
								<FormControlLabel
									control={
										<Checkbox
											checked={store._NEWSLETTER_.provider === 'campaignmonitor'}
											onChange={e => providerChanged('campaignmonitor')}
										/>
									}
									label={__('Enable Campaign Monitor', 'kaliforms')}
								/>
							</FormGroup>
						</Grid>
					</If>
					<If condition={!revueData.hasOwnProperty('error')}>
						<Grid item xs={3}>
							<FormGroup row>
								<FormControlLabel
									control={
										<Checkbox
											checked={store._NEWSLETTER_.provider === 'revue'}
											onChange={e => providerChanged('revue')}
										/>
									}
									label={__('Enable Revue', 'kaliforms')}
								/>
							</FormGroup>
						</Grid>
					</If>
				</Grid>
				<Grid container direction="row" spacing={3}>
					<If condition={
						!activeCampaign.hasOwnProperty('error')
						&& store._NEWSLETTER_.provider === 'activecampaign'
					}>
						<If condition={activeCampaign.lists.length}>
							<Grid item xs={12}>
								<FormControl>
									<InputLabel shrink>
										{__('List', 'kaliforms')}
									</InputLabel>
									<Select
										value={store._NEWSLETTER_.list}
										multiple={false}
										onChange={e => store._NEWSLETTER_.list = e.target.value}
										input={<BootstrapInput />}
									>
										{activeCampaign.lists.map(list => <MenuItem key={list.id} value={list.id}>{list.name}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
						</If>
						<If condition={activeCampaign.lists.length === 0}>
							<Grid item xs={12}><Typography>{__('No lists associated with your account. Please configure your newsletter settings before integrating it with Kali Forms', 'kaliforms')}</Typography></Grid>
						</If>
						<If condition={store._NEWSLETTER_.list !== '' && getActiveCampaignList(store._NEWSLETTER_.list) !== false}>
							{
								getActiveCampaignList(store._NEWSLETTER_.list).fields.map(field =>
									<Grid item xs={6} key={field.tag}>
										<FieldComponentSelect
											label={field.name}
											help={field.info}
											selectedValue={store._NEWSLETTER_.fields[field.tag] || ''}
											field={field.tag}
											onChange={fieldChanged}
										/>
									</Grid>
								)
							}
						</If>
						<If condition={store._NEWSLETTER_.list !== '' && getActiveCampaignList(store._NEWSLETTER_.list).tags.length}>
							<Grid item xs={12}>
								<Typography>
									{__('Do you want to add certain tags to your subscribers? You can create one of the following form fields : Select, Choices, Radio, Checkbox and populate options using the Presets button. If a tag is not found, a new one will be created on form submit.', 'kaliforms')}
								</Typography>
							</Grid>
							<Grid item xs={6}>
								<FieldComponentSelect
									label={__('Tag selector field', 'kaliforms')}
									selectedValue={store._NEWSLETTER_.fields['acTags'] || ''}
									field="acTags"
									onChange={fieldChanged}
								/>
							</Grid>
						</If>
					</If>
					<If condition={
						!convertKit.hasOwnProperty('error')
						&& store._NEWSLETTER_.provider === 'convertkit'
					}>
						<If condition={convertKit.forms.length}>
							<Grid item xs={12}>
								<FormControl>
									<InputLabel shrink>
										{__('Form', 'kaliforms')}
									</InputLabel>
									<Select
										value={store._NEWSLETTER_.form}
										multiple={false}
										onChange={e => store._NEWSLETTER_.form = e.target.value}
										input={<BootstrapInput />}
									>
										{convertKit.forms.map(form => <MenuItem key={form.id} value={form.id}>{form.name}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
						</If>
						<If condition={convertKit.forms.length === 0}>
							<Grid item xs={12}><Typography>{__('No lists associated with your account. Please configure your newsletter settings before integrating it with Kali Forms', 'kaliforms')}</Typography></Grid>
						</If>
						<If condition={store._NEWSLETTER_.form !== '' && getFormData(store._NEWSLETTER_.form) !== false}>
							{
								getFormData(store._NEWSLETTER_.form).fields.map(field =>
									<Grid item xs={6} key={field.id}>
										<FieldComponentSelect
											label={field.label}
											help={field.info}
											selectedValue={store._NEWSLETTER_.fields[field.key] || ''}
											field={field.key}
											onChange={fieldChanged}
										/>
									</Grid>
								)
							}
						</If>
						<If condition={store._NEWSLETTER_.form !== '' && getFormData(store._NEWSLETTER_.form).tags.length}>
							<Grid item xs={12}>
								<Typography>
									{__('Do you want to add certain tags to your subscribers? You can create one of the following form fields : Select, Choices, Radio, Checkbox and populate options using the Presets button.', 'kaliforms')}
								</Typography>
							</Grid>
							<Grid item xs={6}>
								<FieldComponentSelect
									label={__('Tag selector field', 'kaliforms')}
									selectedValue={store._NEWSLETTER_.fields['acTags'] || ''}
									field="acTags"
									onChange={fieldChanged}
								/>
							</Grid>
						</If>
					</If>
					<If condition={
						!mailChimpData.hasOwnProperty('error')
						&& store._NEWSLETTER_.provider === 'mailchimp'
					}>
						<If condition={mailChimpData.lists.length}>
							<Grid item xs={12}>
								<FormControl>
									<InputLabel shrink>
										{__('List', 'kaliforms')}
									</InputLabel>
									<Select
										value={store._NEWSLETTER_.list}
										multiple={false}
										onChange={e => store._NEWSLETTER_.list = e.target.value}
										input={<BootstrapInput />}
									>
										{mailChimpData.lists.map(list => <MenuItem key={list.id} value={list.id}>{list.name}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
						</If>
						<If condition={mailChimpData.lists.length === 0}>
							<Grid item xs={12}><Typography>{__('No lists associated with your account. Please configure your newsletter settings before integrating it with Kali Forms', 'kaliforms')}</Typography></Grid>
						</If>
						<If condition={store._NEWSLETTER_.list !== '' && getListData(store._NEWSLETTER_.list) !== false}>
							{
								getListData(store._NEWSLETTER_.list).fields.map(field =>
									<Grid item xs={6} key={field.tag}>
										<Choose>
											<When condition={field.type === 'enum'}>
												<FormControl>
													<InputLabel shrink>
														{field.name}
													</InputLabel>
													<Select
														value={store._NEWSLETTER_.fields[field.tag] || 'subscribed'}
														multiple={false}
														onChange={e => store._NEWSLETTER_.fields[field.tag] = e.target.value}
														input={<BootstrapInput />}
													>
														{
															field.choices.map(choice => <MenuItem value={choice.value} key={choice.value}>{choice.label}</MenuItem>)
														}
													</Select>
												</FormControl>
											</When>
											<Otherwise>
												<FieldComponentSelect
													label={field.name}
													help={field.info}
													selectedValue={store._NEWSLETTER_.fields[field.tag] || ''}
													field={field.tag}
													onChange={fieldChanged}
												/>
											</Otherwise>
										</Choose>
									</Grid>
								)
							}
						</If>
						<If condition={store._NEWSLETTER_.list !== '' && getListData(store._NEWSLETTER_.list).tags.length}>
							<Grid item xs={12}>
								<Typography>
									{__('Do you want to add certain tags to your subscribers? You can create one of the following form fields : Select, Choices, Radio, Checkbox and populate options using the Presets button. If a tag is not found, a new one will be created on form submit.', 'kaliforms')}
								</Typography>
							</Grid>
							<Grid item xs={6}>
								<FieldComponentSelect
									label={__('Tag selector field', 'kaliforms')}
									selectedValue={store._NEWSLETTER_.fields['acTags'] || ''}
									field="acTags"
									onChange={fieldChanged}
								/>
							</Grid>
						</If>
					</If>
					<If condition={
						!mailerLiteData.hasOwnProperty('error')
						&& store._NEWSLETTER_.provider === 'mailerlite'
					}>
						<If condition={mailerLiteData.lists.length}>
							<Grid item xs={12}>
								<FormControl>
									<InputLabel shrink>
										{__('List', 'kaliforms')}
									</InputLabel>
									<Select
										value={isNaN(store._NEWSLETTER_.list) ? parseFloat(store._NEWSLETTER_.list) : store._NEWSLETTER_.list}
										multiple={false}
										onChange={e => store._NEWSLETTER_.list = e.target.value}
										input={<BootstrapInput />}
									>
										{mailerLiteData.lists.map(list => <MenuItem key={list.id} value={list.id}>{list.name}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
						</If>
						<If condition={mailerLiteData.lists.length === 0}>
							<Grid item xs={12}><Typography>{__('No lists associated with your account. Please configure your newsletter settings before integrating it with Kali Forms', 'kaliforms')}</Typography></Grid>
						</If>
						<If condition={store._NEWSLETTER_.list !== '' && getMailerLiteListData(store._NEWSLETTER_.list) !== false}>
							{
								getMailerLiteListData(store._NEWSLETTER_.list).fields.map(field =>
									<Grid item xs={6} key={field.key}>
										<FieldComponentSelect
											label={field.name}
											help={field.info}
											selectedValue={store._NEWSLETTER_.fields[field.key] || ''}
											field={field.key}
											onChange={fieldChanged}
										/>
									</Grid>
								)
							}
						</If>
					</If>
					<If condition={
						!mailPoetData.hasOwnProperty('error')
						&& store._NEWSLETTER_.provider === 'mailpoet'
					}>
						<If condition={mailPoetData.lists.length}>
							<Grid item xs={12}>
								<FormControl>
									<InputLabel shrink>
										{__('List', 'kaliforms')}
									</InputLabel>
									<Select
										value={store._NEWSLETTER_.list}
										multiple={false}
										onChange={e => store._NEWSLETTER_.list = e.target.value}
										input={<BootstrapInput />}
									>
										{mailPoetData.lists.map(list => <MenuItem key={list.id} value={list.id}>{list.name}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
						</If>
						<If condition={mailPoetData.lists.length === 0}>
							<Grid item xs={12}><Typography>{__('Please configure MailPoet lists before integrating it with Kali Forms', 'kaliforms')}</Typography></Grid>
						</If>
						<If condition={store._NEWSLETTER_.list !== '' && getMailPoetListData(store._NEWSLETTER_.list) !== false}>
							{
								getMailPoetListData(store._NEWSLETTER_.list).fields.map(field =>
									<Grid item xs={6} key={field.id}>
										<Choose>
											<When condition={field.type === 'enum'}>
												<FormControl>
													<InputLabel shrink>
														{field.name}
													</InputLabel>
													<Select
														value={store._NEWSLETTER_.fields[field.id] || 'subscribed'}
														multiple={false}
														onChange={e => store._NEWSLETTER_.fields[field.id] = e.target.value}
														input={<BootstrapInput />}
													>
														{
															field.choices.map(choice => <MenuItem value={choice.value} key={choice.value}>{choice.label}</MenuItem>)
														}
													</Select>
												</FormControl>
											</When>
											<Otherwise>
												<FieldComponentSelect
													label={field.name}
													help={field.info}
													selectedValue={store._NEWSLETTER_.fields[field.id] || ''}
													field={field.id}
													onChange={fieldChanged}
												/>
											</Otherwise>
										</Choose>
									</Grid>
								)
							}
						</If>
					</If>
					<If condition={
						!sendFoxData.hasOwnProperty('error')
						&& store._NEWSLETTER_.provider === 'sendfox'
					}>
						<If condition={sendFoxData.lists.length}>
							<Grid item xs={12}>
								<FormControl>
									<InputLabel shrink>
										{__('List', 'kaliforms')}
									</InputLabel>
									<Select
										value={store._NEWSLETTER_.list}
										multiple={false}
										onChange={e => store._NEWSLETTER_.list = e.target.value}
										input={<BootstrapInput />}
									>
										{sendFoxData.lists.map(list => <MenuItem key={list.id} value={list.id}>{list.name}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
						</If>
						<If condition={sendFoxData.lists.length === 0}>
							<Grid item xs={12}><Typography>{__('There are no lists created in your Sendfox account. Please make sure you create at least one before configuring this integration.', 'kaliforms')}</Typography></Grid>
						</If>
						<If condition={store._NEWSLETTER_.list !== '' && getSendfoxListData(store._NEWSLETTER_.list) !== false}>
							{
								getSendfoxListData(store._NEWSLETTER_.list).fields.map(field =>
									<Grid item xs={6} key={field.id}>
										<Choose>
											<When condition={field.type === 'enum'}>
												<FormControl>
													<InputLabel shrink>
														{field.name}
													</InputLabel>
													<Select
														value={store._NEWSLETTER_.fields[field.id] || 'subscribed'}
														multiple={false}
														onChange={e => store._NEWSLETTER_.fields[field.id] = e.target.value}
														input={<BootstrapInput />}
													>
														{
															field.choices.map(choice => <MenuItem value={choice.value} key={choice.value}>{choice.label}</MenuItem>)
														}
													</Select>
												</FormControl>
											</When>
											<Otherwise>
												<FieldComponentSelect
													label={field.name}
													help={field.info}
													selectedValue={store._NEWSLETTER_.fields[field.id] || ''}
													field={field.id}
													onChange={fieldChanged}
												/>
											</Otherwise>
										</Choose>
									</Grid>
								)
							}
						</If>
					</If>
					<If condition={
						!revueData.hasOwnProperty('error')
						&& store._NEWSLETTER_.provider === 'revue'
					}>
						<If condition={revueData.lists.length}>
							<Grid item xs={12}>
								<FormControl>
									<InputLabel shrink>
										{__('List', 'kaliforms')}
									</InputLabel>
									<Select
										value={store._NEWSLETTER_.list}
										multiple={false}
										onChange={e => store._NEWSLETTER_.list = e.target.value}
										input={<BootstrapInput />}
									>
										{revueData.lists.map(list => <MenuItem key={list.id} value={list.id}>{list.name}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
						</If>
						<If condition={revueData.lists.length === 0}>
							<Grid item xs={12}><Typography>{__('There are no lists created in your Revue account. Please make sure you create at least one before configuring this integration.', 'kaliforms')}</Typography></Grid>
						</If>
						<If condition={store._NEWSLETTER_.list !== '' && getRevueList(store._NEWSLETTER_.list) !== false}>
							{
								getRevueList(store._NEWSLETTER_.list).fields.map(field =>
									<Grid item xs={6} key={field.id}>
										<Choose>
											<When condition={field.type === 'enum'}>
												<FormControl>
													<InputLabel shrink>
														{field.name}
													</InputLabel>
													<Select
														value={store._NEWSLETTER_.fields[field.id] || 'subscribed'}
														multiple={false}
														onChange={e => store._NEWSLETTER_.fields[field.id] = e.target.value}
														input={<BootstrapInput />}
													>
														{
															field.choices.map(choice => <MenuItem value={choice.value} key={choice.value}>{choice.label}</MenuItem>)
														}
													</Select>
												</FormControl>
											</When>
											<Otherwise>
												<FieldComponentSelect
													label={field.name}
													help={field.info}
													selectedValue={store._NEWSLETTER_.fields[field.id] || ''}
													field={field.id}
													onChange={fieldChanged}
												/>
											</Otherwise>
										</Choose>
									</Grid>
								)
							}
						</If>
					</If>
					<If condition={
						!moosendData.hasOwnProperty('error')
						&& store._NEWSLETTER_.provider === 'moosend'
					}>
						<If condition={moosendData.lists.length}>
							<Grid item xs={12}>
								<FormControl>
									<InputLabel shrink>
										{__('List', 'kaliforms')}
									</InputLabel>
									<Select
										value={store._NEWSLETTER_.list}
										multiple={false}
										onChange={e => store._NEWSLETTER_.list = e.target.value}
										input={<BootstrapInput />}
									>
										{moosendData.lists.map(list => <MenuItem key={list.id} value={list.id}>{list.name}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
						</If>
						<If condition={moosendData.lists.length === 0}>
							<Grid item xs={12}><Typography>{__('There are no lists created in your Moosend account. Please make sure you create at least one before configuring this integration.', 'kaliforms')}</Typography></Grid>
						</If>
						<If condition={store._NEWSLETTER_.list !== '' && getMoosendListData(store._NEWSLETTER_.list) !== false}>
							{
								getMoosendListData(store._NEWSLETTER_.list).fields.map(field =>
									<Grid item xs={6} key={field.id}>
										<Choose>
											<When condition={field.type === 'enum'}>
												<FormControl>
													<InputLabel shrink>
														{field.name}
													</InputLabel>
													<Select
														value={store._NEWSLETTER_.fields[field.id] || 'subscribed'}
														multiple={false}
														onChange={e => store._NEWSLETTER_.fields[field.id] = e.target.value}
														input={<BootstrapInput />}
													>
														{
															field.choices.map(choice => <MenuItem value={choice.value} key={choice.value}>{choice.label}</MenuItem>)
														}
													</Select>
												</FormControl>
											</When>
											<Otherwise>
												<FieldComponentSelect
													label={field.name}
													help={field.info}
													selectedValue={store._NEWSLETTER_.fields[field.id] || ''}
													field={field.id}
													onChange={fieldChanged}
												/>
											</Otherwise>
										</Choose>
									</Grid>
								)
							}
						</If>
					</If>
					<If condition={
						!getResponseData.hasOwnProperty('error')
						&& store._NEWSLETTER_.provider === 'getresponse'
					}>
						<If condition={getResponseData.lists.length}>
							<Grid item xs={12}>
								<FormControl>
									<InputLabel shrink>
										{__('List', 'kaliforms')}
									</InputLabel>
									<Select
										value={store._NEWSLETTER_.list}
										multiple={false}
										onChange={e => store._NEWSLETTER_.list = e.target.value}
										input={<BootstrapInput />}
									>
										{getResponseData.lists.map(list => <MenuItem key={list.id} value={list.id}>{list.name}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
						</If>
						<If condition={getResponseData.lists.length === 0}>
							<Grid item xs={12}><Typography>{__('There are no lists created in your Get Response account. Please make sure you create at least one before configuring this integration.', 'kaliforms')}</Typography></Grid>
						</If>
						<If condition={store._NEWSLETTER_.list !== '' && getGetresponseList(store._NEWSLETTER_.list) !== false}>
							{
								getGetresponseList(store._NEWSLETTER_.list).fields.map(field =>
									<Grid item xs={6} key={field.id}>
										<Choose>
											<When condition={field.type === 'enum'}>
												<FormControl>
													<InputLabel shrink>
														{field.name}
													</InputLabel>
													<Select
														value={store._NEWSLETTER_.fields[field.id] || 'subscribed'}
														multiple={false}
														onChange={e => store._NEWSLETTER_.fields[field.id] = e.target.value}
														input={<BootstrapInput />}
													>
														{
															field.choices.map(choice => <MenuItem value={choice.value} key={choice.value}>{choice.label}</MenuItem>)
														}
													</Select>
												</FormControl>
											</When>
											<Otherwise>
												<FieldComponentSelect
													label={field.name}
													help={field.info}
													selectedValue={store._NEWSLETTER_.fields[field.id] || ''}
													field={field.id}
													onChange={fieldChanged}
												/>
											</Otherwise>
										</Choose>
									</Grid>
								)
							}
						</If>
						<If condition={store._NEWSLETTER_.list !== '' && getGetresponseList(store._NEWSLETTER_.list).tags.length}>
							<Grid item xs={12}>
								<Typography>
									{__('Do you want to add certain tags to your subscribers? You can create one of the following form fields : Select, Choices, Radio, Checkbox and populate options using the Presets button. If a tag is not found, a new one will be created on form submit.', 'kaliforms')}
								</Typography>
							</Grid>
							<Grid item xs={6}>
								<FieldComponentSelect
									label={__('Tag selector field', 'kaliforms')}
									selectedValue={store._NEWSLETTER_.fields['grTags'] || ''}
									field="grTags"
									onChange={fieldChanged}
								/>
							</Grid>
						</If>
					</If>
					<If condition={
						!campaignMonitorData.hasOwnProperty('error')
						&& store._NEWSLETTER_.provider === 'campaignmonitor'
					}>
						<If condition={campaignMonitorData.lists.length}>
							<Grid item xs={12}>
								<FormControl>
									<InputLabel shrink>
										{__('List', 'kaliforms')}
									</InputLabel>
									<Select
										value={store._NEWSLETTER_.list}
										multiple={false}
										onChange={e => store._NEWSLETTER_.list = e.target.value}
										input={<BootstrapInput />}
									>
										{campaignMonitorData.lists.map(list => <MenuItem key={list.id} value={list.id}>{list.name}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
						</If>
						<If condition={campaignMonitorData.lists.length === 0}>
							<Grid item xs={12}><Typography>{__('There are no lists created in your Campaign Monitor account. Please make sure you create at least one before configuring this integration.', 'kaliforms')}</Typography></Grid>
						</If>
						<If condition={store._NEWSLETTER_.list !== '' && getCampaignMonitorList(store._NEWSLETTER_.list) !== false}>
							{
								getCampaignMonitorList(store._NEWSLETTER_.list).fields.map(field =>
									<Grid item xs={6} key={field.id}>
										<Choose>
											<When condition={field.type === 'enum'}>
												<FormControl>
													<InputLabel shrink>
														{field.name}
													</InputLabel>
													<Select
														value={store._NEWSLETTER_.fields[field.id] || 'subscribed'}
														multiple={false}
														onChange={e => store._NEWSLETTER_.fields[field.id] = e.target.value}
														input={<BootstrapInput />}
													>
														{
															field.choices.map(choice => <MenuItem value={choice.value} key={choice.value}>{choice.label}</MenuItem>)
														}
													</Select>
												</FormControl>
											</When>
											<Otherwise>
												<FieldComponentSelect
													label={field.name}
													help={field.info}
													selectedValue={store._NEWSLETTER_.fields[field.id] || ''}
													field={field.id}
													onChange={fieldChanged}
												/>
											</Otherwise>
										</Choose>
									</Grid>
								)
							}
						</If>
					</If>

					<If condition={
						!sendinblueData.hasOwnProperty('error')
						&& store._NEWSLETTER_.provider === 'sendinblue'
					}>
						<If condition={sendinblueData.lists.length}>
							<Grid item xs={12}>
								<FormControl>
									<InputLabel shrink>
										{__('List', 'kaliforms')}
									</InputLabel>
									<Select
										value={store._NEWSLETTER_.list}
										multiple={false}
										onChange={e => store._NEWSLETTER_.list = e.target.value}
										input={<BootstrapInput />}
									>
										{sendinblueData.lists.map(list => <MenuItem key={list.id} value={list.id}>{list.name}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
							{/* <Grid item xs={2}>
								<FormControl>
									<InputLabel shrink>
										{__('Double opt-in', 'kaliforms')}
									</InputLabel>
									<Select
										value={store._NEWSLETTER_.doubleOptIn || 'yes'}
										multiple={false}
										onChange={e => store._NEWSLETTER_.doubleOptIn = e.target.value}
										input={<BootstrapInput />}
									>
										<MenuItem value="yes">{__('Yes', 'kaliforms')}</MenuItem>
										<MenuItem value="no">{__('No', 'kaliforms')}</MenuItem>
									</Select>
								</FormControl>
							</Grid> */}
						</If>
						<If condition={sendinblueData.lists.length === 0}>
							<Grid item xs={12}><Typography>{__('There are no lists created in your Sendinblue account. Please make sure you create at least one before configuring this integration.', 'kaliforms')}</Typography></Grid>
						</If>
						<If condition={store._NEWSLETTER_.list !== '' && getSendinblueData(store._NEWSLETTER_.list) !== false}>
							{
								getSendinblueData(store._NEWSLETTER_.list).fields.map(field =>
									<Grid item xs={6} key={field.id}>
										<Choose>
											<When condition={field.type === 'enum'}>
												<FormControl>
													<InputLabel shrink>
														{field.name}
													</InputLabel>
													<Select
														value={store._NEWSLETTER_.fields[field.id] || 'subscribed'}
														multiple={false}
														onChange={e => store._NEWSLETTER_.fields[field.id] = e.target.value}
														input={<BootstrapInput />}
													>
														{
															field.choices.map(choice => <MenuItem value={choice.value} key={choice.value}>{choice.label}</MenuItem>)
														}
													</Select>
												</FormControl>
											</When>
											<Otherwise>
												<FieldComponentSelect
													label={field.name}
													help={field.info}
													selectedValue={store._NEWSLETTER_.fields[field.id] || ''}
													field={field.id}
													onChange={fieldChanged}
												/>
											</Otherwise>
										</Choose>
									</Grid>
								)
							}
						</If>
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
