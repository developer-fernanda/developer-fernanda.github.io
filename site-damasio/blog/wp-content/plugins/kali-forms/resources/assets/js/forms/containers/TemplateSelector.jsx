import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import Qs from 'qs';
import React, { useState } from 'react';
import { observer } from "mobx-react";
import { store } from "./../store/store";
import { makeStyles, withTheme } from '@material-ui/core/styles';
import TemplateCard from './../components/TemplateCard/TemplateCard'
import StylesCard from './../components/TemplateCard/StylesCard'
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from './../components/Misc/Checkbox';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import Pagination from '@material-ui/lab/Pagination'
import Icon from '@material-ui/core/Icon';
const { __ } = wp.i18n;

const templateSelectorStyles = makeStyles(theme => {
	return {
		button: {
			color: '#fff',
			background: 'linear-gradient(101.31deg, #55FA97 0%, #9FF277 100%)',
			width: 385,
			textAlign: 'center',
			display: 'block',
			margin: '0 auto',
			marginTop: theme.spacing(1),
			marginBottom: theme.spacing(1),
			paddingTop: theme.spacing(2),
			paddingBottom: theme.spacing(2),
		},
		paper: {
			marginTop: theme.spacing(2),
			padding: theme.spacing(3),
		},
		cardTitle: {
			minHeight: 55,
		},
		cardBody: {
			minHeight: 75,
		},
		importLoader: {
			display: 'block',
			width: '100%',
			textAlign: 'center',
			padding: theme.spacing(3),
		},
		formControl: {
			marginBottom: theme.spacing(2),
		},
		radio: {
			marginBottom: theme.spacing(2),
			minWidth: 240,
		},
		styleThumb: {
			maxWidth: 240,
			display: 'block',
			margin: '0 auto'
		},
		styleCaption: {
			display: 'block',
			textAlign: 'center',
		},
		radioContainer: {
			marginTop: theme.spacing(2)
		},
		title: {
			display: 'inline-block',
			marginBottom: theme.spacing(3),
		},
		subtitle: {
			fontSize: 14,
			lineHeight: '20px',
			maxWidth: 280,
			marginBottom: theme.spacing(3)
		},
		toolbar: {
			marginBottom: theme.spacing(3)
		},
		toolbarButtons: {
			color: theme.palette.text.main,
			textTransform: 'none',
			fontSize: 14,
			fontStyle: 'normal',
			fontWeight: 'normal',
			paddingLeft: 0,
			paddingRight: 0,
			marginRight: theme.spacing(2),
			minWidth: 0,
			'&:last-of-type': {
				marginRight: 0,
			},
			'&:hover': {
				color: theme.palette.primary.main,
				background: 'transparent'
			},
			'& .MuiIcon-root': {
				fontSize: '1.3em',
				marginRight: theme.spacing(.8),
			}
		},
		importStuff: {
			fontWeight: 500,
		}
	}
});

