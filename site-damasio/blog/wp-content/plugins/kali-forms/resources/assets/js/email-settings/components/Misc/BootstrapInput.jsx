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
		width: 430,
		marginBottom: 8,
	},
	input: {
		borderRadius: '4px !important',
		position: 'relative',
		backgroundColor: theme.palette.common.white,
		border: '1px solid #E8EBF7 !important',
		fontSize: '14px !important',
		lineHeight: '16px !important',
		minHeight: 'initial !important',
		width: '100%',
		padding: '11px 12px !important',
		transition: theme.transitions.create(['border-color', 'box-shadow']),
		color: '#46494C !important',
		'&:focus': {
			boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem !important`,
			borderColor: theme.palette.primary.main + ' !important',
			backgroundColor: '#fff !important'
		},
	},
}))(InputBase);
export default BootstrapInput;
