import React from 'react';
import WebHookItem from './WebHookItem';
import SectionTitle from './../Misc/SectionTitle';
import Grid from '@material-ui/core/Grid';
const { __ } = wp.i18n;
const WebHookList = props => {
	return (
		<React.Fragment>
			<SectionTitle title={__('Webhooks', 'kaliforms')} />
			<Grid container direction="row" spacing={2} alignItems="center">
				{
					props.hooks.length && props.hooks.map((action, idx) => (
						<Grid item xs={12} key={action.name + idx}>
							<WebHookItem {...action} hookIdx={idx} setEditingHook={props.setEditingHook} />
						</Grid>
					))
				}
			</Grid>
		</React.Fragment>
	)
}


export default WebHookList;
