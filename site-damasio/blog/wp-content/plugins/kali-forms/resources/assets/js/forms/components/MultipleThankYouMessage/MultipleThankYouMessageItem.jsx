import React from 'react';
import { store } from './../../store/store';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
const { __ } = wp.i18n;

const styles = makeStyles(theme => {
	return {
		root: {
			border: '1px solid #E8EBF7',
			borderRadius: 4,
			padding: '0 12px',
			position: 'relative',
			fontSize: 14,
			display: 'flex',
			direction: 'row',
			lineHeight: '40px',
			background: 'transparent'
		},
		label: {
			width: '78%',
		},
		actionBox: {
			display: 'flex',
			direction: 'row',
			'& .MuiBox-root': {
				justifyContent: 'center',
				alignItems: 'center',
				display: 'flex',
				textAlign: 'center',
				padding: '0 15px',
				cursor: 'pointer',
				borderLeft: '1px solid #e8ebf7',
				'& .MuiIcon-root': {
					marginRight: theme.spacing(1),
					fontSize: '1.5rem',
				},
				'&:hover': {
					color: theme.palette.primary.main
				},
			}
		}
	}
})

const MultipleThankYouMessageItem = props => {
	const classes = styles();

	const openEditor = () => {
		props.default
			? props.setEditedCondition('default')
			: props.setEditedCondition(props.messageIndex);
		;
		props.setEditorOpen(true);
	}

	return (
		<React.Fragment>
			<Box className={classes.root}>
				<Box className={classes.label}>
					<If condition={props.default}>
						{__('Default thank you message', 'kaliforms')}
					</If>
					<If condition={!props.default}>
						{props.message.name}
					</If>
				</Box>
				<Box className={classes.actionBox}>
					<Box onClick={() => { openEditor() }}>
						<Icon className={'icon-edit-2'} />
						{__('Edit', 'kaliforms')}
					</Box>
					<If condition={!props.default}>
						<Box onClick={() => store._FORM_INFO_.removeThankYouMessage(props.messageIndex)}>
							<Icon className={'icon-remove'} />
							{__('Delete', 'kaliforms')}
						</Box>
					</If>
				</Box>
			</Box>
		</React.Fragment>
	)
};

export default MultipleThankYouMessageItem
