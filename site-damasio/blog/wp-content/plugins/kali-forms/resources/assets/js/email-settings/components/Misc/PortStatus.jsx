import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Badge from '@material-ui/core/Badge';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem'
import { withStyles } from '@material-ui/core/styles';
const { __ } = wp.i18n;

const StyledBadge = withStyles((theme) => ({
	badge: {
		left: -15,
		top: 10,
		right: 'initial',

	},
}))(Badge);

const PortStatus = props => {
	const [ports] = React.useState(props.settings.port_status);

	return (
		<React.Fragment>
			<Card variant="outlined">
				<CardContent>
					<Typography>
						{__('Ports used for email sending', 'kaliforms')}
					</Typography>
					<List dense={true} style={{ paddingLeft: 0 }}>
						{
							Object.keys(ports).map(key => {
								return (
									<ListItem key={key} dense={true} style={{ paddingLeft: 0 }}>
										<Typography color={'textPrimary'} gutterBottom={false} variant={'body2'}>
											<strong style={{ minWidth: 60, display: 'inline-block', marginRight: 16 }}>{__('Port ', 'kaliforms')}{key}:</strong>
											<StyledBadge color={ports[key] ? 'primary' : 'error'} variant="dot">
												<span>{ports[key] ? __('Open', 'kaliforms') : __('Closed', 'kaliforms')}</span>
											</StyledBadge>
										</Typography>
									</ListItem>
								)
							})
						}
					</List>
				</CardContent>
			</Card>
		</React.Fragment>
	)
}
export default PortStatus;
