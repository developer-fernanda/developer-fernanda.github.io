import React from 'react';
import { observer } from "mobx-react";
import Container from './../LayoutComponents/Container';
import SectionTitle from './../Misc/SectionTitle'
import Grid from '@material-ui/core/Grid';
import WebHooks from './../WebHooks/WebHooks'
const { __ } = wp.i18n;

const WebHooksContainer = observer(() => {
	return (
		<React.Fragment>
			<Container maxWidth="md">
				<SectionTitle title={__('Webhooks', 'kaliforms')} />
				<Grid container direction="row" spacing={3}>
					<Grid item xs={12}>
						<WebHooks />
					</Grid>
				</Grid>
			</Container>
		</React.Fragment>
	)
});

export default WebHooksContainer;
