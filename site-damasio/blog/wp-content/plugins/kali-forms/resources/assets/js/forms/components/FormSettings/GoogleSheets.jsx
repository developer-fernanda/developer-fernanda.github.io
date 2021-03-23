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
import LinearProgress from '@material-ui/core/LinearProgress';
import FormGroup from '@material-ui/core/FormGroup';
import is from 'is_js';
const { __ } = wp.i18n;
import axios from 'axios';
import Qs from 'qs';

const GoogleSheets = observer(props => {
	const [googleSheetsData] = React.useState(
		is.falsy(KaliFormsGoogleSheets.sheets) ? { error: 'Something went wrong' } : KaliFormsGoogleSheets.sheets
	);

	const [cells, setCells] = React.useState([]);
	const [noHeaders, setNoHeaders] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	const getSelectedSpreadsheet = id => {
		let spread = googleSheetsData.spreadsheets.filter(spread => spread.id === id);
		return spread[0]
	}

	React.useEffect(() => {
		if (typeof store._GOOGLE_SHEETS_.sheet === 'undefined' || store._GOOGLE_SHEETS_.sheet === 'kf-select-field' || is.empty(store._GOOGLE_SHEETS_.sheet)) {
			return;
		}

		const data = {
			action: 'kaliforms_get_sheet_cells',
			args: {
				spreadsheet: store._GOOGLE_SHEETS_.spreadsheet,
				sheet: store._GOOGLE_SHEETS_.sheet,
				nonce: KaliFormsObject.ajax_nonce,
			}
		}
		setLoading(true);
		axios.post(KaliFormsObject.ajaxurl, Qs.stringify(data))
			.then(r => {
				if (r.data.success && is.array(r.data.content)) {
					setNoHeaders(false);
					setCells([...r.data.content]);
				}

				if (is.string(r.data.content) && r.data.content === 'no-headers') {
					setNoHeaders(true);
				}

				setLoading(false);
			})
			.catch(e => {
				console.log(e);
			});

		return () => {
			setNoHeaders(false);
			setCells([]);
		};

	}, [store._GOOGLE_SHEETS_.sheet])

	const sanitizeName = (idx, name) => {
		let sanitizedName = name.replace(/\s/g, '').toLowerCase();
		sanitizedName = is.empty(sanitizedName) ? 'empty' : sanitizedName;
		return sanitizedName + '|' + idx;
	}

	const fieldChanged = data => {
		store._GOOGLE_SHEETS_.fields[data.field] = data.value
	}

	return (
		<React.Fragment>
			<Container maxWidth="md">
				<SectionTitle title={__('Google sheets settings', 'kaliforms')} />
				<Choose>
					<When condition={googleSheetsData.hasOwnProperty('error')}>
						<Grid container direction="row" spacing={3}>
							<Grid item xs={12}>
								<Typography>{__('Something went wrong, please authenticate with Google.', 'kaliforms')}</Typography>
							</Grid>
						</Grid>
					</When>
					<Otherwise>
						<Grid container direction="row" spacing={3}>
							<Grid item xs={6}>
								<FormGroup row>
									<FormControlLabel
										control={
											<Checkbox
												checked={store._GOOGLE_SHEETS_.enabled === '1'}
												onChange={e => store._GOOGLE_SHEETS_.setEnabled(e.target.checked ? '1' : '0')}
											/>
										}
										label={__('Enable Google Sheets Integration', 'kaliforms')}
									/>
								</FormGroup>
							</Grid>
						</Grid>

						<If condition={store._GOOGLE_SHEETS_.enabled === '1'}>
							<Grid container direction="row" spacing={3}>
								<Grid item xs={6}>
									<FormControl>
										<InputLabel shrink>
											{__('Spreadsheet', 'kaliforms')}
										</InputLabel>
										<Select
											value={store._GOOGLE_SHEETS_.spreadsheet || 'kf-select-field'}
											multiple={false}
											onChange={e => {
												store._GOOGLE_SHEETS_.sheet = 'kf-select-field';
												store._GOOGLE_SHEETS_.fields = {};
												store._GOOGLE_SHEETS_.setSelectedSpreadsheet(e.target.value)
											}}
											input={<BootstrapInput />}
										>
											<MenuItem value="kf-select-field">{__('Select a spreadsheet', 'kaliforms')}</MenuItem>
											{googleSheetsData.spreadsheets.map(spreadsheet => <MenuItem key={spreadsheet.id} value={spreadsheet.id}>{spreadsheet.name}</MenuItem>)}
										</Select>
									</FormControl>
								</Grid>

								<If condition={
									typeof store._GOOGLE_SHEETS_.spreadsheet !== 'undefined'
									&& store._GOOGLE_SHEETS_.spreadsheet !== 'kf-select-field'
								}>
									<Grid item xs={6}>
										<FormControl>
											<InputLabel shrink>
												{__('Sheet', 'kaliforms')}
											</InputLabel>
											<Select
												value={store._GOOGLE_SHEETS_.sheet || 'kf-select-field'}
												multiple={false}
												onChange={e => {
													store._GOOGLE_SHEETS_.fields = {};
													store._GOOGLE_SHEETS_.setSelectedSheet(e.target.value);
												}}
												input={<BootstrapInput />}
											>
												<MenuItem value="kf-select-field">{__('Select a sheet', 'kaliforms')}</MenuItem>
												{getSelectedSpreadsheet(store._GOOGLE_SHEETS_.spreadsheet).sheets.map(sheet => <MenuItem key={sheet.id} value={sheet.name}>{sheet.name}</MenuItem>)}
											</Select>
										</FormControl>
									</Grid>
								</If>
							</Grid>
							<If condition={loading}>
								<Grid container direction="row" spacing={3}>
									<Grid item xs={12}>
										<LinearProgress />
									</Grid>
								</Grid>
							</If>
							<If condition={cells.length}>
								<Grid container direction="row" spacing={3}>
									{
										cells.map(field =>
											<Grid item xs={6} key={sanitizeName(field.index, field.name)}>
												<FieldComponentSelect
													label={is.empty(field.name) ? __('Cell has no label', 'kaliforms') : field.name}
													selectedValue={store._GOOGLE_SHEETS_.fields[sanitizeName(field.index, field.name)] || ''}
													field={sanitizeName(field.index, field.name)}
													onChange={fieldChanged}
												/>
											</Grid>
										)
									}
								</Grid>
							</If>
							<If condition={!cells.length && noHeaders}>
								<Grid container direction="row" spacing={3}>
									<Grid item xs={12}>
										{__('Please make sure the spreadsheet has the table headers created', 'kaliforms')}
									</Grid>
								</Grid>
							</If>
						</If>
					</Otherwise>
				</Choose>
			</Container>
		</React.Fragment>
	)
})

export default GoogleSheets;
