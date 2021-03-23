import React from 'react';
import Grid from '@material-ui/core/Grid';
import { sortableContainer } from 'react-sortable-hoc';

const AddableProductContainer = (props) => {
	return (
		<Grid container direction="row" spacing={2} style={{ marginTop: 8 }}>
			{props.children}
		</Grid>
	);
};
export default sortableContainer(AddableProductContainer);
