import React from 'react';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ArrowLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
const { __ } = wp.i18n;
const HubSpotSectionHeader = (props) => {
	return (
		<div>
			<Grid container direction="row" spacing={4}>
				<Grid item xs={props.backButton ? 8 : 12}>
					<Typography variant="h5">
						<If condition={props.backButton}>
							<IconButton
								aria-label={__('Go back', 'kaliforms')}
								onClick={props.backButtonAction}
								variant="contained"
								color="secondary"
								size="medium">
								<ArrowLeftIcon fontSize="inherit" />
							</IconButton>
						</If>
						{props.header}
					</Typography>
				</Grid>
			</Grid>
		</div >
	)
}

export default HubSpotSectionHeader;
