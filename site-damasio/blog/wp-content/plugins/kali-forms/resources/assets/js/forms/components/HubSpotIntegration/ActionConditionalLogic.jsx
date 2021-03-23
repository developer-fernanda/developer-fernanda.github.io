import React from 'react';
import FieldComponentSelect from './FieldComponentSelect'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import BootstrapInput from './../BootstrapInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
const { __ } = wp.i18n;
const ActionConditionalLogic = (props) => {
	const selectChange = (data) => {
		let currentState = props.conditionalLogicConditions;
		currentState[data.field].formField = data.value;
		props.setConditionalLogicConditions([...currentState]);
	}
	const changedCondition = data => {
		props.setConditionalLogic(data);
	}

	const changeFieldCondition = (idx, value) => {
		let currentState = props.conditionalLogicConditions;
		currentState[idx].condition = value;
		props.setConditionalLogicConditions([...currentState]);
	}
	const changedValue = (idx, value) => {
		let currentState = props.conditionalLogicConditions;
		currentState[idx].value = value;
		props.setConditionalLogicConditions([...currentState]);
	}
	const setDefaultCondition = () => {
		let currentState = props.conditionalLogicConditions;
		props.setConditionalLogicConditions(
			[
				{ conditionalIndex: currentState.length, formField: '', condition: 'is', value: '' }
			]
		)
	}
	const addCondition = () => {
		let currentState = props.conditionalLogicConditions;
		props.setConditionalLogicConditions(
			[
				...currentState,
				{ conditionalIndex: currentState.length, formField: '', condition: 'is', value: '' }
			]
		)
	}
	const removeCondition = (idx) => {
		let currentState = props.conditionalLogicConditions;
		currentState.splice(idx, 1);
		props.setConditionalLogicConditions([...currentState]);
	}
	return (
		<div style={{ marginBottom: 30 }}>
			<Grid container direction="row" spacing={4}>
				<Grid item>
					<Typography style={{ lineHeight: 2.1 }}>
						{__('Process if', 'kaliforms')}
					</Typography>
				</Grid>
				<Grid item>
					<TextField value={props.conditionalLogic} select onChange={e => changedCondition(e.target.value)}>
						<MenuItem value="any">
							{__('Any', 'kaliforms')}
						</MenuItem>
						<MenuItem value="all">
							{__('All', 'kaliforms')}
						</MenuItem>
					</TextField>
				</Grid>
			</Grid>
			{
				props.conditionalLogicConditions.map((condition, idx) => (
					<Grid container direction="row" key={idx} spacing={4}>
						<Grid item xs={3}>
							<FieldComponentSelect
								label={__('Form field', 'kaliforms')}
								field={idx}
								selectedValue={condition.formField}
								onChange={selectChange} />
						</Grid>
						<Grid item xs={2}>
							<FormControl>
								<InputLabel shrink>
									{__('Field', 'kaliforms')}
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
								<BootstrapInput
									value={condition.value}
									onChange={e => changedValue(idx, e.target.value)}
									fullWidth={true}
									variant="filled"
									placeholder={__('HubSpot Action', 'kaliforms')}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={4} style={{ paddingTop: 42 }}>
							<Button
								aria-label={__('Add condition', 'kaliforms')}
								variant="text"
								onClick={() => addCondition()}
							>
								<Icon className="icon-add" />
							</Button>
							<Button aria-label={__('Remove condition', 'kaliforms')}
								variant="text"
								onClick={() => props.conditionalLogicConditions.length === 1 ? setDefaultCondition() : removeCondition(idx)}
							>
								<Icon className="icon-remove" />

							</Button>
						</Grid>
					</Grid>
				))
			}
		</div>
	)
}

export default ActionConditionalLogic;
