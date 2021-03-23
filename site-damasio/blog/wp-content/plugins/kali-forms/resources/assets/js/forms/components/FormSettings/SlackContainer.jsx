import React from 'react';
import Typography from '@material-ui/core/Typography';
import { observer } from "mobx-react";
import Container from './../LayoutComponents/Container';
import SectionTitle from './../Misc/SectionTitle'
import Grid from '@material-ui/core/Grid';
import Slack from './../Slack/Slack';
const { __ } = wp.i18n;
const SlackContainer = observer(() => {
	const [slackData] = React.useState(KaliFormsSlack);
	return (
		<React.Fragment>
			<Container maxWidth="md">
				<SectionTitle title={__('Slack settings', 'kaliforms')} />

				<If condition={slackData.hasOwnProperty('error')}>
					<Grid container direction="row" spacing={3}>
						<Grid item xs={12}>
							<Typography>{slackData.error}</Typography>
						</Grid>
					</Grid>
				</If>

				<If condition={!slackData.hasOwnProperty('error')}>
					<Grid container direction="row" spacing={3}>
						<Grid item xs={12}>
							<Slack />
						</Grid>
					</Grid>
				</If>

			</Container>
		</React.Fragment>
	)
});

export default SlackContainer;
