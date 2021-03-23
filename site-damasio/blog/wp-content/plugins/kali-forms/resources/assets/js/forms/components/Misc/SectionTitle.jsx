import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import sectionTitleStyles from './SectionTitleStyles'
const SettingsTitle = props => {
	const classes = sectionTitleStyles();
	return (
		<Grid container direction="row" className={classes.root}>
			<Grid item>
				<Typography className={classes.title} variant="h6">{props.title}</Typography>
			</Grid>
		</Grid>
	);
}

export default SettingsTitle;
