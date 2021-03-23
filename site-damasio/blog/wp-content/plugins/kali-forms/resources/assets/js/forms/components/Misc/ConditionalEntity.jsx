import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { observer } from "mobx-react";
import React from 'react';
import BootstrapInput from './../BootstrapInput';
import FieldComponentSelect from './../HubSpotIntegration/FieldComponentSelect';
import { store } from './../../store/store';
const { __ } = wp.i18n;
const ConditionalEntity = observer((props) => {
	const [conditionalLogic, setConditionalLogic] = React.useState(
		props.conditions.conditionalLogic || 'always'
	);
	const [conditions, setConditions] = React.useState(
		props.conditions.conditions || [{ conditionalIndex: 0, formField: '', formFieldType: '', condition: 'is', value: '' }]
	);
	const [ref, setRef] = React.useState(props.changer || '');
	const selectableTypes = ['select', 'dropdown', 'checkbox', 'radio', 'choices', 'imageRadio'];

	const selectChange = obj => {
		conditions[obj.field].formField = obj.value;
		conditions[obj.field].formFieldType = obj.type;

		if (selectableTypes.includes(obj.type)) {
			conditions[obj.field].value = '';
		}

		setConditions([...conditions])
	}

	const changeFieldCondition = (idx, value) => {
		conditions[idx].condition = value;
		setConditions([...conditions])
	}

	const changedValue = (idx, value) => {
		conditions[idx].value = value;
		setConditions([...conditions])
	}

	const addCondition = () => {
		setConditions([...conditions, { conditionalIndex: conditions.length, formField: '', formFieldType: '', condition: 'is', value: '' }])
	}

	const removeCondition = idx => {
		let currentState = conditions.filter((condition, index) => idx !== index)
		setConditions([...currentState]);
	}

	const setDefaultCondition = () => {
		setConditions([{ conditionalIndex: conditions.length, formField: '', formFieldType: '', condition: 'is', value: '' }]);
	}

	React.useEffect(() => {
		props.onChange({ conditions, conditionalLogic });
	}, [conditions, conditionalLogic])

	React.useEffect(() => {
		if (props.changer !== ref) {
			setConditionalLogic(props.conditions.conditionalLogic);
			setConditions(props.conditions.conditions);
			setRef(props.changer)
		}
	}, [props.conditions])

	return (
		<React.Fragment>
			<Grid container direction="row" spacing={4} internalref={ref}>
				<Grid item xs={12}>
					<FormControl>
						<InputLabel shrink>
							{props.label}
						</InputLabel>
						<Select
							multiple={false}
							input={<BootstrapInput />}
							value={conditionalLogic || 'always'}
							onChange={e => setConditionalLogic(e.target.value)}
							fullWidth={true}
						>
							<MenuItem value="always">
								{__('Always', 'kaliforms')}
							</MenuItem>
							<MenuItem value="any">
								{__('If any of the fields', 'kaliforms')}
							</MenuItem>
							<MenuItem value="all">
								{__('If all fields', 'kaliforms')}
							</MenuItem>
						</Select>
					</FormControl>
				</Grid>
			</Grid>
			<If condition={conditionalLogic !== 'always' && conditions.length}>
				{conditions.map((condition, idx) => (
					<Grid container direction="row" key={idx} spacing={3}>
						<Grid item xs={3}>
							<FieldComponentSelect
								label={__('Form field', 'kaliforms')}
								field={idx}
								selectedValue={condition.formField || ''}
								onChange={selectChange} />
						</Grid>
						<Grid item xs={3}>
							<FormControl>
								<InputLabel shrink>
									{__('Operator', 'kaliforms')}
								</InputLabel>
								<Select
									multiple={false}
									input={<BootstrapInput />}
									value={condition.condition}
									onChange={e => changeFieldCondition(idx, e.target.value)}
									fullWidth={true}
								>
									<MenuItem value='is'>{__('Is', 'kaliforms')}</MenuItem>
									<MenuItem value='not'>{__('Is not', 'kaliforms')}</MenuItem>
									<MenuItem value='greater'>{__('Greater than', 'kaliforms')}</MenuItem>
									<MenuItem value='less'>{__('Less than', 'kaliforms')}</MenuItem>
									<MenuItem value='contains'>{__('Contains', 'kaliforms')}</MenuItem>
									<MenuItem value='starts'>{__('Starts', 'kaliforms')}</MenuItem>
									<MenuItem value='ends'>{__('Ends', 'kaliforms')}</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={3}>
							<FormControl>
								<InputLabel shrink>
									{__('Value', 'kaliforms')}
								</InputLabel>
								<Choose>
									<When condition={selectableTypes.includes(condition.formFieldType)}>
										<Select
											multiple={false}
											input={<BootstrapInput />}
											value={condition.value}
											onChange={e => changedValue(idx, e.target.value)}
											fullWidth={true}
										>
											{
												typeof store._FIELD_COMPONENTS_.fieldConditionersByName[condition.formField] !== 'undefined'
												&& store._FIELD_COMPONENTS_.fieldConditionersByName[condition.formField].values.map((e, index) => (
													<MenuItem key={index + e.value} value={e.value}>
														{e.label}
													</MenuItem>
												))
											}
										</Select>
									</When>
									<Otherwise>
										<BootstrapInput
											value={condition.value}
											onChange={e => changedValue(idx, e.target.value)}
											fullWidth={true}
										/>
									</Otherwise>
								</Choose>
							</FormControl>
						</Grid>

						<Grid item xs={3} style={{ paddingTop: 38 }}>
							<Button
								aria-label={__('Add condition', 'kaliforms')}
								variant="text"
								onClick={() => addCondition()}
							>
								<Icon className="icon-add-new" />
							</Button>
							<Button
								aria-label={__('Remove condition', 'kaliforms')}
								variant="text"
								onClick={() => conditions.length === 1 ? setDefaultCondition() : removeCondition(idx)}
							>
								<Icon className="icon-remove" />
							</Button>
						</Grid>
					</Grid>
				))}
			</If>
		</React.Fragment>
	)
});
export default ConditionalEntity;
