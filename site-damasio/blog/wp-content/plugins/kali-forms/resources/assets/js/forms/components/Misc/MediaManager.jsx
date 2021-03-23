import React from 'react';
import { observer } from "mobx-react";
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
const { __ } = wp.i18n;
const mediaManagerStyles = makeStyles((theme, props) => {
	return {
		container: {
			border: '1px solid #E8EBF7',
			width: '100%',
			minHeight: 150,
			maxHeight: 150,
			maxWidth: 227,
			padding: theme.spacing(2),
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			cursor: 'pointer',
			background: '#fff',
			borderRadius: (props) => { return props.shrinkMargin ? '4px 4px 0 0' : 4 },
			marginTop: (props) => props.shrinkMargin || props.noMarginTop ? 0 : theme.spacing(3),
			position: 'relative',
			'& > img': {
				maxWidth: '100%'
			}
		},
		icon: {
			fontSize: '2.8rem',
		},
		removeImage: {
			color: theme.palette.error.light,
			position: 'absolute',
			right: 5,
			bottom: 5,
		}
	}
})

/**
 * Media Manager field
 */
const MediaManager = observer(props => {
	/**
	 * Styles for the media manager
	 */
	const classes = mediaManagerStyles(props);
	/**
	 * Default values
	 */
	const [mediaValue, setMediaValue] = props.mediaValue === '' ? React.useState({ id: null }) : React.useState(props.mediaValue);

	React.useEffect(() => {
		if (JSON.stringify(mediaValue) !== JSON.stringify(props.mediaValue) && typeof props.onChange === 'function') {
			props.onChange(mediaValue)
		}
	}, [mediaValue])

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
			multiple: false,
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
	const createAndOpenMedia = (event) => {
		if (event.target.classList.contains('icon-remove')) {
			return;
		};
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

			selection.each(attachment => {
				let url = attachment.attributes.sizes.hasOwnProperty('form-edit-image-preview') ? attachment.attributes.sizes['form-edit-image-preview'].url : attachment.attributes.sizes['medium'].url;
				setMediaValue({
					fullUrl: attachment.attributes.url,
					id: attachment.attributes.id,
					preview: url,
				})
			});
		}

		mediaInstance.on('close', setImage);
		mediaInstance.on('select', setImage);
		mediaInstance.open();
	}


	return (
		<div className={classes.container} onClick={(e) => createAndOpenMedia(e)}>
			<If condition={mediaValue.id === null}>
				<React.Fragment>
					<Icon className={'icon-upload ' + classes.icon} />
					{__('Media Manager', 'kaliforms')}
				</React.Fragment>
			</If>
			<If condition={mediaValue.id !== null}>
				<React.Fragment>
					<img src={mediaValue.preview} />
					<If condition={!props.shrinkMargin}>
						<Icon
							className={'icon-remove ' + classes.removeImage}
							onClick={e => {
								typeof props.removeCallback === 'function'
									? props.removeCallback.call('', props.currentIndex)
									: setMediaValue({ id: null })
							}}
						/>
					</If>
				</React.Fragment>
			</If>
		</div>
	)
})

export default MediaManager;
