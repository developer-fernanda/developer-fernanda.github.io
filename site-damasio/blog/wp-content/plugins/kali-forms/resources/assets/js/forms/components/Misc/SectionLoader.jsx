import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import SectionTitle from './Misc/SectionTitle';
import Container from './LayoutComponents/Container';

const SectionLoader = props => {
	return (
		<React.Fragment>
			<Container maxWidth="md">
				<SectionTitle title={props.title || 'Loading'} />
				<Grid container direction="row" spacing={3}>
					<Grid item xs={6}>
						<CircularProgress />
					</Grid>
				</Grid>
			</Container>
		</React.Fragment>
	)
}

export default SectionLoader;
