import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import { observer } from "mobx-react";
import React, { useState } from 'react';
import { store } from "./../../store/store";
import BootstrapInput from './../BootstrapInput';
import ConditionalLogicEditor from './../ConditionalLogic/ConditionalLogicEditor';
import ConditionalLogicItem from './../ConditionalLogic/ConditionalLogicItem';
import SectionTitle from './../Misc/SectionTitle';
import conditionalLogicComponentStyles from './ConditionalLogicComponentStyles';
import Typography from '@material-ui/core/Typography';
import { useEffect } from 'react';
const { __ } = wp.i18n;
const FormConditionalLogic = observer((props) => {
	const classes = conditionalLogicComponentStyles(props);
	const labels = {
		states: {
			hide: __('Hide', 'kaliforms'),
			show: __('Show', 'kaliforms'),
		},
		operator: {
			equal: __('Equal to', 'kaliforms'),
			different: __('Different than', 'kaliforms'),
			or: __('Can be', 'kaliforms')
		},
	};
	const [newConditionalName, setNewConditionalName] = useState('')
	const [editingCondition, setEditingCondition] = useState(false)
	const [conditionalBeingEdited, setConditionalBeingEdited] = useState(0)
	const composeLabel = (condition) => {
		let field = store._FIELD_COMPONENTS_.getFieldByInternalId(condition.field);
		if (typeof field === 'undefined') {
			return;
		}
		let caption = typeof field.properties.caption !== 'undefined' && field.properties.caption !== '' ? field.properties.caption : field.properties.id

		return `<span style="text-decoration:underline">${caption}</span> ${__('Should', 'kaliforms')} ${labels.states[condition.state]} ${__('If', 'kaliforms')} ${condition.conditioner} ${__('Is', 'kaliforms')} ${labels.operator[condition.operator]} ${condition.value}`;
	}

	const addCondition = () => {
		let newCondition = {
			name: newConditionalName,
			field: props.sidebar ? store._FIELD_COMPONENTS_.getInternalIdByIndex(store._UI_.activeFormFieldInSidebar) : '',
			state: '',
			conditioner: '',
			operator: '',
			value: '',
		}

		store._FORM_INFO_.addConditional(newCondition);
		setConditionalBeingEdited(store._FORM_INFO_.conditionalLogic.length - 1)
		setEditingCondition(true)
		setNewConditionalName('')
	}

	const currentConditions = props.sidebar
		? store._FORM_INFO_.getFieldConditionsByInternalId(store._FIELD_COMPONENTS_.getInternalIdByIndex(store._UI_.activeFormFieldInSidebar))
		: store._FORM_INFO_.conditionalLogic;

	const allConditions = store._FORM_INFO_.conditionalLogic;
	const field = store._FIELD_COMPONENTS_.getInternalIdByIndex(store._UI_.activeFormFieldInSidebar);

	useEffect(() => {
		if (props.sidebar && editingCondition) {
			setEditingCondition(false);
		}
	}, [store._UI_.activeFormFieldInSidebar])

	return (
		<React.Fragment>
			<If condition={store._FORM_INFO_.conditionsAvailable}>
				<If condition={!editingCondition}>
					<Grid container direction="row">
						<Grid item xs={12}>
							<FormControl>
								<InputLabel shrink>
									{__('Add a name for your logical condition', 'kaliforms')}
								</InputLabel>
								<BootstrapInput
									value={newConditionalName}
									onChange={e => setNewConditionalName(e.target.value)}
									fullWidth={true}
									endAdornment={(
										<Box className={classes.createButton}
											onClick={e => addCondition()}>
											{__('Create', 'kaliforms')}
										</Box>
									)}
								/>
							</FormControl>
						</Grid>
					</Grid>

					<If condition={currentConditions.length}>
						<If condition={props.sidebar}>
							<Typography variant={'body1'} style={{ marginBottom: 8 }}>{__('Your logical conditions', 'kaliforms')}</Typography>
						</If>
						<If condition={!props.sidebar}>
							<SectionTitle title={__('Your logical conditions', 'kaliforms')} />
						</If>
						<Grid container direction="row" spacing={2} alignItems="center">
							{
								allConditions.map((condition, idx) => {
									if (props.sidebar && field !== condition.field) {
										return;
									}
									let label = typeof condition.name !== 'undefined' ? condition.name : composeLabel(condition);
									return (
										<Grid item xs={12} key={condition.conditioner + condition.value + idx}>
											<ConditionalLogicItem
												index={idx}
												label={label}
												condition={condition}
												setConditionalBeingEdited={setConditionalBeingEdited}
												setEditingCondition={setEditingCondition}
												sidebar={props.sidebar}
											/>
										</Grid>
									)
								})}
						</Grid>
					</If>
				</If>

				<If condition={editingCondition}>
					<ConditionalLogicEditor
						sidebar={props.sidebar}
						conditionIdx={conditionalBeingEdited}
						setEditingCondition={setEditingCondition}
					/>
				</If>
			</If>
			<If condition={!store._FORM_INFO_.conditionsAvailable}>
				<Typography variant={'body1'}>{__('There are no fields that allow conditionals (e.g. Dropdowns, Checkboxes, Radios).', 'kaliforms')}</Typography>
			</If>
		</React.Fragment>
	);
})
export default FormConditionalLogic;
