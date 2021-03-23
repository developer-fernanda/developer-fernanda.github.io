import Box from '@material-ui/core/Box';
import { observer } from "mobx-react";
import React from 'react';
import conditionalLogicItemCountStyles from './ConditionalLogicItemCountStyles';
const ConditionalLogicItemCount = observer((props) => {
	const classes = conditionalLogicItemCountStyles(props);
	return (
		<React.Fragment>
			<Box className={classes.root}>
				{props.count}
			</Box>
		</React.Fragment>
	)
});

export default ConditionalLogicItemCount
