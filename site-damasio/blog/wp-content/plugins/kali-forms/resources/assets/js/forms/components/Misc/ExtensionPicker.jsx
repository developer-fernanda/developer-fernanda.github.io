import React from 'react';
import Box from '@material-ui/core/Box';
import Checkbox from './Checkbox';
import BootstrapInput from './../BootstrapInput';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import { store } from "./../../store/store";
import { makeStyles } from '@material-ui/core/styles';
import { observer } from "mobx-react";
import Button from '@material-ui/core/Button';
const { __ } = wp.i18n;
const extensionPickerStyles = makeStyles(theme => {
	return {
		checkboxContainer: {},
		categoryLabel: {
			fontSize: 12,
			color: 'rgba(0, 0, 0, 0.54)',
			display: 'inline-block',
			marginBottom: theme.spacing(.5),
		},
		selectAllContainer: {
			marginTop: theme.spacing(2),
			textAlign: 'right',
			display: 'inline-block',
		},
		advancedButton: {
			textTransform: 'initial',
			fontWeight: 'normal',
			'&:hover': {
				background: 'transparent',
				color: theme.palette.primary.main,
			}
		}
	}
})

const ExtensionPicker = observer((props) => {
	const [simple, setSimple] = React.useState(true);
	const [selectedAll, setSelectedAll] = React.useState(false);
	const [extensions, setExtensions] = React.useState([
		{ checked: false, extension: '.jpg', value: 'image/jpeg,image/pjpeg', category: 'images' },
		{ checked: false, extension: '.jpeg', value: 'image/jpeg,image/pjpeg', category: 'images' },
		{ checked: false, extension: '.png', value: 'image/png', category: 'images' },
		{ checked: false, extension: '.gif', value: 'image/gif', category: 'images' },
		{ checked: false, extension: '.ico', value: 'image/x-icon', category: 'images' },
		{ checked: false, extension: '.pdf', value: 'application/pdf', category: 'documents' },
		{ checked: false, extension: '.doc', value: 'application/msword', category: 'documents' },
		{ checked: false, extension: '.docx', value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', category: 'documents' },
		{ checked: false, extension: '.ppt', value: 'application/mspowerpoint,application/powerpoint,application/vnd.ms-powerpoint,application/,x-mspowerpoint', category: 'documents' },
		{ checked: false, extension: '.pptx', value: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', category: 'documents' },
		{ checked: false, extension: '.pps', value: 'application/mspowerpoint,application/vnd.ms-powerpoint', category: 'documents' },
		{ checked: false, extension: '.ppsx', value: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow', category: 'documents' },
		{ checked: false, extension: '.odt', value: 'application/vnd.oasis.opendocument.text', category: 'documents' },
		{ checked: false, extension: '.xls', value: 'application/excel,application/vnd.ms-excel,application/x-excel,application/x-msexcel', category: 'documents' },
		{ checked: false, extension: '.xlsx', value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', category: 'documents' },
		{ checked: false, extension: '.psd', value: 'application/octet-stream', category: 'documents' },
		{ checked: false, extension: '.mp3', value: 'audio/mpeg3,audio/x-mpeg-3,video/mpeg,video/x-mpeg', category: 'audio' },
		{ checked: false, extension: '.m4a', value: 'audio/m4a', category: 'audio' },
		{ checked: false, extension: '.ogg', value: 'audio/ogg,', category: 'audio' },
		{ checked: false, extension: '.wav', value: 'audio/wav,audio/x-wav', category: 'audio' },
		{ checked: false, extension: '.mp4', value: 'video/mp4', category: 'video' },
		{ checked: false, extension: '.m4v', value: 'video/x-m4v', category: 'video' },
		{ checked: false, extension: '.mov', value: 'video/quicktime', category: 'video' },
		{ checked: false, extension: '.wmv', value: 'video/x-ms-asf,video/x-ms-wmv', category: 'video' },
		{ checked: false, extension: '.avi', value: 'application/x-troff-msvideo,video/avi,video/msvideo,video/x-msvideo', category: 'video' },
		{ checked: false, extension: '.mpg', value: 'audio/mpeg,video/mpeg', category: 'video' },
		{ checked: false, extension: '.ogv', value: 'video/ogg', category: 'video' },
		{ checked: false, extension: '.3gp', value: 'video/3gpp,audio/3gpp', category: 'video' },
		{ checked: false, extension: '.3g2', value: 'video/3gpp2,audio/3gpp2', category: 'video' },
		{ checked: false, extension: '.mkv', value: 'video/x-matroska', category: 'video' },
		{ checked: false, extension: '.txt', value: 'text/plain', category: 'documents' },
		{ checked: false, extension: '.csv', value: 'text/csv', category: 'documents' },
		{ checked: false, extension: '.zip', value: 'application/zip', category: 'documents' },
		{ checked: false, extension: '.7z', value: 'application/x-7z-compressed', category: 'documents' },
	])

	const categories = {
		images: __('Images', 'kaliforms'),
		documents: __('Documents', 'kaliforms'),
		audio: __('Audio', 'kaliforms'),
		video: __('Video', 'kaliforms')
	};

	React.useEffect(() => {
		let currentValue = store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id);
		let currentValues = currentValue.split(',');
		extensions.map(e => {
			let elValue = e.value.split(',');
			const found = elValue.some(r => currentValues.includes(r))
			e.checked = found;
		});
		setExtensions([...extensions]);
	}, [])

	const classes = extensionPickerStyles();

	const checkboxClick = (event, element) => {
		element.checked = !element.checked;
		let selectedExtensions = extensions.filter(e => e.checked);
		let checkboxedValue = [];
		selectedExtensions.map(e => checkboxedValue.push(e.value))
		setExtensions([...extensions]);

		store._FIELD_COMPONENTS_.updatePropertyValue(
			store._UI_.activeFormFieldInSidebar,
			props.field.id,
			checkboxedValue.join(',')
		)
	}

	const selectAll = () => {
		if (selectedAll) {
			extensions.map(e => e.checked = false);
			setExtensions([...extensions]);
			setSelectedAll(false);
		} else {
			extensions.map(e => e.checked = true);
			setExtensions([...extensions]);
			setSelectedAll(true);
		}
	}

	return (
		<React.Fragment>
			<If condition={simple}>
				<Box className={classes.checkboxContainer}>
					<InputLabel shrink>
						{props.field.label}
					</InputLabel>
					<FormGroup row>
						<FormControlLabel
							style={{ width: '80%' }}
							control={
								<Checkbox onChange={e => selectAll()} checked={selectedAll} />
							}
							label={__('Select all', 'kaliforms')}
						/>
						<Button
							disableRipple={true}
							className={classes.advancedButton}
							variant="text"
							onClick={e => setSimple(false)}
						>
							{__('Advanced', 'kaliforms')}
						</Button>
					</FormGroup>
					{
						Object.keys(categories).map(key =>
							(
								<React.Fragment key={key}>
									<span className={classes.categoryLabel}> {categories[key]}</span>
									<FormGroup row >
										{
											extensions.map((el, index) => {
												if (el.category === key) {
													return (
														<FormControlLabel
															style={{ width: '23.5%' }}
															key={el.extension}
															control={
																<Checkbox
																	value={el.value}
																	onChange={e => checkboxClick(e, el)}
																	checked={el.checked}
																/>
															}
															label={el.extension}
														/>
													)
												}
											})
										}
									</FormGroup>
								</React.Fragment>
							)
						)
					}
					<input
						type="hidden"
						value={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id)}
					/>
				</Box>
			</If>
			<If condition={!simple}>
				<FormControl>
					<InputLabel shrink>
						{props.field.label}
					</InputLabel>
					<FormGroup className={classes.selectAllContainer}>
						<Button
							disableRipple={true}
							className={classes.advancedButton}
							variant="text"
							onClick={e => setSimple(true)}
						>
							{__('Simple', 'kaliforms')}
						</Button>
					</FormGroup>
					<BootstrapInput
						value={store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id)}
						onChange={e => store._FIELD_COMPONENTS_.updatePropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id, e.target.value)}
						fullWidth={true}
						error={props.field.error}
						placeholder={props.field.label}
					/>
				</FormControl>
			</If>
		</React.Fragment>
	)
});

export default ExtensionPicker;
