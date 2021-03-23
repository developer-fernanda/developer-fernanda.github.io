import React from 'react';
import { sortableHandle } from 'react-sortable-hoc';
import Icon from '@material-ui/core/Icon'
/**
 * Addable Image Handle
 */
const AddableImageHandle = (props) => {
	return (<Icon {...props} />)
}

export default sortableHandle(AddableImageHandle);
