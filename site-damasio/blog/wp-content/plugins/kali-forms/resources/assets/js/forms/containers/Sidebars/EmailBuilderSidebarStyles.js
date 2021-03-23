import { makeStyles } from '@material-ui/core/styles';
const emailBuilderSidebarStyles = makeStyles(theme => {
	return {
		addEmailButtonParent: {
			borderBottom: '1px solid #E8EBF7',
		},
		addEmailButton: {
			'& .MuiTypography-body1': {
				fontSize: 18,
			},
			'& .MuiIcon-root': {
				position: 'relative',
				top: 3,
				marginRight: theme.spacing(1),
			}
		},
		listItem: {
			'& .MuiTypography-body1': {
				fontSize: 18,
			},
		},
		notificationList: {
			'& .Mui-selected': {
				background: '#fff',
				color: theme.palette.primary.main
			}
		}
	}
});

export default emailBuilderSidebarStyles
