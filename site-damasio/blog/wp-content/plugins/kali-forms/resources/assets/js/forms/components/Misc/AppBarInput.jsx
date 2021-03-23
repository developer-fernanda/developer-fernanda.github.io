import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

const AppBarInput = withStyles(theme => ({
	root: {
		'label + &': {
			marginTop: theme.spacing(3),
		},
		'& .MuiSvgIcon-root': {
			color: '#fff',
			opacity: .6,
		},
		width: '20%',
		marginLeft: '9%',
		marginRight: '0',
	},
	input: {
		borderRadius: 0,
		position: 'relative',
		backgroundColor: 'transparent',
		border: 'none',
		fontSize: 16,
		width: '100%',
		padding: '10px 12px',
		color: 'white'
	},
}))(InputBase);
export default AppBarInput;
