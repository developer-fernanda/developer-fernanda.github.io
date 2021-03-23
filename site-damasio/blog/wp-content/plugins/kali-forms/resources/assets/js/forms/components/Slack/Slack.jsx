import React from 'react';
import { observer } from "mobx-react";
import { store } from "./../../store/store";
import SectionTitle from './../Misc/SectionTitle'
import Grid from '@material-ui/core/Grid';
import BootstrapInput from './../BootstrapInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import slackStyles from './SlackStyles';
import SlackActionEditor from './SlackActionEditor';
import SlackActionItem from './SlackActionItem';
import Box from '@material-ui/core/Box';
const { __ } = wp.i18n;
const Slack = observer(props => {
	const [editingAction, setEditingAction] = React.useState(false);
	const [newActioName, setNewActionName] = React.useState('');
	const [actionBeingEdited, setActionBeingEdited] = React.useState(0);
	const classes = slackStyles(props);

	const addAction = () => {
		let newAction = {
			name: newActioName,
			type: 'text',
			when: 'afterFormProcess',
			where: 'empty',
			fields: [],
			conditions: {
				conditions: [{ conditionalIndex: 0, formField: '', formFieldType: '', condition: 'is', value: '' }],
				conditionalLogic: 'always'
			}
		}

		store._SLACK_.addAction(newAction);

		setActionBeingEdited(store._SLACK_.actions.length - 1)
		setEditingAction(true)
		setNewActionName('')
	}

	return (
		<React.Fragment>
			<If condition={!editingAction}>
				<Grid container direction="row">
					<Grid item xs={12}>
						<FormControl>
							<InputLabel shrink>
								{__('Add a name for your Slack action', 'kaliforms')}
							</InputLabel>
							<BootstrapInput
								value={newActioName}
								onChange={e => setNewActionName(e.target.value)}
								fullWidth={true}
								endAdornment={(
									<Box className={classes.createButton}
										onClick={() => addAction()}>
										{__('Create', 'kaliforms')}
									</Box>
								)}
							/>
						</FormControl>
					</Grid>
				</Grid>

				<If condition={store._SLACK_.actions.length}>
					<SectionTitle title={__('Slack actions', 'kaliforms')} />
					<Grid container direction="row" spacing={2} alignItems="center">
						{
							store._SLACK_.actions.map((action, idx) => (
								<Grid item xs={12} key={action.name + idx}>
									<SlackActionItem
										index={idx}
										label={action.name}
										action={action}
										setActionBeingEdited={setActionBeingEdited}
										setEditingAction={setEditingAction}
									/>
								</Grid>
							))
						}
					</Grid>
				</If>
			</If>
			<If condition={editingAction}>
				<SlackActionEditor
					actionIdx={actionBeingEdited}
					setEditingAction={setEditingAction}
				/>
			</If>
		</React.Fragment>
	)
})

export default Slack;