const TemplateSelector = observer((props) => {
	const classes = templateSelectorStyles(props);
	const [selectedCard, setSelectedCard] = useState(false);
	const [predefinedForms] = useState(KaliFormsObject.predefinedForms);
	const [selectedCardKey, setSelectedCardKey] = useState(null);
	const [dataLoaded, setDataLoaded] = useState(false);
	const [data, setData] = useState(null);
	const [dataToImport, setDataToImport] = useState([]);
	const [styleToApply, setStyleToApply] = useState('theme');
	const [filter, setFilter] = useState('all');
	const [stylesPage, setStylesPage] = useState(1);

	const handleImportData = (key, value) => {
		let currentState = [...dataToImport];
		if (value && !currentState.includes(key)) {
			currentState.push(key);
		}

		if (!value && currentState.includes(key)) {
			currentState = currentState.filter(e => e !== key);
		}

		setDataToImport([...currentState]);
	}

	/**
	 * Form selection
	 *
	 * @param {*} key
	 * @memberof TemplateSelector
	 */
	const selectForm = (key) => {
		setSelectedCard(true);
		setSelectedCardKey(key);
		setDataLoaded(false);
		const data = { action: 'kaliforms_get_form_data', args: { id: key, nonce: KaliFormsObject.ajax_nonce } };

		axios.post(KaliFormsObject.ajaxurl, Qs.stringify(data))
			.then(r => {
				setDataLoaded(true);
				setDataToImport(['emails', 'conditionalLogic', 'layout', 'settings', 'formCalculator']);
				setData(r.data);
			})
			.catch(e => {
				console.log(e);
			});
	}

	/**
	 * Go back to the demo selection
	 */
	const goBackToCards = () => {
		setDataLoaded(false);
		setDataToImport([]);
		setData(null);
		setSelectedCard(false);
		setSelectedCardKey(null);
	}

	/**
	 * Check if we need to alert the user about SMTP settings
	 */
	const checkSMTP = () => {
		let shouldWeAlert = false;
		let notif = {};
		store._GLOBAL_NOTIFICATIONS_.notifications.map(notification => {
			if (notification.id === 'email_smtp_settings') {
				shouldWeAlert = true;
				notif = notification;
			}
		})
		if (!shouldWeAlert) {
			return importData();
		}

		store._CONFIRMATION_DIALOG_.setTitle(__('SMTP Settings', 'kaliforms'));
		store._CONFIRMATION_DIALOG_.setMessage(__('We noticed that you did not setup your SMTP settings. We strongly suggest that you set this up before publishing your form as it will increase the deliverability of your email notifications.', 'kaliforms'));
		store._CONFIRMATION_DIALOG_.setAdditionalButton({ action: notif.action, actionType: notif.actionType, buttonText: __('Set up SMTP now', 'kaliforms') });
		store._CONFIRMATION_DIALOG_.setHideCancelButton(true);
		store._CONFIRMATION_DIALOG_.setAction(importData)
		store._CONFIRMATION_DIALOG_.setActionProps({})
		store._CONFIRMATION_DIALOG_.setState(true);
	}

	/**
	 * Import data
	 *
	 * @param {*} data
	 * @memberof TemplateSelector
	 */
	const importData = () => {
		dataToImport.map(e => {
			if (e === 'layout') {
				store._GRID_.setGrid(data.grid);
				store._FIELD_COMPONENTS_.addMultipleComponents(data.field_components);
			}

			if (e === 'emails' && data.hasOwnProperty('emails')) {
				store._EMAILS_.setEmails(data.emails);
			}

			if (e === 'settings') {
				document.querySelector('#title').value = data.name;
				store._FORM_INFO_.formName = data.name
				store._FORM_INFO_.setFormInfo(data.form_info);
			}

			if (e === 'conditionalLogic' && data.hasOwnProperty('conditional_logic') && data.conditional_logic !== null) {
				store._FORM_INFO_.setConditionalLogic(data.conditional_logic)
			}

			if (e === 'formCalculator' && data.hasOwnProperty('form_calculator') && data.form_calculator !== null) {
				if (typeof data.form_calculator !== 'string') {
					return
				}
				store._FORM_INFO_.calculator = data.form_calculator
			}
		})

		store._FORM_STYLES_.setSelectedStyle(styleToApply);
		store._UI_.setTemplateSelecting(false);
	}

	const setDemoFilters = key => {
		setFilter(key);
	}

	const demosToShow = [];
	Object.keys(predefinedForms).map((key) => {
		if (filter === 'all') {
			demosToShow.push({ ...predefinedForms[key], key })
		}
		if (filter === 'free' && !predefinedForms[key].premium) {
			demosToShow.push({ ...predefinedForms[key], key })
		}
		if (filter === 'premium' && predefinedForms[key].premium) {
			demosToShow.push({ ...predefinedForms[key], key })
		}
	});

	return (
		<React.Fragment>
			<Container className={classes.paper}>
				<If condition={!selectedCard}>
					<Typography variant="h4" className={classes.title} >{__('One-Click Forms', 'kaliforms')}</Typography>
					<Typography variant="subtitle1" className={classes.subtitle}>
						{__('We prepared some templates for you! You can import one of them or create your own from scratch.', 'kaliforms')}
					</Typography>
					<Grid container direction="row" className={classes.toolbar}>
						<Grid item xs={6}>
							{/* <Button variant="text" className={classes.toolbarButtons}>
								<Icon className={'icon-refresh'} /> {__('Refresh templates', 'kaliforms')}
							</Button> */}
							<Button variant="text" className={classes.toolbarButtons} onClick={() => window.open('https://www.kaliforms.com/contact-us?utm_source=formBuilder&utm_campaign=userInterests&utm_medium=suggestNewTemplateButton&department=tech', '_blank')}>
								<Icon className={'icon-suggest'} /> {__('Suggest a new template', 'kaliforms')}
							</Button>
						</Grid>
						<Grid item xs={6} style={{ textAlign: 'right' }}>
							{__('Show: ', 'kaliforms')}
							<Button
								variant="text"
								className={classes.toolbarButtons}
								style={{
									marginLeft: props.theme.spacing(2),
									color: filter === 'all' ? props.theme.palette.primary.main : props.theme.palette.text.main
								}}
								onClick={() => setDemoFilters('all')}
							>
								{__('All', 'kaliforms')}
							</Button>
							<Button
								variant="text"
								className={classes.toolbarButtons}
								style={{
									color: filter === 'free' ? props.theme.palette.primary.main : props.theme.palette.text.main
								}}
								onClick={() => setDemoFilters('free')}
							>
								{__('Free', 'kaliforms')}
							</Button>
							<Button
								variant="text"
								className={classes.toolbarButtons}
								style={{
									color: filter === 'premium' ? props.theme.palette.primary.main : props.theme.palette.text.main
								}}
								onClick={() => setDemoFilters('premium')}
							>
								<Icon className={'icon-star'} /> {__('Premium', 'kaliforms')}
							</Button>
						</Grid>
					</Grid>
					<Grid container direction="row" spacing={4}>
						<Grid item xs={3}>
							<TemplateCard
								title={__('Blank', 'kaliforms')}
								description={__('Start a new form from scratch', 'kaliforms')}
								blank={true}
								thumb={false}
							>
							</TemplateCard>
						</Grid>
						{
							demosToShow.map((el, index) => (
								<Grid item xs={3} key={el.key + index}>
									<TemplateCard
										blank={false}
										title={el.name}
										description={el.description}
										predefinedFormKey={el.key}
										selectForm={selectForm}
										demoUrl={el.demo}
										pro={el.pro}
										thumb={typeof el.thumb !== 'undefined' ? el.thumb : KaliFormsObject.assetsUrl + '/img/predefined-forms/placeholder-form.png'}
									>

									</TemplateCard>
								</Grid>
							))
						}
					</Grid>
				</If>
				<If condition={selectedCard}>
					<If condition={!selectedCard || selectedCardKey === null || !dataLoaded || data === null}>
						<Box className={classes.importLoader}>
							<CircularProgress />
						</Box>
					</If>
					<If condition={selectedCard && selectedCardKey !== null && dataLoaded && data !== null}>
						<Box>
							<Typography variant="h4" className={classes.title} style={{ display: 'block' }}>
								{data.name}
								<IconButton style={{ float: 'right' }} aria-label="settings" onClick={() => goBackToCards()}>
									<ArrowBackIcon />
								</IconButton>
							</Typography>
							<Typography variant="subtitle1" className={classes.subtitle}>
								{predefinedForms[selectedCardKey].description}
							</Typography>

							<FormControl component="fieldset" className={classes.formControl}>
								<Box mb={2} className={classes.importStuff}>
									{__('Import this information for your form', 'kaliforms')}
								</Box>
								<FormGroup row>
									<FormControlLabel
										control={<Checkbox checked={dataToImport.includes('layout')} onChange={(e) => handleImportData('layout', e.target.checked)} value="layout" />}
										label={__('Layout', 'kaliforms')}
									/>
									<FormControlLabel
										control={<Checkbox checked={dataToImport.includes('emails')} onChange={(e) => handleImportData('emails', e.target.checked)} value="emails" />}
										label={__('Notifications', 'kaliforms')}
									/>
									<FormControlLabel
										control={<Checkbox checked={dataToImport.includes('settings')} onChange={(e) => handleImportData('settings', e.target.checked)} value="settings" />}
										label={__('Settings', 'kaliforms')}
									/>
									<FormControlLabel
										control={<Checkbox checked={dataToImport.includes('conditionalLogic')} onChange={(e) => handleImportData('conditionalLogic', e.target.checked)} value="conditionalLogic" />}
										label={__('Conditional logic', 'kaliforms')}
									/>
									<FormControlLabel
										control={<Checkbox checked={dataToImport.includes('formCalculator')} onChange={(e) => handleImportData('formCalculator', e.target.checked)} value="formCalculator" />}
										label={__('Form calculator', 'kaliforms')}
									/>
								</FormGroup>
							</FormControl>

							<FormControl component="fieldset" className={classes.formControl}>
								<Box mb={2} className={classes.importStuff}>
									{__('Select the visual style', 'kaliforms')}
								</Box>
								<Grid container direction="row" spacing={4}>
									{store._FORM_STYLES_.getStylesPage(stylesPage).map(e => (
										<Grid item xs={3} key={e.id}>
											<StylesCard
												title={e.label}
												thumb={e.thumb}
												styleToApply={styleToApply}
												onChangeCallback={setStyleToApply}
												value={e.id}
											>
											</StylesCard>
										</Grid>
									))}
								</Grid>
								<If condition={store._FORM_STYLES_.pages > 1}>
									<Box m={1} justifyContent="flex-end">
										<Pagination
											style={{ float: 'right' }}
											count={store._FORM_STYLES_.pages}
											onChange={(e, idx) => setStylesPage(idx)}
											shape="rounded"
										/>
									</Box>
								</If>
							</FormControl>

							<Button
								size="large"
								className={classes.button}
								onClick={() => checkSMTP()}
							>
								{__('Import', 'kaliforms')}
							</Button>

						</Box>
					</If>
				</If>
			</Container>
		</React.Fragment>
	)
})

export default withTheme(TemplateSelector)
