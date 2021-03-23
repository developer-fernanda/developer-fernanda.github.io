import React from 'react';
import { observer } from "mobx-react";
import { store } from './../../store/store';
import Grid from '@material-ui/core/Grid';
import MultipleThankYouMessageEditor from './MultipleThankYouMessageEditor';
import MultipleThankYouMessageItem from './MultipleThankYouMessageItem';
import Button from './../Misc/MinimalButton';
const { __ } = wp.i18n;
const MultipleThankYouMessage = observer(() => {
	const [editorOpen, setEditorOpen] = React.useState(false);
	const [editedCondition, setEditedCondition] = React.useState(false);

	const addNewConditionalMesssage = () => {
		store._FORM_INFO_.conditionalThankYouMessage.push({
			message: '',
			name: __('New thank you message', 'kaliforms'),
			condition: {
				if: '',
				operator: '',
				value: ''
			}
		});
	}
	return (
		<React.Fragment>
			<If condition={!editorOpen}>
				<Grid item xs={12}>
					<MultipleThankYouMessageItem
						message={store._FORM_INFO_.thankYouMessage}
						default={true}
						setEditedCondition={setEditedCondition}
						setEditorOpen={setEditorOpen}
					/>
				</Grid>
				{
					store._FORM_INFO_.conditionalThankYouMessage.map((message, idx) =>
						<Grid item xs={12} key={idx + Math.floor(Math.random() * 100)}>
							<MultipleThankYouMessageItem
								message={message}
								setEditorOpen={setEditorOpen}
								setEditedCondition={setEditedCondition}
								messageIndex={idx}
								editedCondition={editedCondition}
							/>
						</Grid>
					)
				}
				<Grid item xs={12}>
					<Button onClick={() => addNewConditionalMesssage()}>
						{__('Add thank you message', 'kaliforms')}
					</Button>
				</Grid>
			</If>
			<If condition={editorOpen}>
				<MultipleThankYouMessageEditor editedCondition={editedCondition} setEditorOpen={setEditorOpen} />
			</If>
		</React.Fragment>
	)
});

export default MultipleThankYouMessage
