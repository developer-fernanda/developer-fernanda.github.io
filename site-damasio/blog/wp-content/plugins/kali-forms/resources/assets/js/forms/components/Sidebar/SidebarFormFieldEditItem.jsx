import { observer } from "mobx-react";
import React from 'react';
import { store } from "./../../store/store";
import SidebarFieldType from './SidebarFieldType';
import sidebarFormFieldEditStyles from './SidebarFormFieldEditItemStyles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import ConditionalLogic from './../ConditionalLogic/ConditionalLogicComponent';
const { __ } = wp.i18n;
const SidebarFormFieldEdit = observer((props) => {
	/**
	 * Change to array func
	 */
	const changeToArray = (obj) => {
		let properties = [];

		if (!store._FIELD_COMPONENTS_.fieldComponentProperties.hasOwnProperty(obj.id)) {
			return properties;
		}

		for (let sKey in store._FIELD_COMPONENTS_.fieldComponentProperties[obj.id]) {
			if (!obj.properties.hasOwnProperty(sKey)) {
				obj.properties[sKey] = store._FIELD_COMPONENTS_.fieldComponentProperties[obj.id][sKey].value
			}
		}

		for (const key in obj.properties) {
			properties.push({
				id: key,
				...store._FIELD_COMPONENTS_.fieldComponentProperties[obj.id][key],
				value: obj.properties[key],
			});
		}

		return properties;
	}

	const checkDependencies = (element, props) => {
		let dependentField = [...props].filter(el => el.id === element.dependent.field)
		if (!dependentField.length) {
			return true;
		}

		//@todo create logic here for example is not empty or in array something
		return element.dependent.hasOwnProperty('logic')
			? (dependentField[0].value !== '' && dependentField[0].value !== 'kf-select-field')
			: dependentField[0].value === element.dependent.value;
	}


	const formatPropsInGroups = () => {
		let groups = {
			general: [],
			advanced: [],
			addable: [],
			style: [],
			date: [],
		}

		let properties = changeToArray(store._FIELD_COMPONENTS_.getActiveFieldComponent(store._UI_.activeFormFieldInSidebar));

		if (!properties.length) {
			return false;
		}

		properties.map(el => {
			let show = true;
			if (el.hasOwnProperty('dependent')) {
				show = checkDependencies(el, properties);
			}

			if (!el.hasOwnProperty('group') && show) {
				groups.general.push(el);
				return;
			}

			if (show) {
				groups[el.group].push(el);
			}
		})

		let returnArr = [];
		let translations = {
			'general': __('General', 'kaliforms'),
			'addable': __('Options', 'kaliforms'),
			'advanced': __('Advanced', 'kaliforms'),
			'simple': __('Simple', 'kaliforms'),
			'conditional': __('Conditional', 'kaliforms'),
			'style': __('Style', 'kaliforms'),
			'date': __('Date operations', 'kaliforms')
		};
		for (let key in groups) {
			if (!groups[key].length) {
				continue;
			}
			returnArr.push({
				id: key,
				fields: groups[key],
				label: translations[key]
			})
		}

		if (typeof KaliFormsObject.conditionalLogic !== 'undefined') {
			if (
				!['hidden', 'pageBreak', 'grecaptcha'].includes(store._FIELD_COMPONENTS_.getActiveFieldComponent(store._UI_.activeFormFieldInSidebar).id)
			) {
				returnArr.push({
					id: 'conditional',
					label: __('Conditional', 'kaliforms')
				})
			}
		}

		return returnArr
	}

	const classes = sidebarFormFieldEditStyles();
	const groups = formatPropsInGroups();
	const field = store._FIELD_COMPONENTS_.fieldComponents[store._UI_.activeFormFieldInSidebar];
	/**
	 *
	 * @return {*}
	 */
	return (
		<React.Fragment>
			<Typography variant={'subtitle1'} style={{ padding: 8 }}>
				{field.label}
			</Typography>
			{groups.length && groups.map((group, index) => (
				<Accordion key={group.id} className={classes.panel} defaultExpanded={index === 0}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
					>
						<Typography variant="subtitle2">{group.label}</Typography>
					</AccordionSummary>
					<AccordionDetails className={classes.panelDetails}>
						<If condition={typeof group.fields !== 'undefined'}>
							{group.fields.map((field, idx) => <SidebarFieldType key={field.id + idx} field={field} />)}
						</If>
						<If condition={group.id === 'conditional'}>
							<If condition={typeof KaliFormsObject.conditionalLogic !== 'undefined'}>
								<ConditionalLogic sidebar={true} />
							</If>
						</If>
					</AccordionDetails>
				</Accordion>
			))}

		</React.Fragment>
	)
})

export default SidebarFormFieldEdit;
