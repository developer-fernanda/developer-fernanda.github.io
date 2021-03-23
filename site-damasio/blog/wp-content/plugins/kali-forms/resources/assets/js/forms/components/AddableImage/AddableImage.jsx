import React from 'react';
import { observer } from "mobx-react";
import { store } from './../../store/store';
import AddableImageContainer from './AddableImageContainer';
import AddableImageChoice from './AddableImageChoice';
import Box from '@material-ui/core/Box';
import Button from './../Misc/MinimalButton'
import { makeStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon';
const { __ } = wp.i18n;
const addableImageStyles = makeStyles(theme => {
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
const updateValueToNewSpecs = arr => {
	let updated = [];
	arr.map(item => {
		if (item.hasOwnProperty('image')) {
			updated.push(item);
			return;
		}

		updated.push({ image: item, label: '', caption: '' });
	});

	return updated;
}
const AddableImage = observer((props) => {
	const [currentValue, setCurrentValue] = React.useState(Array.isArray(props.choices) ? updateValueToNewSpecs(props.choices) : [])
	const [selected, setSelected] = React.useState(props.default);
	const [orderChanged, setOrderChanged] = React.useState('');
	/**
	 * We need to keep an instance for the media frame
	 */
	let mediaInstance = null;
	/**
	 * Open current media frame
	 */
	const openMedia = () => {
		let options = {
			title: props.title,
			multiple: true,
			button: {
				text: props.buttonLabel
			},
			library: {
				type: 'image'
			},
			state: 'insert',
			frame: 'post',
		}

		return wp.media(options)
	}

	/**
	 * Instance creator
	 */
	const createAndOpenMedia = () => {
		if (mediaInstance !== null) {
			mediaInstance.open();
			return;
		}
		mediaInstance = openMedia();
		const setImage = () => {
			let selection = mediaInstance.state().get('selection');

			if (!selection) {
				return;
			}

			let selections = [];
			selection.each(attachment => {
				let url = attachment.attributes.sizes.hasOwnProperty('form-edit-image-preview') ? attachment.attributes.sizes['form-edit-image-preview'].url : attachment.attributes.sizes['medium'].url;
				let img = {
					fullUrl: attachment.attributes.url,
					id: attachment.attributes.id,
					preview: url,
				}
				let val = {
					id: 'imageRadioItem-' + Math.floor(Math.random() * 100),
					label: '',
					caption: '',
					image: img,
				};
				selections.push(val);
			});

			setCurrentValue([...currentValue, ...selections])
			props.onChange([...currentValue, ...selections]);
		}

		mediaInstance.on('close', setImage);
		mediaInstance.on('select', setImage);
		mediaInstance.open();
	}

	const classes = addableImageStyles();

	const removeChoice = (idx) => {
		let newVal = currentValue.filter((e, index) => idx !== index);
		setCurrentValue([...newVal]);
		props.onChange([...newVal])
	}

	const changeChoice = (idx, key, value) => {
		let currentValues = currentValue;
		currentValues[idx][key] = value;
		setCurrentValue(currentValues);
		props.onChange(currentValues);
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
			<AddableImageContainer
				onSortEnd={e => onSortEnd(e)}
				lockToContainerEdges={true}
				useDragHandle
				className={classes.containerRoot}
				axis={'xy'}
				helperClass="addableListHandlerImage"
			>
				{currentValue.map((choice, idx) => {
					return (
						<AddableImageChoice
							key={choice.image.id.toString()}
							selectedImage={selected}
							setSelectedImage={setSelected}
							mediaValue={choice}
							currentIndex={idx}
							removeChoice={removeChoice}
							onChange={changeChoice}
							index={idx}
						/>
					)
				})}
			</AddableImageContainer>
			<Box flexDirection="row">
				<Button className={classes.buttonFullWidth} style={{ marginTop: 10 }} onClick={() => createAndOpenMedia()}>
					<Icon className={'icon-add-new'} />
					{__('Add choice', 'kaliforms')}
				</Button>
			</Box>
		</React.Fragment>
	);
});
export default AddableImage;
