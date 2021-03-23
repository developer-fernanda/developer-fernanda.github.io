import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';

const AppNavigationBar = withStyles(theme => ({
	root: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#E8EBF7',
		backgroundColor: 'rgba(70, 73, 76, 1)',
		fontSize: 14,
		'& a': {
			color: '#E8EBF7',
			textDecoration: 'none',
			display: 'inline-block',
			height: 48,
			lineHeight: '48px',
			fontWeight: 400,
		},
		'& .MuiToolbar-dense': {
			paddingLeft: 0,
			paddingRight: 0,
		}
	},
}))(AppBar);
export default AppNavigationBar;
