import React, { useState, useEffect } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import PlaceholderDialogOpener from './../PlaceholderDialog/PlaceholderDialogOpener'
import Grid from '@material-ui/core/Grid'
import MUIRichTextEditor from 'mui-rte'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { observer } from "mobx-react";
import { store } from "./../../store/store";
import emailWizardStyles from './EmailWizardStyles'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import BootstrapInput from './../BootstrapInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CodeIcon from '@material-ui/icons/Code';
import Box from '@material-ui/core/Box';
import StyledButton from './../StyledButton';
const { __ } = wp.i18n;
/**
 * Email wizard components
 *
 * @param {*} props
 */
const EmailWizard = observer((props) => {
	const classes = emailWizardStyles();
	const [activeStep, setActiveStep] = useState(0);
	const [emailSubject, setEmailSubject] = useState('');
	const [fromEmail, setFromEmail] = useState('');
	const [fromName, setFromName] = useState('');
	const [toEmail, setToEmail] = useState('');
	const [emailBody, setEmailBody] = useState('');
	const [emailBodyToSave, setEmailBodyToSave] = useState('')
	const [errors, setErrors] = useState([]);
	const setEmailBodyToString = (val) => {
		debouncedSaveToStore(val);
	}

	const saveToStore = (value) => {
		let currentContent = value.getCurrentContent();
		let state = draftToHtml(convertToRaw(currentContent));
		setEmailBodyToSave(state);
	}
	const debouncedSaveToStore = _.debounce(saveToStore, 200);

	/**
	 * Handles the next button
	 */
	const handleNext = () => {
		let currentErrors = [...errors];
		switch (activeStep) {
			case 0:
				if (emailSubject === '') {
					currentErrors.push('emailSubject');
				}
				break;
			case 1:
				if (fromEmail === '') {
					currentErrors.push('fromEmail')
				}
				if (fromName === '') {
					currentErrors.push('fromName');
				}
				break;
			case 2:
				if (toEmail === '') {
					currentErrors.push('toEmail')
				}
				break;
		}
		setErrors(currentErrors);
		let errorMap = {
			0: ['emailSubject'],
			1: ['fromEmail', 'fromName'],
			2: ['toEmail']
		}

		let currentStepHasError = false;
		errorMap[activeStep].map(e => {
			if (currentStepHasError) {
				return;
			}

			currentStepHasError = currentErrors.includes(e);
		})

		currentStepHasError ? false : setActiveStep(prevActiveStep => prevActiveStep + 1);
	};

	useEffect(() => {
		let currentErrors = [...errors];

		if (currentErrors.includes('emailSubject') && emailSubject !== '') {
			currentErrors = currentErrors.filter(e => e !== 'emailSubject')
		}
		if (currentErrors.includes('fromEmail') && fromEmail !== '') {
			currentErrors = currentErrors.filter(e => e !== 'fromEmail')
		}
		if (currentErrors.includes('fromName') && fromName !== '') {
			currentErrors = currentErrors.filter(e => e !== 'fromName')
		}
		if (currentErrors.includes('toEmail') && toEmail !== '') {
			currentErrors = currentErrors.filter(e => e !== 'toEmail')
		}
		if (currentErrors.includes('emailBody') && emailBody !== '') {
			currentErrors = currentErrors.filter(e => e !== 'emailBody')
		}

		setErrors([...currentErrors]);
	}, [emailSubject, fromEmail, fromName, toEmail, emailBody])

	/**
	 * Handle the back button
	 */
	const handleBack = () => {
		let currentErrors = [...errors];
		switch (activeStep) {
			case 1:
				currentErrors = currentErrors.filter(e => e !== 'fromName' || e !== 'fromEmail')
				break;
			case 2:
				currentErrors = currentErrors.filter(e => e !== 'toEmail')
				break;
			case 3:
				currentErrors = currentErrors.filter(e => e !== 'emailBody')
				break;
		}
		setErrors(currentErrors);
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};
	/**
	 * Handles closing
	 */
	const handleClose = () => {
		store._EMAILS_.emailWizardVisibility = false;
	};
	/**
	 * Handle step wizard finish
	 */
	const handleFinish = () => {
		store._EMAILS_.addEmail({
			fromName: fromName,
			fromEmail: fromEmail,
			toEmail: toEmail,
			replyTo: '',
			ccEmail: '',
			bccEmail: '',
			emailSubject: emailSubject,
			emailAttachmentFilePaths: '',
			emailAttachment: '',
			emailAttachmentMediaIds: '',
			emailBody: emailBodyToSave
		})
		store._UI_.setActiveEmailInSidebar(false)
		/**
		 * Close the dialog
		 */
		store._EMAILS_.emailWizardVisibility = false;
		store._UI_.setActiveEmailInSidebar(store._EMAILS_.emails.length - 1)
	};

	/**
	 * When dialog exists, we need to reset the wizard
	 */
	const onExit = () => {
		setActiveStep(0);
		setFromEmail('');
		setToEmail('');
		setEmailSubject('');
		setFromName('');
		setEmailBody('');
		setEmailBodyToSave('');
		setErrors([]);
		store._EMAILS_.emailWizardVisibility = false;
	}

	return (
		<Dialog
			open={store._EMAILS_.emailWizardVisibility}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			fullWidth={true}
			onClose={handleClose}
			onExited={onExit}
			maxWidth="md"
		>
			<DialogContent>
				<Stepper activeStep={activeStep} orientation="vertical">
					<Step>
						<If condition={activeStep === 0}>
							<StepLabel>
								{__('What is this email for?', 'kaliforms')}
							</StepLabel>
						</If>
						<If condition={activeStep > 0}>
							<StepLabel>
								{__('This email is used for:')}
								<br />
								<small>{emailSubject}</small>
							</StepLabel>
						</If>
						<StepContent>
							<Typography>
								<span dangerouslySetInnerHTML={{ __html: __('Add the subject for this email in the field below. (You can click the <> icon in order to add placeholders for your form fields)', 'kaliforms') }}></span>
							</Typography>
							<Grid container direction="row" spacing={8}>
								<Grid item xs={6}>
									<FormControl error={errors.includes('emailSubject')}>
										<InputLabel shrink>
											{__('Email subject', 'kaliforms')}
										</InputLabel>
										<BootstrapInput
											id="emailSubject"
											value={emailSubject}
											placeholder={__('Hello World!', 'kaliforms')}
											fullWidth={true}
											endAdornment={(
												<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
											)}
											onChange={(e) => setEmailSubject(e.target.value)}
										/>
									</FormControl>
								</Grid>
							</Grid>
							<Box className={classes.actionsContainer}>
								<Box>
									<StyledButton
										onClick={handleNext}
										className={classes.button}
									>
										{__('Next', 'kaliforms')}
									</StyledButton>
								</Box>
							</Box>
						</StepContent>
					</Step>
					<Step>
						<If condition={activeStep <= 1}>
							<StepLabel>
								{__('Who is sending this email?', 'kaliforms')}
							</StepLabel>
						</If>
						<If condition={activeStep > 1}>
							<StepLabel>
								{__('The email sender is:', 'kaliforms')}
								<br />
								<small>{fromName} - {fromEmail}</small>
							</StepLabel>
						</If>
						<StepContent>
							<Typography>
								<span dangerouslySetInnerHTML={{ __html: __('Please specify the name and email of the sender in the fields below. (You can click the <> icon in order to add placeholders for your form fields)', 'kaliforms') }}></span>
							</Typography>
							<Grid container direction="row" spacing={8}>
								<Grid item xs={6}>
									<FormControl error={errors.includes('fromName')}>
										<InputLabel shrink>
											{__('Sender name', 'kaliforms')}
										</InputLabel>
										<BootstrapInput
											id="fromName"
											value={fromName}
											placeholder="John Doe..."
											fullWidth={true}
											variant="filled"
											endAdornment={(
												<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
											)}
											onChange={(e) => setFromName(e.target.value)}
										/>
									</FormControl>
								</Grid>
								<Grid item xs={6}>
									<FormControl error={errors.includes('fromEmail')}>
										<InputLabel shrink>
											{__('Sender email', 'kaliforms')}
										</InputLabel>
										<BootstrapInput
											id="fromEmail"
											value={fromEmail}
											placeholder="johndoe@wordpress.site"
											fullWidth={true}
											endAdornment={(
												<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
											)}
											onChange={(e) => setFromEmail(e.target.value)}
										/>
									</FormControl>
								</Grid>
							</Grid>
							<Box className={classes.actionsContainer}>
								<Box>
									<StyledButton
										onClick={handleBack}
										className={classes.button}
									>
										{__('Back', 'kaliforms')}
									</StyledButton>
									<StyledButton
										onClick={handleNext}
										className={classes.button}
									>
										{__('Next', 'kaliforms')}
									</StyledButton>
								</Box>
							</Box>
						</StepContent>
					</Step>
					<Step>
						<If condition={activeStep <= 2}>
							<StepLabel>
								{__('Who will receive this email?', 'kaliforms')}
							</StepLabel>
						</If>
						<If condition={activeStep > 2}>
							<StepLabel>
								{__('The email will be sent to:', 'kaliforms')}
								<br />
								<small>{toEmail}</small>
							</StepLabel>
						</If>
						<StepContent>
							<Typography>
								<span dangerouslySetInnerHTML={{ __html: __('Please specify the email of the person that will receive this email in the field below. (You can click the <> icon in order to add placeholders for your form fields)', 'kaliforms') }}></span>
							</Typography>
							<Grid container direction="row" spacing={8}>
								<Grid item xs={6}>
									<FormControl error={errors.includes('toEmail')}>
										<InputLabel shrink>
											{__('Send notification to', 'kaliforms')}
										</InputLabel>
										<BootstrapInput
											id="toEmail"
											value={toEmail}
											placeholder="janedoe@wordpress.site"
											fullWidth={true}
											endAdornment={(
												<PlaceholderDialogOpener adornment={true}></PlaceholderDialogOpener>
											)}
											onChange={(e) => setToEmail(e.target.value)}
										/>
									</FormControl>
								</Grid>
							</Grid>
							<Box className={classes.actionsContainer}>
								<Box>
									<StyledButton
										onClick={handleBack}
										className={classes.button}
									>
										{__('Back', 'kaliforms')}
									</StyledButton>
									<StyledButton
										onClick={handleNext}
										className={classes.button}
									>
										{__('Next', 'kaliforms')}
									</StyledButton>
								</Box>
							</Box>
						</StepContent>
					</Step>
					<Step>
						<StepLabel>
							{__('What information is sent through this email?', 'kaliforms')}
						</StepLabel>
						<StepContent>
							<Typography>
								<span dangerouslySetInnerHTML={{ __html: __('Please write the message of the email in the field below. (You can click the <> icon in order to add placeholders for your form fields)', 'kaliforms') }}></span>
							</Typography>
							<Grid container direction="row" spacing={8}>
								<Grid item xs={10}>
									<MUIRichTextEditor
										label={__('Start typing...', 'kaliforms')}
										value={emailBody}
										error={errors.includes('emailBody')}
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
								</Grid>
							</Grid>
							<Box className={classes.actionsContainer}>
								<Box>
									<StyledButton
										onClick={handleBack}
										className={classes.button}
									>
										{__('Back', 'kaliforms')}
									</StyledButton>
									<StyledButton
										onClick={handleFinish}
										className={classes.button}
									>
										{__('Finish', 'kaliforms')}
									</StyledButton>
								</Box>
							</Box>
						</StepContent>
					</Step>
				</Stepper >
			</DialogContent>
		</Dialog>
	);
})

export default EmailWizard;
