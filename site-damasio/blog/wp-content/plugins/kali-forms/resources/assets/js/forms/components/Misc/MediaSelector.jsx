import React from 'react';
import { observer } from "mobx-react";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from './../Misc/MinimalButton'
import { makeStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon';
import MediaManager from './MediaManager';
import { useEffect } from 'react';
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

		container: {
			position: 'relative',
		},
		buttonFullWidth: {
			width: '100%',
			'& .MuiIcon-root': {
				marginRight: theme.spacing(1),
			},
		},
		icon: {
			color: theme.palette.error.light,
			cursor: 'pointer',
			position: 'absolute',
			bottom: 10,
			right: 5,
			zIndex: 1000,
		},
		mediaManager: {
			marginTop: -12
		},
		actionFooter: {
			background: '#fff',
			border: '1px solid #E8EBF7',
			borderTop: 'none',
			borderRadius: '0 0 4px 4px',
			paddingLeft: theme.spacing(1),
			paddingRight: theme.spacing(1),
			position: 'relative',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
		},
		radio: {
			marginRight: 0,
		},
		dragHandle: {
			cursor: 'move',
			position: 'absolute',
			bottom: 10,
			left: 5,
			zIndex: 1000,
		}
	}
});
const MediaSelector = observer((props) => {
	/**
	 * Determines the value, type. Before this version, we had only id's separated by comma
	 */
	const determineValueType = val => {
		if (Array.isArray(val)) {
			return val;
		}

		let arr = [];
		let attachments = val.split(',');
		attachments.map(attachment => {
			if (attachment === '') {
				return;
			}

			arr.push({ id: attachment, preview: '', fullUrl: '' });
		})

		return arr;
	}

	const [currentValue, setCurrentValue] = React.useState(determineValueType(props.value))

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

				selections.push(img);
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

	useEffect(() => {
		setCurrentValue(determineValueType(props.value))
	}, [props.value])

	return (
		<React.Fragment>
			<Grid container direction="row" spacing={2} style={{ marginTop: 16 }}
				className={classes.containerRoot}
			>
				{currentValue.map((choice, idx) => {
					return (
						<Grid item
							xs={4}
							key={choice.id + idx + Math.floor(Math.random() * 100)}
						>
							<Box className={classes.container}>
								<MediaManager
									title={__('Select image', 'kaliforms')}
									buttonLabel={__('Use selected image', 'kaliforms')}
									mediaValue={choice}
									currentIndex={idx}
									noMarginTop={true}
									removeCallback={removeChoice}
								/>
							</Box>
						</Grid>
					)
				})}
			</Grid>
			<Box flexDirection="row">
				<Button className={classes.buttonFullWidth} style={{ marginTop: currentValue.length > 0 ? 10 : 25 }} onClick={() => createAndOpenMedia()}>
					<Icon className={'icon-add-new'} />
					{__('Add media', 'kaliforms')}
				</Button>
			</Box>
		</React.Fragment>
	);
});
export default MediaSelector;
