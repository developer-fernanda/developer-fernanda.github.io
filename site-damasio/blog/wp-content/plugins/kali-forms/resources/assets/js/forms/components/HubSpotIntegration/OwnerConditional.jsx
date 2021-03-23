import React from 'react';
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import BootstrapInput from './../BootstrapInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { store } from './../../store/store';
const { __ } = wp.i18n;
const OwnerConditional = (props) => {
	return (
		<Grid item xs={12}>
			<Grid container direction="row" spacing={2}>
				<Grid item xs={3}>
					<FormControl>
						<InputLabel shrink>
							{__('Assign owner', 'kaliforms')}
						</InputLabel>
						<Select
							multiple={false}
							input={<BootstrapInput />}
							value={props.condition.owner}
							onChange={e => props.changeCondition({ index: props.idx, key: 'owner', value: e.target.value })}
							fullWidth={true}
						>
							<MenuItem value="">{__('Select owner', 'kaliforms')}</MenuItem>
							{KaliFormsHubSpot.contactOwners.map(owner => <MenuItem key={owner.ownerId} value={owner.ownerId}>{owner.firstName} {owner.lastName}</MenuItem>)}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={2}>
					<FormControl>
						<InputLabel shrink>
							{__('If', 'kaliforms')}
						</InputLabel>
						<Select
							multiple={false}
							input={<BootstrapInput />}
							value={props.condition.condition}
							onChange={e => props.changeCondition({ index: props.idx, key: 'condition', value: e.target.value })}
							fullWidth={true}
						>
							{store._FIELD_COMPONENTS_.fieldComponents.map(field => {
								if (
									(field.properties.name !== '')
									&& (field.id === 'checkbox'
										|| field.id === 'select'
										|| field.id === 'textbox'
										|| field.id === 'radio'
										|| field.id === 'hidden'
										|| field.id === 'dropdown'
										|| field.id === 'date'
										|| field.id === 'range'
										|| field.id === 'choices')
								) {

									let label = (typeof field.properties.caption !== 'undefined' && field.properties.caption !== '') ? field.properties.caption : field.properties.name
									return (
										<MenuItem
											key={field.internalId}
											value={field.properties.name}>
											{label}
										</MenuItem>
									)
								}
							})}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={2}>
					<FormControl>
						<InputLabel shrink>
							{__('Operator', 'kaliforms')}
						</InputLabel>
						<Select
							multiple={false}
							input={<BootstrapInput />}
							value={props.condition.operator}
							onChange={e => props.changeCondition({ index: props.idx, key: 'operator', value: e.target.value })}
							fullWidth={true}
						>
							<MenuItem key="contains" value="contains">
								{__('Contains', 'kaliforms')}
							</MenuItem>
							<MenuItem key="equal" value="equal">
								{__('Equal', 'kaliforms')}
							</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={3}>
					<FormControl>
						<InputLabel shrink>
							{__('Value', 'kaliforms')}
						</InputLabel>
						<BootstrapInput
							value={props.condition.value}
							onChange={e => props.changeCondition({ index: props.idx, key: 'value', value: e.target.value })}
							fullWidth={true}
							variant="filled"
						/>
					</FormControl>
				</Grid>
				<Grid item xs={2} style={{ paddingTop: 27 }}>
					<IconButton
						aria-label={__('Add condition', 'kaliforms')}
						onClick={props.addCondition}
						variant="contained"
						color="primary"
						size="medium">
						<AddIcon fontSize="inherit" />
					</IconButton>
					<IconButton
						aria-label={__('Remove condition', 'kaliforms')}
						onClick={() => props.conditionalLength === 1 ? props.setDefaultCondition() : props.removeCondition(props.idx)}
						variant="contained"
						color="primary"
						size="medium">
						<DeleteIcon fontSize="inherit" />
					</IconButton>

				</Grid>
			</Grid>
		</Grid>
	)
}
export default OwnerConditional;
