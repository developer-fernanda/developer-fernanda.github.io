import React from 'react';
import { sortableHandle } from 'react-sortable-hoc';
import Icon from '@material-ui/core/Icon'
import Box from '@material-ui/core/Box'
/**
 * Addable list item handle
 */
const AddableListItemHandle = (props) => {
	return (<Box {...props}><Icon className={'icon-moves'} /></Box>)
}

export default sortableHandle(AddableListItemHandle);
