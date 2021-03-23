import React from 'react';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
const { __ } = wp.i18n;
import { store } from './../../store/store';
const styles = makeStyles(theme => {
	return {
		icon: {
			color: '#fff',
			position: 'relative',
			top: 5,
			marginRight: 10,
		},
		root: {
			background: theme.palette.primary.main,
			color: '#fff !important',
			padding: '0 20px',
		}
	}
})

const AppBarSaveButton = () => {
	const classes = styles();

	const save = (e) => {
		e.preventDefault()
		document.getElementById('publish').click();
		// checkIfWeCanSave() ? document.getElementById('publish').click() : initErrors();
	}

	const checkIfWeCanSave = () => {
		let nameErrors = store._FIELD_COMPONENTS_.findDuplicatesInCollection(store._FIELD_COMPONENTS_.fieldComponents, 'properties.name');
		let idErrors = store._FIELD_COMPONENTS_.foundDuplicatesInCollection(store._FIELD_COMPONENTS_.fieldComponents, 'properties.id')

		let continueToSave = true;
		if (nameErrors.duplicates) {
			store._ERRORS_.addError({
				type: 'field',
				message: __('Found fields with the same "Name" property.', 'kaliforms'),
				args: nameErrors.items
			})
			continueToSave = false;
		}

		if (idErrors.duplicates) {
			store._ERRORS_.addError({
				type: 'field',
				message: __('Found fields with the same "Id" property.', 'kaliforms'),
				args: nameErrors.items
			})
			continueToSave = false;
		}

		return continueToSave;
	}

	const initErrors = () => {
		console.log(store);
	}

	return (
		<React.Fragment>
			<a href="#" onClick={e => save(e)} className={classes.root}>
				<Icon className={classes.icon + ' icon-save'} />
				{__('Save', 'kaliforms')}
			</a>
		</React.Fragment>
	)
}
export default AppBarSaveButton;
