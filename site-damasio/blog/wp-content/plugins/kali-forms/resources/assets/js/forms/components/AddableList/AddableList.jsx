import React, { useState } from 'react';
import AddableListContainer from './AddableListContainer'
import AddableListItem from './AddableListItem'
import { store } from './../../store/store';
import { observer } from "mobx-react"

const AddableList = observer((props) => {
	const [choices, setChoices] = useState(Array.isArray(props.choices) ? props.choices : [])
	const [orderChanged, setOrderChanged] = useState(Math.random().toString(36).substring(2))

	/**
	* Array move function
	*
	* @param {*} x
	* @param {*} from
	* @param {*} to
	* @memberof AddableList
	*/
	const arrayMove = (x, from, to) => {
		x.splice((to < 0 ? x.length + to : to), 0, x.splice(from, 1)[0]);
	}

	/**
	 * On sort end
	 * @todo sorted items dont look so good because they are dependent of a parent css class
	 * @param {*} obj
	 * @memberof AddableList
	 */
	const onSortEnd = (obj) => {
		let newState = choices;
		arrayMove(newState, obj.oldIndex, obj.newIndex)
		props.onChange(newState)
		setOrderChanged(Math.random().toString(36).substring(9))
	}

	/**
	 * Adds a choice in the state
	 */
	const addChoice = () => {
		setChoices([...choices, { value: 'choice', label: 'This is the label' }])
		props.onChange([...choices, { value: 'choice', label: 'This is the label' }]);
	}

	/**
	 * Removes a choice from state
	 * @param {Number} index
	 */
	const removeChoice = (index) => {
		let newState = choices.filter((e, idx) => {
			return idx !== index;
		});

		props.onChange(newState);
		setChoices(newState);
	}

	/**
	 * Handle form change
	 *
	 * @param {string} e
	 * @param {string} key
	 * @param {number} index
	 */
	const handleChange = (e, key, index) => {
		if (props.onChange) {
			let newState = choices;
			newState[index][key] = e;
			props.onChange(newState);
			setChoices([...newState]);
		}
	}

	const handleCheckboxChange = (e, idx) => {
		// GET CURRENT DEFAULT VALUES - LETS SEE IF ITS EMPTY
		let currentDefaultVal = store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, 'default').split(',')
		currentDefaultVal = currentDefaultVal.filter(e => e !== '');
		let existsValue = currentDefaultVal.length ? true : false;

		if (props.selectableType === 'single') {
			currentDefaultVal = [];
		}

		// Lets see if the value is relevant ( it might have changed )
		let currentChoices = [];
		choices.map(e => currentChoices.push({ value: e.value, checked: currentDefaultVal.includes(e.value) }))

		// Update the current choice checked status
		currentChoices[idx].checked = e;

		// Create array that holds values
		let newVal = [];
		currentChoices.map(e => e.checked ? newVal.push(e.value) : false);
		store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, 'default', newVal.join(','))
	}

	return (
		<AddableListContainer onSortEnd={(e) => onSortEnd(e)}
			addChoice={addChoice}
			setChoices={setChoices}
			choices={choices}
			onChange={props.onChange}
			lockAxis="y"
			lockToContainerEdges={true}
			useDragHandle
			helperClass="addableListHandler"
		>
			{
				choices.map((element, idx) => (
					<AddableListItem
						removeChoice={removeChoice}
						handleChange={handleChange}
						handleCheckboxChange={handleCheckboxChange}
						element={element}
						index={idx}
						idx={idx}
						key={'item-' + idx}
					/>
				))
			}
		</AddableListContainer>
	);
})

export default AddableList;
