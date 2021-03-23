import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import CodeIcon from '@material-ui/icons/Code';
import { ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { observer } from "mobx-react";
import MUIRichTextEditor from 'mui-rte';
import React from 'react';
import { store } from './../../store/store';
import Button from './../Misc/MinimalButton';
import MultipleThankYouMessageConditioner from './MultipleThankYouMessageConditioner';
const { __ } = wp.i18n;

const MultipleThankYouMessageEditor = observer(props => {
	const [thankYouMessage, setThankYouMessage] = React.useState('');

	React.useEffect(() => {
		let state = getEditorValue(store._FORM_INFO_.thankYouMessage);
		setThankYouMessage(JSON.stringify(state));

		return () => setThankYouMessage('');
	}, [])

	React.useEffect(() => {
		if (props.editedCondition === 'default') {
			return;
		}
		let state = getEditorValue(store._FORM_INFO_.conditionalThankYouMessage[props.editedCondition].message);
		setThankYouMessage(JSON.stringify(state));

		return () => setThankYouMessage('');
	}, [props.editedCondition])

	const getEditorValue = (val) => {
		let valFromStore = htmlToDraft(val)
		let state = convertToRaw(ContentState.createFromBlockArray(
			valFromStore.contentBlocks,
			valFromStore.entityMap
		))

		return state;
	}

	const setEditorToString = (val) => {
		debouncedSaveToStore(val, props.editedCondition);
	}

	const saveToStore = (value, saver) => {
		let currentContent = value.getCurrentContent();
		let state = draftToHtml(convertToRaw(currentContent));

		saver === 'default'
			? store._FORM_INFO_.thankYouMessage = state
			: store._FORM_INFO_.conditionalThankYouMessage[saver].message = state
	}

	const debouncedSaveToStore = _.debounce(saveToStore, 500);

	return (
		<React.Fragment>
			<If condition={!isNaN(props.editedCondition)}>
				<MultipleThankYouMessageConditioner editedCondition={props.editedCondition} />
			</If>
			<Grid item xs={12}>
				<FormControl>
					<InputLabel shrink>
						{__('Thank you message', 'kaliforms')}
					</InputLabel>
					<MUIRichTextEditor
						label={__('Start typing ...', 'kaliforms')}
						value={thankYouMessage}
						customControls={[
							{
								name: "open-placeholder-dialog",
								icon: <CodeIcon />,
								type: "callback",
								onClick: (editorState, name, anchor) => store._UI_.setPlaceholderDialog(true)
							}
						]}
						controls={["title", "bold", "italic", "link", "numberList", "bulletList", "open-placeholder-dialog"]}
						onChange={e => setEditorToString(e)}
					/>
				</FormControl>
			</Grid>
			<Grid item xs={12}>
				<Button onClick={e => props.setEditorOpen(false)}>{__('Back to listing', 'kaliforms')}</Button>
			</Grid>
		</React.Fragment>
	)
});

export default MultipleThankYouMessageEditor
