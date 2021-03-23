import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const MinimalButton = withStyles(theme => ({
	root: {
		background: '#fff',
		border: '1px solid #E8EBF7',
		borderRadius: 4,
		height: 42,
		padding: theme.spacing(1),
		textTransform: 'none',
		fontSize: 14,
		fontWeight: 400,
		'&:hover': {
			background: 'linear-gradient(101.31deg, #55FA97 0%, #9FF277 100%)',
			color: '#fff',
		}
	},
}))(Button);

export default MinimalButton;
