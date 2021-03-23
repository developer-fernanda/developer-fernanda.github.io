import { observable, action, computed, makeObservable } from 'mobx';
import { computedFn } from "mobx-utils"
export default class FieldComponents {
	fieldComponents = KaliFormsObject.fieldComponents;

	formFieldTypes = KaliFormsObject.formFields;

	formFieldIconMap = {};

	constructor() {
		makeObservable(this, {
			fieldComponents: observable,
			formFieldTypes: observable,
			formFieldIconMap: observable,
			lastIndex: computed,
			fieldComponentProperties: computed,
			simplifiedFields: computed,
			fieldConditioners: computed,
			fieldConditionersByName: computed,
			fieldNames: computed,
			fieldIds: computed,
			addFieldComponent: action,
			addFieldComponents: action,
			removeFieldComponent: action,
			updatePropertyValue: action,
			addMultipleComponents: action
		});

		this.fieldComponentPropertiesLoop(true);
	}

	fieldComponentPropertiesLoop(setMap = false) {
		let fields = {};
		this.formFieldTypes.map(group => {
			group.fields.map(field => {
				fields[field.id] = { ...field.properties, fieldTypeIcon: field.icon };
				if (setMap) {
					this.formFieldIconMap[field.id] = field.icon;
				}
			})
		})
		return fields;
	}

	get lastIndex() {
		let returnItem = 0;
		this.fieldComponents.map(e => {
			let index = e.internalId;
			returnItem = parseFloat(index.toLowerCase().replace(e.id.toLowerCase(), ''));
		})

		return isNaN(returnItem) ? Math.floor(Math.random() * 90000) + 10000 : returnItem + 1;
	}

	get fieldComponentProperties() {
		const fields = {};
		this.formFieldTypes.map(group => {
			group.fields.map(field => {
				fields[field.id] = field.properties;
			})
		})
		return fields;
	}
	get simplifiedFields() {
		let fieldComponentsSimplified = {};
		this.fieldComponents.map(e => {
			fieldComponentsSimplified[e.internalId] = {
				type: e.id,
				fieldName: e.properties.name,
				caption: typeof e.properties.caption !== 'undefined' && e.properties.caption !== ''
					? e.properties.caption
					: e.properties.id,
			}
		})
		return fieldComponentsSimplified;
	}
	get fieldConditioners() {
		let fieldComponentsConditioners = {};

		this.fieldComponents.map(e => {
			if (e.id === 'imageRadio' || e.id === 'select' || e.id === 'dropdown' || e.id === 'checkbox' || e.id === 'radio' || e.id === 'choices' || e.id === 'donation') {
				fieldComponentsConditioners[e.internalId] = {
					caption: typeof e.properties.caption !== 'undefined' && e.properties.caption !== ''
						? e.properties.caption
						: e.properties.id,
					values: e.properties.choices,
				}
			}
		})

		return fieldComponentsConditioners;
	};
	get fieldConditionersByName() {
		let fieldComponentsConditioners = {};

		this.fieldComponents.map(e => {
			if (e.id === 'imageRadio' || e.id === 'select' || e.id === 'dropdown' || e.id === 'checkbox' || e.id === 'radio' || e.id === 'choices' || e.id === 'donation') {
				fieldComponentsConditioners[e.properties.name] = {
					caption: typeof e.properties.caption !== 'undefined' && e.properties.caption !== ''
						? e.properties.caption
						: e.properties.id,
					values: e.properties.choices,
				}
			}
		})

		return fieldComponentsConditioners;
	};
	get fieldNames() {
		let names = [];
		this.fieldComponents.map(e => names.push(e.properties.name))
		return names;
	}
	get fieldIds() {
		let ids = [];
		this.fieldComponents.map(e => ids.push(e.properties.id))
		return ids;
	}
	getFieldsByType = computedFn(function getFieldsByType(id) {
		let fieldComponents = [];

		this.fieldComponents.map(e => {
			if (e.id === id) {
				fieldComponents.push({
					type: e.id,
					internalId: e.internalId,
					name: e.properties.caption !== '' ? e.properties.caption : e.properties.id,
					value: e.properties.name,
				})
			}
		});
		return fieldComponents;
	});
	getFormFieldIcon = computedFn(function getFormFieldIcon(id) {

	});
	getActiveFieldComponent = computedFn(function getActiveFieldComponent(idx) {
		return this.fieldComponents[idx]
	})
	getPropertyValue = computedFn(function getPropertyValue(idx, propertyId) {
		if (!this.fieldComponents.length || typeof this.fieldComponents[idx] === 'undefined') {
			return null
		}
		return this.fieldComponents[idx].properties[propertyId];
	})

