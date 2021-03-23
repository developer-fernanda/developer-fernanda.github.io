import { withStyles } from '@material-ui/core/styles';
import FooterBar from './../LayoutComponents/FooterBar';

const FooterNavigationBar = withStyles(theme => ({
	root: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#E8EBF7',
		backgroundColor: 'rgba(70, 73, 76, 1)',
		fontSize: 14,
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		'& a': {
			color: '#E8EBF7',
			textDecoration: 'underline',
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
}))(FooterBar);
export default FooterNavigationBar;
