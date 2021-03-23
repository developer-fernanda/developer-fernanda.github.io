import React from 'react';
import { observer } from "mobx-react";
import { store } from './../../store/store';
import AddableProductContainer from './AddableProductContainer';
import AddableProductChoice from './AddableProductChoice';
import Box from '@material-ui/core/Box';
import Button from './../Misc/MinimalButton'
import { makeStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon';
const { __ } = wp.i18n;
const addableProductStyles = makeStyles(theme => {
	return {
		containerRoot: {
			position: 'relative',
		},
		buttonFullWidth: {
			width: '100%',
			'& .MuiIcon-root': {
				marginRight: theme.spacing(1),
			},
		},
	}
});
const AddableProduct = observer((props) => {
	const [currentValue, setCurrentValue] = React.useState(Array.isArray(props.products) ? props.products : [])
	const [selected, setSelected] = React.useState(props.default);
	const [orderChanged, setOrderChanged] = React.useState('');

	/**
	 * Instance creator
	 */
	const createProduct = () => {
		let val = {
			id: 'product-' + Math.floor(Math.random() * 100),
			label: '',
			price: 0,
			image: { id: null },
		};
		setCurrentValue([...currentValue, val])
		props.onChange([...currentValue, val]);
	}

	const classes = addableProductStyles();

	const removeChoice = (idx) => {
		let newVal = currentValue.filter((e, index) => idx !== index);
		setCurrentValue([...newVal]);
		props.onChange([...newVal])
	}

	const changeChoice = (idx, key, value) => {
		let currentValues = currentValue;
		currentValues[idx][key] = value;
		let newVal = [...currentValues];
		setCurrentValue(newVal);
		props.onChange(newVal);
	}

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
		let newState = currentValue;
		arrayMove(newState, obj.oldIndex, obj.newIndex)
		props.onChange(newState)
		setOrderChanged(Math.random().toString(36).substring(9))
	}

	React.useEffect(() => {
		store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, 'default', selected)
	}, [selected])

	return (
		<React.Fragment>
			<AddableProductContainer
				onSortEnd={e => onSortEnd(e)}
				lockToContainerEdges={true}
				useDragHandle
				className={classes.containerRoot}
				axis={'xy'}
				helperClass="addableListHandlerProduct"
			>
				{currentValue.map((choice, idx) => {
					return (
						<AddableProductChoice
							key={choice.id}
							selectedProduct={selected}
							setSelectedProduct={setSelected}
							mediaValue={choice}
							currentIndex={idx}
							removeChoice={removeChoice}
							onChange={changeChoice}
							index={idx}
						/>
					)
				})}
			</AddableProductContainer>
			<Box flexDirection="row">
				<Button className={classes.buttonFullWidth} style={{ marginTop: 10 }} onClick={() => createProduct()}>
					<Icon className={'icon-add-new'} />
					{__('Add product', 'kaliforms')}
				</Button>
			</Box>
		</React.Fragment>
	);
});
export default AddableProduct;
