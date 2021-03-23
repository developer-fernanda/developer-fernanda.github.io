import React from 'react';
import Grid from '@material-ui/core/Grid';
import { store } from "./../../store/store";
import { observer } from "mobx-react";
import presetsStyles from './PresetsStyles'
import Typography from '@material-ui/core/Typography';
import Checkbox from './../Misc/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from './../Misc/MinimalButton'
import { useEffect } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Select from '@material-ui/core/Select';
import BootstrapInput from './../BootstrapInput';
import MenuItem from '@material-ui/core/MenuItem';
import MathFormulas from './../../utils/mathFormulas';
const { __ } = wp.i18n;
require('./../../utils/sprintf');

const MathHelper = props => {
	const classes = presetsStyles();
	const [selectedHelper, setSelectedHelper] = React.useState('');
	const [totalField, setTotalField] = React.useState(null);
	const [selectedFields, setSelectedFields] = React.useState([]);
	const [intermediateSelect, setIntermediateSelect] = React.useState('');
	const [activeStep, setActiveStep] = React.useState(0);

	useEffect(() => {
		setSelectedFields([]);
	}, [selectedHelper])

	/**
	 * Update the Form Calculation editor
	 */
	const updateField = () => {
		let data = getFormula();
		let eq = buildEquation(data.formula);

		store._UI_.bottomDrawerCallback({ formula: eq, name: data.name });

		closeDrawer();
		resetDrawer();
	}

	/**
	 * Close the drawer
	 */
	const closeDrawer = () => {
		store._UI_.setBottomDrawer(false);
		store._UI_.setBottomDrawerCallback(null);
		store._UI_.setBackDropComponent(null);
	}

	/**
	 * Reset local state
	 */
	const resetDrawer = () => {
		setActiveStep(0);
		setIntermediateSelect('');
		setSelectedHelper('');
		setSelectedFields([]);
	}

	const getFormula = () => {
		let formula = '';
		MathFormulas.map(e => {
			if (e.id === selectedHelper) {
				formula = e.formula;
				name = e.label;
			}
		})

		return { formula, name };
	}

	/**
	 * Build equation based on the helper
	 */
	const buildEquation = (formula) => {
		let eq = '';
		let fields = [];
		selectedFields.map(el => fields.push(el.name));
		switch (selectedHelper) {
			case 'sum':
			case 'subtract':
			case 'divide':
			case 'multiply':
			case 'minutesToSeconds':
			case 'minutesToHours':
			case 'secondsToHour':
			case 'secondsToMinute':
				eq = sprintf(formula, totalField.name, fields);
				break;
			case 'arithmeticAverage':
				eq = sprintf(formula, totalField.name, fields, fields.length);
				break;
			case 'speed':
			case 'dayDifference':
			case 'bmiImperial':
			case 'bmiMetric':
				if (fields.length < 2) {
					eq = '';
					break;
				}
				eq = sprintf(formula, totalField.name, ...fields);
				break;
			case 'hourMinuteSeconds':
				if (fields.length < 3) {
					eq = '';
					break;
				}
				eq = sprintf(formula, totalField.name, ...fields);
				break;
			case 'pace':
			case 'runningTime':
				if (fields.length < 4) {
					eq = '';
					break;
				}
				eq = sprintf(formula, totalField.name, ...fields);
				break;
			case 'runningDistance':
				if (fields.length < 6) {
					eq = '';
					break;
				}
				eq = sprintf(formula, totalField.name, ...fields);
				break;
			default:
				break;
		}

		return eq;
	}

	/**
	 * Available fields for "selection"
	 */
	const availableFields = [];
	store._FIELD_COMPONENTS_.fieldComponents.map(field => {
		if (['fileUpload', 'button', 'submitButton', 'freeText', 'divider', 'grecaptcha', 'pageBreak', 'smartTextOutput'].includes(field.id)) {
			return;
		}

		availableFields.push(
			{ name: field.properties.name, id: field.internalId, type: field.id }
		)
	})

	/**
	 * Checked state status of the fields
	 * @param {*} value
	 */
	const checkedState = (value) => {
		let state = false;
		selectedFields.map(e => {
			if (e.id === value) {
				state = true;
			}
		});
		return state;
	};
	/**
	 * Are all the fields selected?
	 */
	const selectedAllFields = () => {
		return availableFields.length - 1 === selectedFields.length
	};
	/**
	 * Select all fields
	 *
	 * @param {*} e
	 */
	const selectAll = (e) => {
		let options = [];
		if (e.target.checked) {
			availableFields.map(e => {
				if (e.id === totalField.id) {
					return;
				}
				options.push({ id: e.id, name: e.name })
			});
			setSelectedFields(options);
			return;
		}

		setSelectedFields([]);
	}
	/**
	 * Checkbox clicked ( handles the selection of form fields)
	 * @param {*} e
	 * @param {*} id
	 * @param {*} name
	 */
	const checkBoxClicked = (e, id, name) => {
		let newOption = {
			id,
			name
		};

		let max = -1;
		MathFormulas.map(el => {
			if (el.id === selectedHelper) {
				max = el.args;
			}
		})

		let options = [...selectedFields]
		if (e.target.checked) {
			if (max === -1 || options.length < max) {
				options.push(newOption)
			}
		} else {
			options = options.filter(e => e.id !== id);
		}

		setSelectedFields(options)
	}
	/**
	 * Total field check action
	 */
	const checkedTotalField = (el) => {
		let state = false;

		if (totalField !== null && totalField.id === el) {
			state = true;
		}

		return state;

	}
	/**
	 * Is this field clicked?
	 */
	const totalFieldClicked = (evt, id, name) => {
		evt.target.checked ? setTotalField({ id, name }) : setTotalField(null);
	}

	const argsCount = () => {
		let max = -1;
		MathFormulas.map(el => {
			if (el.id === selectedHelper) {
				max = el.args;
			}
		})
		return max;
	}

	const argsHelper = () => {
		let helper = false;
		MathFormulas.map(el => {
			if (el.id === selectedHelper && el.hasOwnProperty('argsHelper')) {
				helper = el.argsHelper;
			}
		})
		return helper;
	}

	const goToNextStep = () => {
		let currentField = availableFields[intermediateSelect];
		let options = selectedFields;
		let newOption = {
			id: currentField.id,
			name: currentField.name,
		}

		if (options.length && typeof options[activeStep] !== 'undefined') {
			options[activeStep] = newOption;
		} else {
			options.push(newOption);
		}
		setIntermediateSelect('');
		setSelectedFields([...options]);

		if (activeStep + 1 === argsHelper().length) {
			updateField();
			return;
		}

		setActiveStep(activeStep + 1);
	}

	const goToPrevStep = () => {
		let prevFieldIndex = 0;
		availableFields.map((e, idx) => {
			if (selectedFields[selectedFields.length - 1].id === e.id) {
				prevFieldIndex = idx;
			}
		})

		setIntermediateSelect(prevFieldIndex);
		setActiveStep(activeStep - 1);
	}

	return (
		<React.Fragment>
			<Grid container>
				<Grid item xs={3}>
					<Typography variant={'h3'}>{__('Math helper', 'kaliforms')}</Typography>
					<p>
						{__('We will try to help you in creating your first form calculation!', 'kaliforms')}
					</p>
				</Grid>
				<Grid item xs={3}>
					<ul className={classes.selectableList}>
						{MathFormulas.map(e => (
							<li key={e.id}
								className={selectedHelper === e.id ? classes.listItemActive : ''}
								onClick={evt => setSelectedHelper(e.id)}>
								{e.label}
							</li>
						))}
					</ul>
				</Grid>
				<Grid item xs={2} className={classes.differentBg}>
					<If condition={selectedHelper !== ''}>
						<ul className={classes.selectableList + ' ' + classes.smallerList}>
							<li className={classes.smallMargin} style={{ marginLeft: -8 }}>
								{__('Select total field', 'kaliforms')}
							</li>
							{availableFields.map(field => (
								<li key={field.id} className={classes.smallMargin}>
									<FormControlLabel
										control={
											<Checkbox
												disableRipple={false}
												size={'small'}
												checked={checkedTotalField(field.id)}
												onChange={e => totalFieldClicked(e, field.id, field.name)}
											/>
										}
										label={field.name}
									/>
								</li>
							))}
						</ul>
					</If>
				</Grid>
				<Grid item xs={4}>
					<If condition={selectedHelper !== '' && totalField !== null}>
						<Choose>
							<When condition={argsCount() > -1 && argsHelper() !== false}>
								<Stepper className={classes.stepperRoot} activeStep={activeStep} orientation="vertical">
									{
										argsHelper().map((label, index) =>
											<Step key={label + index}>
												<StepLabel>{label}</StepLabel>
												<StepContent>
													<Select
														value={intermediateSelect}
														multiple={false}
														onChange={e => setIntermediateSelect(e.target.value)}
														input={<BootstrapInput />}
													>
														{availableFields.map((field, fieldIdx) => {
															if (field.id === totalField.id) {
																return;
															}

															return (
																<MenuItem key={field.id} value={fieldIdx}>
																	{field.name}
																</MenuItem>
															)
														})}
													</Select>
													<If condition={activeStep > 0}>
														<Button className={classes.nextButton} onClick={e => goToPrevStep()}>
															{__('Back', 'kaliforms')}
														</Button>
													</If>
													<Button className={classes.nextButton} onClick={e => goToNextStep()}>
														<If condition={activeStep + 1 === argsHelper().length}>
															{__('Finish', 'kaliforms')}
														</If>
														<If condition={activeStep + 1 < argsHelper().length}>
															{__('Next', 'kaliforms')}
														</If>
													</Button>
												</StepContent>
											</Step>
										)
									}
								</Stepper>
							</When>
							<Otherwise>
								<ul className={classes.selectableList + ' ' + classes.smallerList}>
									<li className={classes.smallMargin} style={{ marginLeft: -8 }}>
										{__('Fields to calculate', 'kaliforms')}
									</li>
									<li className={classes.smallMargin}>
										<FormControlLabel
											control={
												<Checkbox
													disableRipple={false}
													size={'small'}
													checked={selectedAllFields()}
													onChange={e => selectAll(e)}
												/>
											}
											label={__('Select all', 'kaliforms')}
										/>
									</li>
									{availableFields.map(field => {
										if (field.id === totalField.id) {
											return;
										}

										return (
											<li key={field.id} className={classes.smallMargin}>
												<FormControlLabel
													control={
														<Checkbox
															disableRipple={false}
															size={'small'}
															checked={checkedState(field.id)}
															onChange={e => checkBoxClicked(e, field.id, field.name)}
														/>
													}
													label={field.name}
												/>
											</li>
										)
									})}
								</ul>

								<Button onClick={e => updateField()} className={classes.importButton}>{__('Create Calculation', 'kaliforms')}</Button>
							</Otherwise>
						</Choose>
					</If>
				</Grid>
			</Grid>
		</React.Fragment>
	)
}

export default observer(MathHelper);
