import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const StyledButton = withStyles(theme => ({
	root: {
		background: 'transparent',
		border: 0,
		borderRadius: 3,
		height: 48,
		padding: '0 30px',
		'&:hover': {
			background: 'linear-gradient(101.31deg, #55FA97 0%, #9FF277 100%)',
			color: '#fff',
		}
	},
}))(Button);

export default StyledButton;
