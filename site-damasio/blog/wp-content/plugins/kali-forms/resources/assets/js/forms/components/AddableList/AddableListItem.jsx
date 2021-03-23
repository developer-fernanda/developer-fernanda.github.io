import AddableListItemHandle from './AddableListItemHandle'
import React, { useEffect, useState } from 'react';
import { sortableElement } from 'react-sortable-hoc';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import addableListItemStyles from './AddableListItemStyles';
import { store } from './../../store/store';
import { observer } from "mobx-react"
import BootstrapInput from './../BootstrapInput';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from './../Misc/Checkbox';
import Icon from '@material-ui/core/Icon';
/**
 * Addable list item
 *
 * @class AddableListItem
 * @extends {React.Component}
 */
const AddableListItem = observer((props) => {
	const [element, setElement] = useState(props.element);
	const [idx, setIdx] = useState(props.idx);
	const classes = addableListItemStyles();

	useEffect(() => {
		setElement(props.element)
	}, [props.element])


	useEffect(() => {
		setIdx(props.idx)
	}, [props.idx])

	let currentFieldVal = store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, 'default');
	let currentVal = typeof currentFieldVal !== 'undefined'
		? currentFieldVal.split(',') : []
	currentVal = currentVal.filter(e => e !== '');

	return (
		<React.Fragment>
			<Box className={classes.root}>
				<Box className={classes.handleContainer}>
					<AddableListItemHandle className={classes.handle} />
				</Box>
				<Box className={classes.inputFieldsContainer}>
					<Box className={classes.checkboxInput}>
						<FormControlLabel
							className={classes.checkboxLabel}
							control={
								<Checkbox
									checked={currentVal.includes(element.value)}
									onChange={e => props.handleCheckboxChange(e.target.checked, idx)}
								/>
							}
							labelPlacement="top"
						/>
					</Box>
					<Box className={classes.firstInput}>
						<FormControl>
							<BootstrapInput
								value={element.value}
								onChange={e => props.handleChange(e.target.value, 'value', idx)}
								fullWidth={true}
							/>
						</FormControl>
					</Box>
					<Box className={classes.secondInput}>
						<FormControl>
							<BootstrapInput
								value={element.label}
								onChange={e => props.handleChange(e.target.value, 'label', idx)}
								fullWidth={true}
							/>
						</FormControl>
					</Box>
				</Box>
				<Box className={classes.deleteButtonContainer}>
					<Icon className={classes.delete + ' icon-remove'} onClick={() => props.removeChoice(idx)} />
				</Box>
			</Box>
		</React.Fragment>
	)
})

export default sortableElement(AddableListItem)
