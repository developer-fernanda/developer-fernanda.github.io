import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import SidebarFieldComponentItemStyles from './SidebarFieldComponentItemStyles';
import { observer } from "mobx-react";
import { store } from "./../../store/store";
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
const { __ } = wp.i18n;
/**
 * Returns the last grid item
 */
const getDefaultGrid = field => {
	let gridItem = { x: 0, y: Infinity, w: 12, h: 1, maxH: 1, minW: 3, moved: false, static: false, i: field.internalId }
	gridItem.minW = (field.constraint === 'none' || typeof field.constraint === 'undefined')
		? 3
		: parseFloat(field.constraint);
	gridItem.minW = gridItem.minW === 0 ? 3 : gridItem.minW;
	gridItem.w = gridItem.minW > gridItem.w ? gridItem.minW : gridItem.w;

	return gridItem;
}

const SidebarFieldComponentItem = observer(props => {
	const classes = SidebarFieldComponentItemStyles();
	/**
	 * Add a field in the builder
	 * SHOULD BE PARSED/STRINGIFY SO YOU FORGET OBJECT REFS
	 */
	const addField = () => {
		// If it s not unique, display an alert
		if (!_checkUnique(props.id)) {
			return initAlert(props.label);
		}
		props.id === 'collection' ? _addFields() : _addField();
	}
	const _addFields = () => {
		let fields = [];
		let grid = [];
		let start = store._FIELD_COMPONENTS_.lastIndex;
		let rows = {};
		props.properties.fields.map((obj, idx) => {
			obj.field.properties.id.value = obj.field.properties.id.value + (start + idx)
			let fieldToBePushed = {
				id: obj.field.id,
				label: obj.field.label,
				properties: formatObj(obj.field),
				constraint: obj.field.constraint,
				internalId: obj.field.id.toLowerCase() + (start + idx)
			}

			for (let key in obj.values) {
				if (fieldToBePushed.properties.hasOwnProperty(key)) {
					fieldToBePushed.properties[key] = obj.values[key]
				}
			}

			fields.push(JSON.parse(JSON.stringify(fieldToBePushed)));

			rows[fieldToBePushed.internalId] = { w: parseFloat(obj.grid.w), y: parseFloat(obj.grid.row) };
			let defaultGrid = getDefaultGrid(fieldToBePushed);
			defaultGrid.w = rows[fieldToBePushed.internalId].w
			defaultGrid.y = rows[fieldToBePushed.internalId].y + store._GRID_.lastY + 1
			grid.push(JSON.parse(JSON.stringify(defaultGrid)));
		});

		//@todo there is a bug here where Y is not "respected"
		store._FIELD_COMPONENTS_.addMultipleComponents(fields);
		store._GRID_.addMultipleGridItems(grid);
	}
	/**
	 * Already exists field
	 * @param {*} id
	 */
	const alreadyExists = id => {
		return store._FIELD_COMPONENTS_.getFieldsById(id).length > 0
	}
	/**
	 * Init the alert for unique field
	 * @param {*} label
	 */
	const initAlert = label => {
		store._CONFIRMATION_DIALOG_.setTitle(label + __(' field already exists', 'kaliforms'));
		store._CONFIRMATION_DIALOG_.setMessage(__('You can add only one field of this type', 'kaliforms'));
		store._CONFIRMATION_DIALOG_.setHideCancelButton(true);
		store._CONFIRMATION_DIALOG_.setState(true);
	}
	/**
	 * Add field function
	 */
	const _addField = () => {
		props.properties.id.value = props.properties.id.value + store._FIELD_COMPONENTS_.lastIndex

		let field = {
			id: props.id,
			label: props.label,
			properties: formatObj(props),
			constraint: props.constraint,
			internalId: props.id.toLowerCase() + store._FIELD_COMPONENTS_.lastIndex,
		}

		store._FIELD_COMPONENTS_.addFieldComponent(field)
		store._GRID_.addGridItem(getDefaultGrid(field))

		_checkIfAddedPaymentMethod(props.id);
	}

	const _dragField = () => {
		props.properties.id.value = props.properties.id.value + store._FIELD_COMPONENTS_.lastIndex

		let field = {
			id: props.id,
			label: props.label,
			properties: formatObj(props),
			constraint: props.constraint,
			internalId: props.id.toLowerCase() + store._FIELD_COMPONENTS_.lastIndex,
		}

		return field;
	}

	/**
	 * Checks if a payment method has been added
	 */
	const _checkIfAddedPaymentMethod = id => {
		let paymentFields = ['stripe', 'paypal', 'wireTransfer']
		if (!paymentFields.includes(id)) {
			return;
		}
		let paymentMethods = [
			store._FIELD_COMPONENTS_.getSingleFieldById('paypal'),
			store._FIELD_COMPONENTS_.getSingleFieldById('wireTransfer'),
			store._FIELD_COMPONENTS_.getSingleFieldById('stripe')
		].filter(Boolean);

		if (paymentFields.includes(id)) {
			paymentMethods.push(id);
		}

		let paymentMethodChooser = false;
		paymentMethods.map(pM => {
			if (paymentMethodChooser) {
				return;
			}

			let pMFound = store._FORM_INFO_.conditionalLogic.find(e => pM === e.value);
			paymentMethodChooser = typeof pMFound !== 'undefined'
		})

		if (paymentMethods.length > 1 && !paymentMethodChooser) {
			store._CONFIRMATION_DIALOG_.setTitle(__('Payment Methods Issue'));
			store._CONFIRMATION_DIALOG_.setMessage(__('It seems that you have multiple payment methods in your form. In order for this functionality to work correctly you should add a payment method chooser field. Do you want us to do it for you?', 'kaliforms'));
			store._CONFIRMATION_DIALOG_.setState(true);
			store._CONFIRMATION_DIALOG_.setAction(_createFieldAndLogic)
		}

		if (paymentMethods.length < 3 && paymentMethodChooser) {
			store._CONFIRMATION_DIALOG_.setTitle(__('Payment Methods Issue'));
			store._CONFIRMATION_DIALOG_.setMessage(__('Do you want to update the payment method chooser?', 'kaliforms'));
			store._CONFIRMATION_DIALOG_.setState(true);
			store._CONFIRMATION_DIALOG_.setAction(_updateFieldAndLogic)
			store._CONFIRMATION_DIALOG_.setActionProps(id)
		}
	}

	/**
	 * Create field and logic
	 *
	 * @param {*} _
	 */
	const _createFieldAndLogic = _ => {
		let radioItem = JSON.parse(JSON.stringify(store._FIELD_COMPONENTS_.formFieldTypes[0].fields.find(field => field.id === 'radio')));

		let field = {
			id: radioItem.id,
			label: radioItem.label,
			properties: formatObj(radioItem),
			constraint: 'none',
			internalId: radioItem.id.toLowerCase() + store._FIELD_COMPONENTS_.lastIndex,
		}
		field.properties.caption = __('Select payment method', 'kaliforms');
		let pmObj = _getAllPaymentMethods();
		field.properties.choices = pmObj.choices;
		store._FIELD_COMPONENTS_.addFieldComponent(field)
		store._GRID_.addGridItem(getDefaultGrid(field))

		pmObj.paymentMethods.map((e, idx) => {
			store._FORM_INFO_.addConditional({
				name: __('Show ', 'kaliforms') + pmObj.choices[idx].label,
				field: e.internalId,
				state: 'show',
				conditioner: field.internalId,
				operator: 'equal',
				value: e.id
			})
		})
	}

	/**
	 * Update the radio field and afterwards the logic
	 *
	 * @param {} id
	 */
	const _updateFieldAndLogic = id => {
		let pMFound = store._FORM_INFO_.conditionalLogic.find(e => ['stripe', 'paypal', 'wireTransfer'].includes(e.value));
		if (typeof pMFound !== 'undefined') {
			let pMField = store._FIELD_COMPONENTS_.getSingleFieldById(id);

			let field = store._FIELD_COMPONENTS_.getFieldByInternalId(pMFound.conditioner)
			field.properties.choices.push({
				value: id,
				label: _translatePmById(id)
			})

			store._FORM_INFO_.addConditional({
				name: __('Show ', 'kaliforms') + _translatePmById(id),
				field: pMField.internalId,
				state: 'show',
				conditioner: pMFound.conditioner,
				operator: 'equal',
				value: id
			})
		}
	}

	/**
	 * Returns all payment methods
	 */
	const _getAllPaymentMethods = () => {
		let paymentMethods = [
			store._FIELD_COMPONENTS_.getSingleFieldById('paypal'),
			store._FIELD_COMPONENTS_.getSingleFieldById('wireTransfer'),
			store._FIELD_COMPONENTS_.getSingleFieldById('stripe')
		].filter(Boolean);

		let returnable = [];
		paymentMethods.map(pM => {
			let label = _translatePmById(pM.id);
			returnable.push({ label, value: pM.id })
		});

		return { paymentMethods, choices: returnable };
	}

	/**
	 * Translates payment methods using id
	 */
	const _translatePmById = id => {
		let label = '';
		switch (id) {
			case 'stripe':
				label = __('Stripe', 'kaliforms')
				break;
			case 'paypal':
				label = __('PayPal', 'kaliforms')
				break;
			case 'wireTransfer':
				label = __('Wire transfer', 'kaliforms')
				break;
			default: break;
		}
		return label;
	}
	/**
	 * Checks if the field is unique
	 * @param {*} id
	 * @param {*} label
	 */
	const _checkUnique = id => {
		let uniqueFields = ['stripe', 'paypal', 'submitButton', 'paymentMethod', 'grecaptcha', 'stripeIban', 'wireTransfer', 'total'];
		if (uniqueFields.includes(id) && alreadyExists(id)) {
			return false;
		}
		return true;
	}
	/**
	 * Format object
	 *
	 * @param {*} obj
	 * @returns
	 * @memberof SidebarFieldComponentItem
	 */
	const formatObj = (obj) => {
		let properties = {};
		for (const key in obj.properties) {
			properties[key] = obj.properties[key].value
		}
		if (!properties.hasOwnProperty('name')) {
			properties.name = properties.id
		}

		return properties;
	}

	const redirectToPricing = event => {
		window.open(`https://www.kaliforms.com/pricing?utm_source=formSettings-ProFields-${props.label}&utm_campaign=userInterests&utm_medium=proBadge`, '_blank');
	}

	const determineCourseOfAction = () => {
		return typeof props.properties.pro !== 'undefined' && props.properties.pro ? redirectToPricing() : addField();
	}

	const propsForCard = () => {
		let obj = {
			variant: 'outlined',
			className: classes.root,
		}

		if (props.id === 'collection' || props.id === 'upsellField') {
			obj.onClick = determineCourseOfAction
			obj.draggable = 'false';
			obj.style = { cursor: 'pointer' };
		} else {
			obj.draggable = 'true';
			obj.unselectable = 'on';
			obj.onDragStart = onDragStartFc
			obj.onDragEnd = onDragEndFc
		}

		if (typeof props.properties.pro !== 'undefined') {
			obj.onClick = redirectToPricing
		}

		return obj;
	}

	const onDragStartFc = (e) => {
		e.dataTransfer.effectAllowed = 'all';
		e.dataTransfer.setData('text/plain', null);
		let field = _dragField()
		store._GRID_.setDragStarted(true);
		store._GRID_.setFieldDragged(field)
		store._GRID_.setDraggedItemGrid(getDefaultGrid(field))
	}

	const onDragEndFc = (e) => {
		store._GRID_.setDragStarted(false)
		store._GRID_.setFieldDragged({})
		store._GRID_.setDraggedItemGrid({ i: '', w: 12, h: 0 })
	}

	return (
		<Card {...propsForCard()}>
			<CardHeader
				style={{ padding: 0, position: 'relative' }}
				titleTypographyProps={{ variant: 'subtitle2', style: { display: 'flex', alignItems: 'center' } }}
				title={
					<React.Fragment>
						<Icon className={classes.icon + ' ' + props.icon} />
						<Box>{props.label}</Box>
						<If condition={props.id === 'collection'}>
							<IconButton className={classes.collectionButton}>
								<Icon className={'icon-add-new'} />
							</IconButton>
						</If>
						<If condition={typeof props.properties.pro !== 'undefined' && props.properties.pro}>
							<span className={classes.proButtonHolder}>
								<IconButton className={classes.proButton}>
									Pro
								</IconButton>
							</span>
						</If>
					</React.Fragment>
				}
			/>
		</Card>
	)
})

export default SidebarFieldComponentItem;
