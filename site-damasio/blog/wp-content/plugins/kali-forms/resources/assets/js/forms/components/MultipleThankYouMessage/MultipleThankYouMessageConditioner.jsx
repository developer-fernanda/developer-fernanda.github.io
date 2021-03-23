import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { observer } from "mobx-react";
import React from 'react';
import { store } from './../../store/store';
import BootstrapInput from './../BootstrapInput';
const { __ } = wp.i18n;
const MultipleThankYouMessageConditioner = observer(props => {
	const choiceFields = ['dropdown', 'imageRadio', 'checkbox', 'radio', 'dropdown'];
	const getConditioner = () => {
		let fieldName = store._FORM_INFO_.conditionalThankYouMessage[props.editedCondition].condition.if
		let conditioner = false;
		store._FIELD_COMPONENTS_.fieldComponents.map(field => {
			if (field.properties.name !== fieldName) {
				return;
			}

			conditioner = {
				type: field.id,
				values: [],
			}

			if (choiceFields.includes(field.id)) {
				conditioner.values = field.properties.choices
			}
		});

		return conditioner;
	}

	const conditioner = getConditioner();

	return (
		<React.Fragment>
			<Grid item xs={12}>
				<FormControl>
					<InputLabel shrink>
						{__('Condition name', 'kaliforms')}
					</InputLabel>
					<BootstrapInput
						value={store._FORM_INFO_.conditionalThankYouMessage[props.editedCondition].name}
						onChange={e => store._FORM_INFO_.conditionalThankYouMessage[props.editedCondition].name = e.target.value} />
				</FormControl>
			</Grid>
			<Grid item xs={3}>
				<FormControl>
					<InputLabel shrink>
						{__('Condition field', 'kaliforms')}
					</InputLabel>
					<Select
						multiple={false}
						input={<BootstrapInput />}
						value={store._FORM_INFO_.conditionalThankYouMessage[props.editedCondition].condition.if}
						onChange={e => store._FORM_INFO_.conditionalThankYouMessage[props.editedCondition].condition.if = e.target.value}
						fullWidth={true}
					>
						{store._FIELD_COMPONENTS_.fieldComponents.map(field => {
							if (
								(field.properties.name !== '')
								&& (field.id === 'checkbox'
									|| field.id === 'select'
									|| field.id === 'textbox'
									|| field.id === 'radio'
									|| field.id === 'hidden'
									|| field.id === 'dropdown'
									|| field.id === 'date'
									|| field.id === 'range'
									|| field.id === 'choices')
							) {

								let label = (typeof field.properties.caption !== 'undefined' && field.properties.caption !== '') ? field.properties.caption : field.properties.name
								return (
									<MenuItem
										key={field.internalId}
										value={field.properties.name}>
										{label}
									</MenuItem>
								)
							}
						})}
					</Select>
				</FormControl>
			</Grid>
			<Grid item xs={3}>
				<FormControl>
					<InputLabel shrink>
						{__('Is', 'kaliforms')}
					</InputLabel>
					<Select
						multiple={false}
						input={<BootstrapInput />}
						value={store._FORM_INFO_.conditionalThankYouMessage[props.editedCondition].condition.operator}
						onChange={e => store._FORM_INFO_.conditionalThankYouMessage[props.editedCondition].condition.operator = e.target.value}
						fullWidth={true}
					>
						<MenuItem key="contains" value="contains">
							{__('Contains', 'kaliforms')}
						</MenuItem>
						<MenuItem key="equal" value="equal">
							{__('Equal', 'kaliforms')}
						</MenuItem>
						<MenuItem key="greater" value="greater">
							{__('Greater', 'kaliforms')}
						</MenuItem>
						<MenuItem key="less" value="less">
							{__('Less', 'kaliforms')}
						</MenuItem>
					</Select>
				</FormControl>
			</Grid>
			<If condition={conditioner !== false}>
				<Grid item xs={6}>
					<FormControl>
						<InputLabel shrink>
							{__('Value', 'kaliforms')}
						</InputLabel>
						<Choose>
							<When condition={choiceFields.includes(conditioner.type)}>
								<Select
									value={store._FORM_INFO_.conditionalThankYouMessage[props.editedCondition].condition.value}
									multiple={false}
									onChange={e => store._FORM_INFO_.conditionalThankYouMessage[props.editedCondition].condition.value = e.target.value}
									input={<BootstrapInput />}
								>
									{
										conditioner.values.map((e, index) => (
											<MenuItem key={index + e.value} value={e.value}>
												{e.label}
											</MenuItem>
										))
									}
								</Select>
							</When>
							<Otherwise>
								<BootstrapInput
									value={store._FORM_INFO_.conditionalThankYouMessage[props.editedCondition].condition.value}
									onChange={e => store._FORM_INFO_.conditionalThankYouMessage[props.editedCondition].condition.value = e.target.value}
								/>
							</Otherwise>
						</Choose>
					</FormControl>
				</Grid>
			</If>
		</React.Fragment>
	)
});

export default MultipleThankYouMessageConditioner
