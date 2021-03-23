import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { observer } from "mobx-react";
import React from 'react';
import { store } from "./../../store/store";
import BootstrapInput from './../BootstrapInput';
import Icon from '@material-ui/core/Icon';
import ConditionalLogicItemCount from './../ConditionalLogic/ConditionalLogicItemCount';
import Button from './../Misc/MinimalButton';
import conditionalLogicEditorStyles from './ConditionalLogicEditorStyles';
const { __ } = wp.i18n;
const ConditionalLogicEditor = observer(props => {
	const classes = conditionalLogicEditorStyles();
	const editedCondition = store._FORM_INFO_.conditionalLogic[props.conditionIdx];
	return (
		<React.Fragment>
			<Grid container direction="row" style={{ marginBottom: props.sidebar ? 10 : 30 }} alignItems="center">
				<FormControl>
					<InputLabel shrink>
						{__('Add a name for your logical condition', 'kaliforms')}
					</InputLabel>
					<BootstrapInput
						value={editedCondition.name || ''}
						onChange={e => editedCondition.name = e.target.value}
						fullWidth={true}
					/>
				</FormControl>
			</Grid>
			<Grid container direction="row" spacing={2} style={{ marginBottom: props.sidebar ? -5 : 10 }} alignItems="center">
				<Grid item xs={12}>
					<Box className={classes.conditionalLogicRow}>
						<ConditionalLogicItemCount count={1} />
						<FormControl>
							<InputLabel shrink>
								{__('The current field', 'kaliforms')}
							</InputLabel>
							<Select
								value={editedCondition.field || ''}
								multiple={false}
								onChange={e => editedCondition.field = e.target.value}
								disabled={props.sidebar}
								input={<BootstrapInput />}
							>
								{
									Object.keys(store._FIELD_COMPONENTS_.simplifiedFields).map((key, index) => (
										<MenuItem key={index + key} value={key}>
											{store._FIELD_COMPONENTS_.simplifiedFields[key].caption}
										</MenuItem>
									))
								}
							</Select>
						</FormControl>
					</Box>
				</Grid>
			</Grid>
			<Grid container direction="row" spacing={2} style={{ marginBottom: props.sidebar ? -5 : 10 }} alignItems="center">
				<Grid item xs={12}>
					<Box className={classes.conditionalLogicRow}>
						<ConditionalLogicItemCount count={2} />
						<FormControl>
							<InputLabel shrink>
								{__('What will happen to the field', 'kaliforms')}
							</InputLabel>
							<Select
								value={editedCondition.state || ''}
								multiple={false}
								onChange={e => editedCondition.state = e.target.value}
								input={<BootstrapInput />}
							>
								<MenuItem value={'show'}>
									{__('Show', 'kaliforms')}
								</MenuItem>
								<MenuItem value={'hide'}>
									{__('Hide', 'kaliforms')}
								</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</Grid>
			</Grid>
			<Grid container direction="row" spacing={2} style={{ marginBottom: props.sidebar ? -5 : 10 }} alignItems="center">
				<Grid item xs={12}>
					<Box className={classes.conditionalLogicRow}>
						<ConditionalLogicItemCount count={3} />
						<FormControl>
							<InputLabel shrink>
								{__('If this field', 'kaliforms')}
							</InputLabel>
							<Select
								value={editedCondition.conditioner || ''}
								multiple={false}
								onChange={e => editedCondition.conditioner = e.target.value}
								input={<BootstrapInput />}
							>
								{
									Object.keys(store._FIELD_COMPONENTS_.fieldConditioners).map((key, index) => {
										// A field cant condition itself
										if (editedCondition.field === key) {
											return;
										}
										return (
											<MenuItem key={index + key} value={key}>
												{store._FIELD_COMPONENTS_.fieldConditioners[key].caption}
											</MenuItem>
										)
									})
								}
							</Select>
						</FormControl>
					</Box>
				</Grid>
			</Grid>
			<Grid container direction="row" spacing={2} style={{ marginBottom: props.sidebar ? -5 : 10 }} alignItems="center">
				<Grid item xs={12}>
					<Box className={classes.conditionalLogicRow}>
						<ConditionalLogicItemCount count={4} />
						<FormControl>
							<InputLabel shrink>
								{__('Has the selected value', 'kaliforms')}
							</InputLabel>
							<Select
								value={editedCondition.operator || ''}
								multiple={false}
								onChange={e => editedCondition.operator = e.target.value}
								input={<BootstrapInput />}
							>
								<MenuItem value={'equal'}>
									{__('Equal to', 'kaliforms')}
								</MenuItem>
								<MenuItem value={'different'}>
									{__('Different than', 'kaliforms')}
								</MenuItem>
								<MenuItem value={'or'}>
									{__('Can be', 'kaliforms')}
								</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</Grid>
			</Grid>
			<Grid container direction="row" spacing={2} style={{ marginBottom: props.sidebar ? -5 : 10 }} alignItems="center">
				<Grid item xs={12}>
					<Box className={classes.conditionalLogicRow}>
						<ConditionalLogicItemCount count={5} />
						<FormControl>
							<InputLabel shrink>
								{__('Value', 'kaliforms')}
							</InputLabel>
							<Select
								value={editedCondition.value || ''}
								multiple={false}
								onChange={e => editedCondition.value = e.target.value}
								input={<BootstrapInput />}
							>
								{
									typeof store._FIELD_COMPONENTS_.fieldConditioners[editedCondition.conditioner] !== 'undefined'
									&& store._FIELD_COMPONENTS_.fieldConditioners[editedCondition.conditioner].values.map((e, index) => {
										let menuItemKey = e.hasOwnProperty('value') ? index + e.value : index + e.image.id
										let menuItemValue = e.hasOwnProperty('value') ? e.value : e.image.id
										return (
											<MenuItem key={menuItemKey} value={menuItemValue}>
												<If condition={e.hasOwnProperty('image')}>
													<span style={{ width: 20, height: 20, borderRadius: 50, display: 'inlineBlock', position: 'absolute', left: 10, top: 7 }}>
														<img style={{ width: '100%' }} src={e.image.preview} />
													</span>
													<span style={{ paddingLeft: 30 }}>
														{__('Media ID: #', 'kaliforms')}{e.image.id}
													</span>
												</If>
												<If condition={e.hasOwnProperty('value')}>
													{e.label}
												</If>
											</MenuItem>
										)
									})
								}
							</Select>
						</FormControl>
					</Box>
				</Grid>
			</Grid>
			<Grid container direction="row">
				<Grid item xs={12}>
					<Button onClick={e => props.setEditingCondition(false)} style={{ paddingLeft: 16, paddingRight: 16 }}>
						<Icon className={'icon-back'} style={{ fontSize: 14, marginRight: 8 }} />
						{__('Back', 'kaliforms')}
					</Button>
				</Grid>
			</Grid>
		</React.Fragment >
	);
})
export default ConditionalLogicEditor;
