import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
const styles = makeStyles(theme => {
	return {
		root: {
			// border: 1px solid rgba(0, 0, 0, 0.1);
			display: 'inline-block',
			backgroundColor: 'rgba(0,0,0,.1)',
			height: 48,
			width: 1,
		}
	}
})

const ToolbarDivider = () => {
	const classes = styles();
	return (<Box className={classes.root}></Box>)
}

export default ToolbarDivider;