	getInternalIdByIndex = computedFn(function getInternalIdByIndex(idx) {
		if (!this.fieldComponents.length || typeof this.fieldComponents[idx] === 'undefined') {
			return null
		}

		return this.fieldComponents[idx].internalId;
	})

	getFieldByIndex = computedFn(function getFieldByIndex(idx) {
		if (!this.fieldComponents.length || typeof this.fieldComponents[idx] === 'undefined') {
			return null
		}

		return this.fieldComponents[idx];
	})
	getFieldsById = computedFn(function getFieldsById(id) {
		if (!this.fieldComponents.length) {
			return []
		}
		let fields = this.fieldComponents.filter(e => e.id === id);
		return fields
	})
	getSingleFieldById = computedFn(function getSingleFieldById(id) {
		if (!this.fieldComponents.length) {
			return []
		}
		let fields = this.fieldComponents.filter(e => e.id === id);
		return fields[0]
	})
	getFieldByInternalId = computedFn(function getFieldByInternalId(id) {
		if (!this.fieldComponents.length) {
			return null
		}

		let field = this.fieldComponents.find(e => e.internalId === id);
		return field;
	})

	isRestrictedField = computedFn(function isRestrictedField(id) {
		let restricted = ['rating', 'smartTextOutput', 'dateTimePicker', 'choices', 'pageBreak', 'password', 'range', 'gdpr', 'termsAndConditions', 'digitalSignature', 'colorPicker']
		return restricted.includes(id);
	});

	addFieldComponent(field) {
		let name = this.pluckProperty(field, 'properties.name')

		field.properties.name = this.determineUniqueByProp(this.fieldComponents, 'properties.name', name)
			? field.properties.name + Math.floor(Math.random() * 100)
			: field.properties.name;

		this.fieldComponents.push(field)
	}

	addFieldComponents(fields) {
		this.fieldComponents = [...this.fieldComponents, ...fields]
	}

	removeFieldComponent(id) {
		this.fieldComponents = [...this.fieldComponents.filter(e => e.internalId !== id)]
	}

	updatePropertyValue(idx, propertyId, value) {
		this.fieldComponents[idx].properties[propertyId] = value;
	}

	addMultipleComponents(components) {
		this.fieldComponents = [...this.fieldComponents, ...components];
	}
	/**
	 * Determines if its unique or not
	 * @param {*} collection
	 * @param {*} key
	 * @param {*} value
	 */
	determineUniqueByProp(collection, key, value) {
		let uniqueArr = collection.filter(item => {
			return this.pluckProperty(item, key) === value;
		});

		return uniqueArr.length > 0
	}
	/**
	 * Plucks property (even if it is nested)
	 * @param {*} obj
	 * @param {*} property
	 */
	pluckProperty(obj, property) {
		let properties = property.split('.');
		let val = '';
		properties.map(p => val = val === '' ? obj[p] : val[p])
		return val;
	}
	/**
	 * Loops through a collection and sees if there is a duplicate property
	 * @param {*} collection
	 * @param {*} property
	 */
	foundDuplicatesInCollection(collection, property) {
		let initialLoop = [];
		collection.map(item => initialLoop.push(this.pluckProperty(item, property)))
		return new Set(initialLoop).size !== initialLoop.length
	}
	/**
	 * Loops through a collection and sees if there is a duplicate property, returns them
	 *
	 * @param {*} collection
	 * @param {*} property
	 */
	findDuplicatesInCollection(collection, property) {
		let initialLoopMap = {};
		let throwErrors = [];
		let duplicates = false;
		collection.map(item => {
			let it = this.pluckProperty(item, property);

			if (initialLoopMap.hasOwnProperty(it)) {
				duplicates = true;
				throwErrors.push(item);
			}

			initialLoopMap[it] = initialLoopMap.hasOwnProperty(it) ? initialLoopMap[it] + 1 : 1;
		})

		return { duplicates, items: throwErrors }
	}
}
