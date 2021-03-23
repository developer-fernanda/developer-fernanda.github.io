import SnackBarAction from '@/forms/components/SnackBars/SnackBarAction';
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import { CompareSharp } from '@material-ui/icons';
import { observer } from "mobx-react";
import { useSnackbar } from 'notistack';
import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { store } from "./../../store/store";
// import ResizeHandle from './ResizeHandle';
import BuilderFormField from './BuilderFormField';
import builderZoneStyles from './BuilderZoneStyles';
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
/**
 * The actual Builder
 *
 * @param {*} props
 * @returns
 */
const BuilderZone = observer(props => {
	const { enqueueSnackbar } = useSnackbar();
	// State
	const classes = builderZoneStyles();

	/**
	 * Sets active form field in editor
	 *
	 * @param {*} idx
	 * @param {*} e
	 */
	const setFormField = (internalId, e) => {
		if (e.target.tagName.toLowerCase() !== 'div') {
			return;
		}
		let id = 0;
		let fieldType = '';
		store._FIELD_COMPONENTS_.fieldComponents.map((e, idx) => { if (e.internalId === internalId) { fieldType = e.id; id = idx; } })

		if (typeof KaliFormsObject.conditionalLogic === 'undefined' && store._FIELD_COMPONENTS_.isRestrictedField(fieldType)) {
			enqueueSnackbar(
				__("Unfortunately, you can't edit this field anymore. This field is part of the PRO package.", 'kaliforms'),
				{
					preventDuplicate: true,
					variant: 'error',
					action: (key) => <SnackBarAction snackKey={key} />
				}
			)
			return;
		}

		//QOL Improvement - check to see if the field does have the tab we are in - and dont change
		store._UI_.setActiveFormFieldGroupTab('general');
		store._UI_.setActiveTabInSidebar('fieldProperties');
		store._UI_.setActiveFormFieldInSidebar(id);
	}

	/**
	 * Retrieves item style
	 *
	 * @param {*} item
	 * @param {*} idx
	 */
	const getItemStyle = (item, idx) => {
		if (store._UI_.activeTabInSidebar !== 'fieldProperties') {
			return {};
		}

		let style = {};
		if (store._FIELD_COMPONENTS_.getInternalIdByIndex(store._UI_.activeFormFieldInSidebar).toLowerCase() === item.i.toLowerCase()) {
			style = { ...style, ...{ backgroundColor: '#fafafa' } };
		}

		if (typeof KaliFormsObject.conditionalLogic === 'undefined') {
			return style;
		}

		// @todo
		// store._ERRORS_.errors.map(error => {
		// 	if (error.type === 'field' && typeof error.args.find(erroredItem => erroredItem.internalId === item.i) !== 'undefined') {
		// 		style = { ...style, ...{ backgroundColor: 'rgba(208, 2, 31, .15)' } }
		// 		console.log(style);
		// 	}
		// })

		store._FORM_INFO_.conditionalLogic.map(condition => {
			if (typeof store._FIELD_COMPONENTS_.fieldComponents[store._UI_.activeFormFieldInSidebar] !== 'undefined'
				&& condition.field === item.i
				&& store._FIELD_COMPONENTS_.fieldComponents[store._UI_.activeFormFieldInSidebar].internalId === condition.conditioner) {
				style = { ...style, ...{ backgroundColor: 'rgba(162, 162, 250, .15)' } }
			}
		})

		return style;
	}
	const _duplicateField = field => {
		let duplicateField = {};
		store._FIELD_COMPONENTS_.fieldComponents.map(e => { if (e.internalId === field.i) { duplicateField = JSON.parse(JSON.stringify({ ...e })) } })

		duplicateField.internalId = duplicateField.id.toLowerCase() + store._FIELD_COMPONENTS_.lastIndex
		duplicateField.properties.id = duplicateField.internalId
		duplicateField.properties.name = duplicateField.internalId
		duplicateField.properties.caption = duplicateField.properties.caption + '(duplicate)'
		let duplicateFieldGrid = JSON.parse(JSON.stringify({ ...field }));
		duplicateFieldGrid.i = duplicateField.internalId;
		duplicateFieldGrid.y += 1;
		let insertHere = 0;
		let currentGrid = [...store._GRID_.grid];
		currentGrid.map((item, idx) => {
			if (item.y === field.y) {
				insertHere = idx;
			}

			if (item.y >= duplicateFieldGrid.y) {
				currentGrid[idx].y += 1;
			}
		})
		currentGrid.splice(insertHere, 0, duplicateFieldGrid)
		store._FIELD_COMPONENTS_.addFieldComponent({ ...duplicateField })
		store._GRID_.setGrid([...currentGrid])
	}
	/**
	 * Duplicates a field
	 *
	 * @param {*} field
	 */
	const duplicateField = field => {
		store._CONFIRMATION_DIALOG_.setTitle(__('Duplicate field', 'kaliforms'));
		store._CONFIRMATION_DIALOG_.setMessage(__('Are you sure you want to duplicate this field?', 'kaliforms'));
		store._CONFIRMATION_DIALOG_.setAction(_duplicateField)
		store._CONFIRMATION_DIALOG_.setActionProps(field)
		store._CONFIRMATION_DIALOG_.setState(true);
	}
	/**
	 * Gets the last index
	 */
	const getLastIndex = () => {
		return store._FIELD_COMPONENTS_.lastIndex;
	}

	/**
	 * Removes a field
	 * @param {*} field
	 * @param {*} idx
	 */
	const removeField = field => {
		store._CONFIRMATION_DIALOG_.setTitle(__('Remove field', 'kaliforms'));
		store._CONFIRMATION_DIALOG_.setMessage(__('Are you sure you want to delete this field?', 'kaliforms'));
		store._CONFIRMATION_DIALOG_.setAction(_removeField)
		store._CONFIRMATION_DIALOG_.setActionProps(field)
		store._CONFIRMATION_DIALOG_.setState(true);

	}

	const _removeField = field => {
		store._UI_.setActiveTabInSidebar('formFields');
		store._UI_.setActiveFormFieldInSidebar(0);
		store._GRID_.removeGridItem(field.i);

		// are we a "dependency" in conditionals?
		let conditions = store._FORM_INFO_.getFieldConditionersByInternalId(field.i);
		conditions.map(condition => store._FORM_INFO_.removeConditionByAssertion(condition));
		store._FIELD_COMPONENTS_.removeFieldComponent(field.i)
	}

	const layoutChange = layout => {
		if (layout.length === store._GRID_.grid.length) {
			store._GRID_.setGrid(layout);
		}
	}

	const itemDroppedCb = (layout, item, evt) => {
		evt.preventDefault();
		if (!_checkUnique(store._GRID_.draggedItem.id)) {
			return initAlert(store._GRID_.draggedItem.label);
		}

		layout.sort((a, b) => (a.y > b.y) ? 1 : ((b.y > a.y) ? -1 : 0));
		store._FIELD_COMPONENTS_.addFieldComponent(store._GRID_.draggedItem)
		store._GRID_.setGrid(layout)

		_checkIfAddedPaymentMethod(store._GRID_.draggedItem.id);

		store._GRID_.setDragStarted(false)
		store._GRID_.setFieldDragged({})
		store._GRID_.setDraggedItemGrid({ i: '', w: 12, h: 0 })
	}

	/**
	 * Already exists field
	 * @param {*} id
	 */
	const alreadyExists = id => {
		return store._FIELD_COMPONENTS_.getFieldsById(id).length > 0
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

	const _abstractedPmLogic = id => {
		let paymentMethods = [
			store._FIELD_COMPONENTS_.getSingleFieldById('paypal'),
			store._FIELD_COMPONENTS_.getSingleFieldById('wireTransfer'),
			store._FIELD_COMPONENTS_.getSingleFieldById('stripe')
		].filter(Boolean);

		let paymentMethodChooser = false;
		paymentMethods.map(pM => {
			if (paymentMethodChooser) {
				return;
			}

			let pMFound = store._FORM_INFO_.conditionalLogic.find(e => pM.id === e.value);

			paymentMethodChooser = typeof pMFound !== 'undefined' ? store._FIELD_COMPONENTS_.getFieldByInternalId(pMFound.conditioner) : false;
		})

		return { paymentMethods, paymentMethodChooser };
	}

	/**
	 * Checks if a payment method has been added
	 */
	const _checkIfAddedPaymentMethod = id => {
		let paymentFields = ['stripe', 'paypal', 'wireTransfer']
		if (!paymentFields.includes(id)) {
			return;
		}

		const { paymentMethods, paymentMethodChooser } = _abstractedPmLogic(id);

		if (paymentMethods.length > 1 && !paymentMethodChooser) {
			store._CONFIRMATION_DIALOG_.setTitle(__('Payment Methods Issue'));
			store._CONFIRMATION_DIALOG_.setMessage(__('It seems that you have multiple payment methods in your form. In order for this functionality to work correctly you should add a payment method chooser field. Do you want us to do it for you?', 'kaliforms'));
			store._CONFIRMATION_DIALOG_.setState(true);
			store._CONFIRMATION_DIALOG_.setAction(_createFieldAndLogic)
		}

		if (paymentMethodChooser && paymentMethods.length !== paymentMethodChooser.properties.choices.length) {
			store._CONFIRMATION_DIALOG_.setTitle(__('Payment Methods Issue'));
			store._CONFIRMATION_DIALOG_.setMessage(__('Do you want to update the payment method chooser?', 'kaliforms'));
			store._CONFIRMATION_DIALOG_.setState(true);
			store._CONFIRMATION_DIALOG_.setAction(_updateFieldAndLogic)
			store._CONFIRMATION_DIALOG_.setActionProps({ paymentMethods, paymentMethodChooser })
		}
	}
	/**
	 * Update the radio field and afterwards the logic
	 *
	 * @param {} id
	 */
	const _updateFieldAndLogic = (data) => {

		// Wipe choices from properties
		let newChoices = [];
		let choiceValueMap = {};
		data.paymentMethods.map(el => {
			choiceValueMap[el.internalId] = el.id;
			newChoices.push({ value: el.id, label: el.label })
		});
		let field = store._FIELD_COMPONENTS_.getFieldByInternalId(data.paymentMethodChooser.internalId)
		field.properties.choices = newChoices;

		store._FORM_INFO_.getFieldConditionersByInternalId(data.paymentMethodChooser.internalId).map(condition => {
			store._FORM_INFO_.removeConditionByAssertion(condition)
		});

		data.paymentMethods.map(pM => {
			store._FORM_INFO_.addConditional({
				name: __('Show ', 'kaliforms') + pM.label,
				field: pM.internalId,
				state: 'show',
				conditioner: data.paymentMethodChooser.internalId,
				operator: 'equal',
				value: choiceValueMap[pM.internalId]
			})
		})
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
		field.properties.name = 'payment-method';
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

	let dragInitiated = store._GRID_.dragStarted && (navigator.userAgent.indexOf('Firefox') !== -1) ? 'removePointerEvents' : '';

	return (
		<React.Fragment>
			<Box id="kali-responsive-grid-layout" className={classes.builderZoneContainer + ' ' + 'MuiPaper-elevation4' + ' ' + dragInitiated}>
				<GridLayout
					className="layout"
					useCSSTransforms={true}
					// margin={[24, 0]}
					width={786}
					rowHeight={90}
					draggableHandle='.KaliFormsBuilderDragHandle'
					resizeHandles={['e']}
					// resizeHandle={<ResizeHandle />}
					cols={12}
					droppingItem={store._GRID_.draggedItemGrid}
					isDroppable={true}
					onDrop={itemDroppedCb}
					onLayoutChange={layout => _.debounce(layoutChange(layout), 200)}>
					{
						store._GRID_.getGrid.map((item, idx) => {
							let active =
								store._UI_.activeTabInSidebar === 'fieldProperties'
									&& store._FIELD_COMPONENTS_.getInternalIdByIndex(store._UI_.activeFormFieldInSidebar).toLowerCase() === item.i.toLowerCase() ? 'active' : '';

							return (
								<Box
									data-grid={item}
									key={item.i}
									style={getItemStyle(item, idx)}
									className={
										classes.gridItem + ' ' + active
									}
									onClick={(e) => setFormField(item.i, e)}>
									<BuilderFormField field={item.i} />
									<Box className={classes.actionButtons}>
										<Icon className={classes.icon + ' ' + classes.iconDuplicate + ' icon-copy'} onClick={() => duplicateField(item)} aria-label={__('Duplicate', 'kaliforms')} />
										<Icon className={classes.icon + ' ' + classes.iconRemove + ' icon-remove'} onClick={() => removeField(item, idx)} aria-label={__('Delete', 'kaliforms')} />
									</Box>
								</Box>
							);
						})
					}
				</GridLayout>
			</Box >
		</React.Fragment>
	);
})

export default BuilderZone;
