import {
	fade,
	withStyles,
} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

const BootstrapInput = withStyles(theme => ({
	root: {
		'label + &': {
			color: '#46494C',
			marginTop: theme.spacing(3),
		},
	},
	input: {
		borderRadius: 4,
		position: 'relative',
		backgroundColor: theme.palette.common.white,
		border: '1px solid #E8EBF7',
		fontSize: 14,
		lineHeight: '16px',
		width: '100%',
		padding: '11px 12px',
		transition: theme.transitions.create(['border-color', 'box-shadow']),
		color: '#46494C',
		'&:focus': {
			boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
			borderColor: theme.palette.primary.main,
		},
	},
}))(InputBase);
export default BootstrapInput;
