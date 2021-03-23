import React from 'react';
import { sortableContainer } from 'react-sortable-hoc';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import Button from './../Misc/MinimalButton'
import { makeStyles } from '@material-ui/core/styles'
import { store } from "./../../store/store";
import BootstrapInput from './../BootstrapInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { FixedSizeList as List } from 'react-window';
const { __ } = wp.i18n;
const addableListContainerStyles = makeStyles(theme => {
	return {
		container: {
			padding: '5px 0',
			display: 'flex',
			justifyContent: 'center',
			flexDirection: 'column',
		},
		buttonFullWidth: {
			width: '100%',
			'& .MuiIcon-root': {
				marginRight: theme.spacing(1),
			},
		},
		button: {
			marginRight: theme.spacing(1),
			width: '49.1%',
			textAlign: 'left',
			'& .MuiIcon-root': {
				marginRight: theme.spacing(1),
			},
			'&:last-of-type': {
				marginRight: 0,
			}
		},
		bulkAddContainer: {
			marginTop: theme.spacing(1),

		},
		bulkAddButton: {
			'& .MuiIcon-root': {
				marginRight: theme.spacing(1),
			}
		},
		header: {
			marginBottom: theme.spacing(1)
		},
		listContainer: {
			maxHeight: 450,
			overflowY: 'scroll',

			'& .MuiFormControl-root': {
				marginBottom: '15px !important',
			}
		},
	}
})
/**
 * Addable list container
 *
 * @class AddableListContainer
 * @extends {React.Component}
 */
const AddableListContainer = (props) => {
	const classes = addableListContainerStyles();
	const [bulkOptions, setBulkOptions] = React.useState('');
	const [bulkOptionsVisible, setBulkOptionsVisible] = React.useState(false);
	const actualOptionCount = () => {
		if (bulkOptions === '') {
			return 0;
		}

		return bulkOptions.split(',').length;
	}
	const sprintf = (format, ...args) => {
		let i = 0;
		return format.replace(/%s/g, () => args[i++]);
	}
	const addBulkOptions = () => {
		let newChoices = getBulkChoices();
		props.setChoices([...props.choices, ...newChoices])
		props.onChange([...props.choices, ...newChoices]);
		setBulkOptions('');
		setBulkOptionsVisible(false);
	}
	const addPresetOptions = (values) => {
		props.setChoices([...props.choices, ...values])
		props.onChange([...props.choices, ...values])
	}
	const getBulkChoices = () => {
		let arr = [];
		let choices = bulkOptions.replace(/\s+/g, "").split(',');
		choices.map(e => {
			let option = e.includes('|')
				? {
					value: e.split('|')[0], label: e.split('|')[1]
				} : {
					value: e, label: e,
				};

			arr.push(option);
		});
		return arr;
	}

	const ListItemRow = ({ index, style }) => {
		return (
			<Box style={style}>{props.children[index]}</Box>
		)
	};

	return (
		<Box className={classes.container}>
			<Box display="flex" className={classes.header} flexDirection="row">
				<Box style={{ width: '15%' }}>{__('Checked', 'kaliforms')}</Box>
				<Box style={{ width: '32%' }}>{__('Value', 'kaliforms')}</Box>
				<Box>{__('Label', 'kaliforms')}</Box>
			</Box>

			<Box className={classes.listContainer}>
				<If condition={props.children.length > 70}>
					<List
						height={450}
						itemCount={props.children.length}
						itemSize={56}
						width={446}
					>
						{ListItemRow}
					</List>
				</If>
				<If condition={props.children.length <= 70}>
					{props.children}
				</If>
			</Box>
			<Box flexDirection="row">
				<Button className={classes.buttonFullWidth} style={{ marginTop: 10 }} onClick={() => props.addChoice()}>
					<Icon className={'icon-add-new'} />
					{__('Add choice', 'kaliforms')}
				</Button>
			</Box>
			<Box flexDirection="row">
				<Button className={classes.button} style={{ marginTop: 10 }} onClick={() => setBulkOptionsVisible(!bulkOptionsVisible)}>
					<Icon className={'icon-import'} />
					{__('Bulk add', 'kaliforms')}
				</Button>
				<Button className={classes.button} style={{ marginTop: 10 }} onClick={() => {
					store._UI_.setBottomDrawerCallback(addPresetOptions)
					store._UI_.setBackDropComponent('Presets');
					store._UI_.setBottomDrawer(true)
				}}>
					<Icon className={'icon-add-new'} />
					{__('Presets', 'kaliforms')}
				</Button>
			</Box>

			<If condition={bulkOptionsVisible}>
				<Box className={classes.bulkAddContainer}>
					<FormControl>
						<InputLabel shrink>
							{__('Add multiple options at once, please make sure to separate each option by a comma(e.g one|One, two|Two)', 'kaliforms')}
						</InputLabel>
						<BootstrapInput
							value={bulkOptions}
							onChange={e => setBulkOptions(e.target.value)}
							fullWidth={true}
							multiline={true}
							rows={3}
						/>
						<Button className={classes.bulkAddButton} onClick={() => addBulkOptions()}>
							<Icon className={'icon-add-new'} />
							{sprintf(__('Add the following (%s) options', 'kaliforms'), actualOptionCount())}
						</Button>
					</FormControl>
				</Box>
			</If>
		</Box>
	);
}

export default sortableContainer(AddableListContainer)
