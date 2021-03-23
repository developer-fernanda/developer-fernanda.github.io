import Box from '@material-ui/core/Box';
import { observer } from "mobx-react";
import React from 'react';
import Icon from '@material-ui/core/Icon';
import conditionalLogicItemStyles from './ConditionalLogicItemStyles';
import { store } from '../../store/store';
const { __ } = wp.i18n;

const ConditionalLogicItem = observer((props) => {
	const classes = conditionalLogicItemStyles(props);
	const setEditingContainer = () => {
		props.setConditionalBeingEdited(props.index);
		props.setEditingCondition(true);
	}

	return (
		<React.Fragment>
			<Box className={classes.root}>
				<Box className={classes.label}>
					<span dangerouslySetInnerHTML={{ __html: props.label }}></span>
				</Box>
				<Box className={classes.actionBox}>
					<Box onClick={e => setEditingContainer()}>
						<Icon className={'icon-edit-2'} />
						<If condition={!props.sidebar}>
							{__('Edit', 'kaliforms')}
						</If>
					</Box>
					<Box onClick={e => store._FORM_INFO_.duplicateConditionByAssertion(props.condition)}>
						<Icon className={'icon-copy'} />
						<If condition={!props.sidebar}>
							{__('Duplicate', 'kaliforms')}
						</If>
					</Box>
					<Box onClick={e => store._FORM_INFO_.removeConditionByAssertion(props.condition)}>
						<Icon className={'icon-remove'} />
						<If condition={!props.sidebar}>
							{__('Delete', 'kaliforms')}
						</If>
					</Box>
				</Box>
			</Box>
		</React.Fragment>
	)
});

export default ConditionalLogicItem
