import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import PlaceholderDialogOpener from './../../components/PlaceholderDialog/PlaceholderDialogOpener'
import Checkbox from './../Misc/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import emailEditorStyles from './EmailEditorStyles';
import { observer } from "mobx-react";
import { store } from "./../../store/store";
import MUIRichTextEditor from 'mui-rte'
import { ContentState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import CodeIcon from '@material-ui/icons/Code'
import BootstrapInput from './../BootstrapInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import MediaSelector from '../Misc/MediaSelector';
import Paper from '@material-ui/core/Paper';
const { __ } = wp.i18n;

const EmailEditor = observer(props => {
	const classes = emailEditorStyles();
	let currentIndex = store._UI_.activeEmailInSidebar;
	const getFileFields = () => {
		let fieldComponents = [];

		store._FIELD_COMPONENTS_.fieldComponents.map(e => {
			if (e.id === 'fileUpload' || (e.id === 'digitalSignature' && e.properties.saveAsImage)) {
				fieldComponents.push({
					type: e.id,
					name: e.properties.caption !== '' ? e.properties.caption : e.properties.id,
					value: e.properties.name,
					checked: false,
				})
			}
		});
		return fieldComponents;
	}
	const fileFields = getFileFields();

	const getInitialValue = (idx) => {
		if (typeof idx === 'undefined') {
			idx = store._UI_.activeEmailInSidebar;
		}
		let valFromStore = store._EMAILS_.emails[store._UI_.activeEmailInSidebar].emailBody;
		let initialValue = htmlToDraft(valFromStore);
		let state = convertToRaw(ContentState.createFromBlockArray(
			initialValue.contentBlocks,
			initialValue.entityMap
		));
		return state;
	}

	const [emailBody, setEmailBody] = useState('')

	useEffect(() => {
		if (!store._EMAILS_.emails.length && !isNaN(store._UI_.activeEmailInSidebar)) {
			return;
		}

		let state = getInitialValue(currentIndex);
		setEmailBody(JSON.stringify(state));
		return () => setEmailBody('');
	}, [currentIndex])

	const setEmailBodyToString = (val) => {
		debouncedSaveToStore(val, currentIndex);
	}

	const saveToStore = (value, currentIndex) => {
		let currentContent = value.getCurrentContent();
		let state = draftToHtml(convertToRaw(currentContent));
		store._EMAILS_.setEmailProp(currentIndex, 'emailBody', state)
	}
	const debouncedSaveToStore = _.debounce(saveToStore, 500);

	const changeEmailAttachmentCheckbox = (e, val) => {
		let currentState = store._EMAILS_.getPropertyValue(store._UI_.activeEmailInSidebar, 'emailAttachment');
		let arr = currentState === '' ? [] : currentState.split(',');
		e.target.checked ? arr.push(val) : arr = arr.filter(e => e !== val)
		store._EMAILS_.setEmailProp(store._UI_.activeEmailInSidebar, 'emailAttachment', arr.join(','))
	}

	/**
	 * Remove email ( happens after dialog )
	 */
	const _removeEmail = () => {
		let idx = store._UI_.activeEmailInSidebar;
		store._UI_.setActiveEmailInSidebar(false);
		store._EMAILS_.removeEmail(idx);
	}
	/**
	 * Duplicate email ( happens after dialog )
	 */
	const _duplicateEmail = () => {
		store._EMAILS_.duplicateEmail(store._UI_.activeEmailInSidebar);
	}

	/**
	 * Duplicates an email
	 */
	const duplicateEmail = () => {
		store._CONFIRMATION_DIALOG_.setTitle(__('Duplicate notification', 'kaliforms'));
		store._CONFIRMATION_DIALOG_.setMessage(__('Are you sure you want to duplicate this notification', 'kaliforms'));
		store._CONFIRMATION_DIALOG_.setAction(_duplicateEmail)
		store._CONFIRMATION_DIALOG_.setState(true);
	}
	/**
	 * Removes an email from the list
	 */
	const removeEmail = () => {
		store._CONFIRMATION_DIALOG_.setTitle(__('Remove notification', 'kaliforms'));
		store._CONFIRMATION_DIALOG_.setMessage(__('Are you sure you want to delete this notification', 'kaliforms'));
		store._CONFIRMATION_DIALOG_.setAction(_removeEmail)
		store._CONFIRMATION_DIALOG_.setState(true);
	}

	return (
		<React.Fragment>
			<Paper className={classes.formEmailsPlaceholder}>
				<Grid container direction="row" spacing={3}>
					<Grid item xs={12}>
						<FormControl>
							<InputLabel shrink>
								{__('Email subject', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								id="emailSubject"
								value={store._EMAILS_.getPropertyValue(store._UI_.activeEmailInSidebar, 'emailSubject')}
								placeholder={__('Hello World!', 'kaliforms')}
								fullWidth={true}
								endAdornment={(
									<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
								)}
								onChange={e => store._EMAILS_.setEmailProp(store._UI_.activeEmailInSidebar, 'emailSubject', e.target.value)} />
						</FormControl>
					</Grid>
				</Grid>
				<Grid container direction="row" spacing={3}>
					<Grid item xs={6}>
						<FormControl>
							<InputLabel shrink>
								{__('Sender name', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								id="fromName"
								value={store._EMAILS_.getPropertyValue(store._UI_.activeEmailInSidebar, 'fromName')}
								placeholder={__("John Doe...", 'kaliforms')}
								fullWidth={true}
								endAdornment={(
									<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
								)}
								onChange={e => store._EMAILS_.setEmailProp(store._UI_.activeEmailInSidebar, 'fromName', e.target.value)} />
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<FormControl>
							<InputLabel shrink>
								{__('Sender email', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								id="fromName"
								value={store._EMAILS_.getPropertyValue(store._UI_.activeEmailInSidebar, 'fromEmail')}
								placeholder="johndoe@wordpress.site"
								fullWidth={true}
								endAdornment={(
									<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
								)}
								onChange={e => store._EMAILS_.setEmailProp(store._UI_.activeEmailInSidebar, 'fromEmail', e.target.value)} />
						</FormControl>
					</Grid>
				</Grid>
				<Grid container direction="row" spacing={3}>
					<Grid item xs={6}>
						<FormControl>
							<InputLabel shrink>
								{__('Send notification to', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								id="toEmail"
								value={store._EMAILS_.getPropertyValue(store._UI_.activeEmailInSidebar, 'toEmail')}
								placeholder="janedoe@wordpress.site"
								fullWidth={true}
								onChange={e => store._EMAILS_.setEmailProp(store._UI_.activeEmailInSidebar, 'toEmail', e.target.value)}
								endAdornment={(
									<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
								)}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<FormControl>
							<InputLabel shrink>
								{__('Reply to', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								id="replyTo"
								value={store._EMAILS_.getPropertyValue(store._UI_.activeEmailInSidebar, 'replyTo')}
								placeholder="johndoe@wordpress.site"
								fullWidth={true}
								onChange={e => store._EMAILS_.setEmailProp(store._UI_.activeEmailInSidebar, 'replyTo', e.target.value)}
								endAdornment={(
									<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
								)}
							/>
						</FormControl>
					</Grid>
				</Grid>
				<Grid container direction="row" spacing={3}>
					<Grid item xs={6}>
						<FormControl>
							<InputLabel shrink>
								{__('Send copy to', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								id="ccEmail"
								value={store._EMAILS_.getPropertyValue(store._UI_.activeEmailInSidebar, 'ccEmail')}
								placeholder="johndoe@wordpress.site"
								fullWidth={true}
								onChange={e => store._EMAILS_.setEmailProp(store._UI_.activeEmailInSidebar, 'ccEmail', e.target.value)}
								endAdornment={(
									<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
								)}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<FormControl>
							<InputLabel shrink>
								{__('Send hidden copy to', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								id="bccEmail"
								value={store._EMAILS_.getPropertyValue(store._UI_.activeEmailInSidebar, 'bccEmail')}
								placeholder="janedoe@wordpress.site"
								fullWidth={true}
								onChange={e => store._EMAILS_.setEmailProp(store._UI_.activeEmailInSidebar, 'bccEmail', e.target.value)}
								endAdornment={(
									<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
								)}
							/>
						</FormControl>
					</Grid>
				</Grid>
				<Grid container direction="row" spacing={3}>
					<Grid item xs={12}>
						<FormControl>
							<InputLabel shrink>
								{__('Email body', 'kaliforms')}
							</InputLabel>
							<MUIRichTextEditor
								value={emailBody}
								label={'Hello world - start typing ....'}
								customControls={[
									{
										name: "open-placeholder-dialog",
										icon: <CodeIcon />,
										type: "callback",
										onClick: (editorState, name, anchor) => store._UI_.setPlaceholderDialog(true)
									}
								]}
								controls={["title", "bold", "italic", "link", "numberList", "bulletList", "open-placeholder-dialog"]}
								onChange={e => setEmailBodyToString(e)}
							/>
						</FormControl>
					</Grid>
				</Grid>
				<Grid container direction="row" spacing={3}>
					<Grid item xs={12}>
						<FormControl>
							<InputLabel shrink>
								{__('Path (not URL) to file to be attached to email', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								id="emailAttachmentFilePaths"
								value={store._EMAILS_.getPropertyValue(store._UI_.activeEmailInSidebar, 'emailAttachmentFilePaths')}
								placeholder="path/to/file.zip"
								fullWidth={true}
								onChange={e => store._EMAILS_.setEmailProp(store._UI_.activeEmailInSidebar, 'emailAttachmentFilePaths', e.target.value)}
								startAdornment={(
									<InputAdornment position="start">{KaliFormsObject.ABSPATH}</InputAdornment>
								)}
							/>
							<FormHelperText>
								{__('Path to your WordPress folder is:', 'kaliforms') + ' ' + KaliFormsObject.ABSPATH}
							</FormHelperText>
						</FormControl>
					</Grid>
				</Grid>
				<Grid container direction="row" spacing={3}>
					<Grid item xs={12}>
						<FormControl>
							<InputLabel shrink>
								{__('Attach files from media library', 'kaliforms')}
							</InputLabel>
							<MediaSelector
								value={store._EMAILS_.getPropertyValue(store._UI_.activeEmailInSidebar, 'emailAttachmentMediaIds') || ''}
								onChange={e => store._EMAILS_.setEmailProp(store._UI_.activeEmailInSidebar, 'emailAttachmentMediaIds', e)}
							/>
						</FormControl>
					</Grid>
				</Grid>
				<If condition={fileFields.length > 0}>
					<Grid container direction="row" spacing={4}>
						<Grid item xs={12}>
							<FormControl>
								<InputLabel shrink>
									{__('Attach the file(s) from the following fields to this email:', 'kaliforms')}
								</InputLabel>
								<br />
								{
									fileFields.map(field => (
										<FormControlLabel
											key={field.value}
											control={
												<Checkbox
													checked={store._EMAILS_.getPropertyValue(store._UI_.activeEmailInSidebar, 'emailAttachment').split(',').includes(field.value)}
													onChange={e => changeEmailAttachmentCheckbox(e, field.value)}
													key={field.value}
													value={field.value} />
											}
											label={field.name}
										/>
									))}
							</FormControl>
						</Grid>
					</Grid>
				</If>
				<Box className={classes.emailFooterPlaceholder}></Box>
				<Box className={classes.emailEditorFooter}>
					<Button
						variant="text"
						onClick={() => duplicateEmail()}
					>
						<Icon className="icon-copy" />
						{__('Duplicate email', 'kaliforms')}
					</Button>

					<Button variant="text"
						onClick={() => removeEmail()}>
						<Icon className="icon-remove" />
						{__('Remove email', 'kaliforms')}
					</Button>
				</Box>
			</Paper>
		</React.Fragment >
	);
})

export default EmailEditor;

