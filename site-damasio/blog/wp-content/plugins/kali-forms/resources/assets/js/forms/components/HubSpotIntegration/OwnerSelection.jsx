import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import OwnerConditional from './OwnerConditional';
import BootstrapInput from './../BootstrapInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
const { __ } = wp.i18n;
const OwnerSelection = (props) => {
	const [conditional, setConditional] = useState(props.conditionalOwner);
	const addCondition = () => {
		let condition = {
			owner: '',
			condition: '',
			operator: 'contains',
			value: '',
		}
		setConditional([...conditional, condition]);
	}
	const removeCondition = (idx) => {
		let currentState = conditional;
		currentState.splice(idx, 1);
		setConditional([...currentState]);
		props.setConditionalOwner([...currentState]);
	}
	const changeCondition = (obj) => {
		let currentState = conditional;
		if (typeof currentState[obj.index] === 'undefined') {
			return;
		}
		if (!currentState[obj.index].hasOwnProperty([obj.key])) {
			return;
		}
		currentState[obj.index][obj.key] = obj.value;
		setConditional([...currentState]);
		props.setConditionalOwner(conditional);
	}
	const setDefaultCondition = () => {
		let currentState = conditional;

		currentState[0] = {
			owner: '',
			condition: '',
			operator: 'contains',
			value: '',
		}

		setConditional([...currentState]);
		props.setConditionalOwner(conditional);
	};
	useEffect(_ => {
		if (!props.conditionalOwner.length) {
			addCondition();
		}
	}, [])


	return (
		<Grid container direction="row" spacing={4}>
			<Grid item xs={6}>
				<FormControl>
					<InputLabel shrink>
						{__('Contact owner', 'kaliforms')}
					</InputLabel>
					<Select
						multiple={false}
						input={<BootstrapInput />}
						value={props.contactOwnerOption}
						onChange={e => props.setContactOwnerOption(e.target.value)}
					>
						<MenuItem key="none" value="none">
							{__('None', 'kaliforms')}
						</MenuItem>
						<MenuItem key="select" value="select">
							{__('Select Owner', 'kaliforms')}
						</MenuItem>
						<MenuItem key="conditional" value="conditional">
							{__('Conditional', 'kaliforms')}
						</MenuItem>
					</Select>
					<FormHelperText>{__('Sets the owner of the contact in your HubSpot contact list', 'kaliforms')}</FormHelperText>
				</FormControl>
			</Grid>
			<If condition={props.contactOwnerOption === 'select'}>
				<Grid item xs={6}>
					<FormControl>
						<InputLabel shrink>
							{__('Contact owner', 'kaliforms')}
						</InputLabel>
						<Select
							multiple={false}
							input={<BootstrapInput />}
							value={props.contactOwner}
							onChange={e => props.setContactOwner(e.target.value)}
						>
							<MenuItem value="">{__('Assign owner', 'kaliforms')}</MenuItem>
							{KaliFormsHubSpot.contactOwners.map(owner => <MenuItem key={owner.ownerId} value={owner.ownerId}>{owner.firstName} {owner.lastName}</MenuItem>)}
						</Select>
					</FormControl>
				</Grid>
			</If>
			<If condition={props.contactOwnerOption === 'conditional'}>
				{
					conditional.map((condition, idx) => (
						<OwnerConditional
							key={idx}
							idx={idx}
							changeCondition={changeCondition}
							condition={condition}
							removeCondition={removeCondition}
							addCondition={addCondition}
							setDefaultCondition={setDefaultCondition}
							conditionalLength={conditional.length}
						/>
					))
				}
			</If>
		</Grid>
	);
}

export default OwnerSelection;
