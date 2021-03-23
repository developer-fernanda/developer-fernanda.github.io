import React from 'react';
import { sortableHandle } from 'react-sortable-hoc';
import Icon from '@material-ui/core/Icon'
/**
 * Addable Product Handle
 */
const AddableProductHandle = (props) => {
	return (<Icon {...props} />)
}

export default sortableHandle(AddableProductHandle);
