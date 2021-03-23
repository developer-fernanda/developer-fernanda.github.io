import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { store } from "./../../store/store";
import { observer } from "mobx-react";
import presetsStyles from './PresetsStyles'
import Typography from '@material-ui/core/Typography';
import Checkbox from './../Misc/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from './../Misc/MinimalButton'
const { __ } = wp.i18n;
const Presets = props => {
	const classes = presetsStyles();
	const [predefinedOptions, setPredefinedOptions] = useState(KaliFormsObject.predefinedOptions);
	const [category, setCategory] = useState('');
	const [subCategory, setSubCategory] = useState('');
	const [selectedOptions, setSelectedOptions] = useState([]);


	useEffect(() => {
		setSelectedOptions([]);
	}, [category, subCategory])

	const convertKeys = (data) => {
		let options = [];
		if (data.length === 0) {
			return data;
		}
		if (data[0].hasOwnProperty('id')) {
			return data;
		}

		data.map(item => {
			let id = Object.keys(item)[0];
			let label = item[id];

			options.push({ id, label });
		});

		return options;
	}
	const convertKeysFromObj = data => {
		let options = [];
		for (let key in data) {
			options.push({ id: key, label: data[key] })
		}
		return options;
	}

	const categoryHasSubcategory = () => {
		let state = false;
		predefinedOptions.map(categoryItem => {
			if (categoryItem.id === category && categoryItem.hasOwnProperty('subcategories') && categoryItem.subcategories) {
				state = true;
			}
		});
		return state;
	}

	const categoryOptions = () => {
		let options = [];
		predefinedOptions.map(categoryItem => {
			if (categoryItem.id === category) {
				options = convertKeys(categoryItem.options);
			}
		})
		return options;
	}

	const deepOptions = () => {
		let options = [];
		predefinedOptions.map(categoryItem => {
			if (categoryItem.id === category) {
				categoryItem.options.map(subCategoryItem => {
					if (subCategoryItem.id === subCategory) {
						options = convertKeysFromObj(subCategoryItem.options)
					}
				})
			}
		});
		return options;
	}

	const checkBoxClicked = (e, value, label) => {
		let newOption = {
			value,
			label
		};
		let options = [...selectedOptions]
		if (e.target.checked) {
			options.push(newOption)
		} else {
			options = options.filter(e => e.value !== value);
		}

		setSelectedOptions(options)
	}

	const checkedState = (value) => {
		let state = false;
		selectedOptions.map(e => {
			if (e.value === value) {
				state = true;
			}
		});
		return state;
	}

	const updateField = () => {
		store._UI_.bottomDrawerCallback(selectedOptions);
		store._UI_.setBottomDrawer(false);
		store._UI_.setBottomDrawerCallback(null);
		store._UI_.setBackDropComponent(null);
		setSelectedOptions([]);
		setSubCategory('');
		setCategory('');
	}

	const selectedAll = (data) => {
		return data.length === selectedOptions.length
	}

	const selectAll = (e, data) => {
		let options = [];
		if (e.target.checked) {
			data.map(e => options.push({ value: e.id, label: e.label }));
			setSelectedOptions(options);
			return;
		}

		setSelectedOptions([]);
	}

	const currentDeepOptions = deepOptions();
	const currentCategoryOptions = categoryOptions();

	return (
		<React.Fragment>
			<Grid container>
				<Grid item xs={3}>
					<Typography variant={'h3'}>{__('Presets', 'kaliforms')}</Typography>
					<p>
						{__('Add an entire list of options to your field based on a pre-defined category.', 'kaliforms')}
					</p>
				</Grid>
				<Grid item xs={3}>
					<ul className={classes.selectableList}>
						{
							predefinedOptions.map(categoryItem => (
								<li key={categoryItem.id}
									className={category === categoryItem.id ? classes.listItemActive : ''}
									onClick={e => setCategory(categoryItem.id)} >
									{categoryItem.label}
								</li>
							))
						}
					</ul>
				</Grid>

				<Grid item xs={categoryHasSubcategory() ? 3 : 6} className={classes.differentBg}>
					<ul className={!categoryHasSubcategory() ? classes.selectableList + ' ' + classes.smallerList : classes.selectableList}>
						<If condition={categoryHasSubcategory()}>
							{categoryOptions().map(option => (
								<li key={option.id}
									className={subCategory === option.id ? classes.listItemActive : ''}
									onClick={e => setSubCategory(option.id)}>
									{option.label}
								</li>
							))}
						</If>
						<If condition={!categoryHasSubcategory()}>
							<If condition={currentCategoryOptions.length}>
								<li className={classes.smallMargin}>
									<FormControlLabel
										control={
											<Checkbox
												disableRipple={false}
												size={'small'}
												checked={selectedAll(currentCategoryOptions)}
												onChange={e => selectAll(e, currentCategoryOptions)}
											/>
										}
										label={__('Select all', 'kaliforms')}
									/>
								</li>
							</If>
							{currentCategoryOptions.map(option => (
								<li key={option.id} className={classes.smallMargin}>
									<FormControlLabel
										control={
											<Checkbox
												disableRipple={false}
												size={'small'}
												checked={checkedState(option.id)}
												onChange={e => checkBoxClicked(e, option.id, option.label)}
											/>
										}
										label={option.label}
									/>
								</li>
							))}
						</If>
					</ul>
					<If condition={!categoryHasSubcategory() && category !== ''}>
						<Button onClick={e => updateField()} className={classes.importButton}>{__('Import Presets', 'kaliforms')}</Button>
					</If>
				</Grid>
				<If condition={categoryHasSubcategory()}>
					<Grid item xs={3} className={classes.differentBg}>
						<ul className={classes.selectableList + ' ' + classes.smallerList}>
							<If condition={currentDeepOptions.length}>
								<li className={classes.smallMargin}>
									<FormControlLabel
										control={
											<Checkbox
												disableRipple={false}
												size={'small'}
												checked={selectedAll(currentDeepOptions)}
												onChange={e => selectAll(e, currentDeepOptions)}
											/>
										}
										label={__('Select all', 'kaliforms')}
									/>
								</li>
							</If>
							{currentDeepOptions.map(option => (
								<li key={option.id} className={classes.smallMargin}>
									<FormControlLabel
										control={
											<Checkbox
												disableRipple={false}
												size={'small'}
												checked={checkedState(option.id)}
												onChange={e => checkBoxClicked(e, option.id, option.label)}
											/>
										}
										label={option.label}
									/>
								</li>
							))}
						</ul>
						<If condition={categoryHasSubcategory() && subCategory !== ''}>
							<Button onClick={e => updateField()} className={classes.importButton}>{__('Import Presets', 'kaliforms')}</Button>
						</If>
					</Grid>
				</If>
			</Grid>
		</React.Fragment>
	)
}

export default observer(Presets);
