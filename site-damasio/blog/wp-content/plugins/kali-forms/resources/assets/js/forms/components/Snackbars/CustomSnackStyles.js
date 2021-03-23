import { makeStyles } from '@material-ui/core/styles';
const customSnackStyles = makeStyles(theme => ({
	card: {
		maxWidth: 400,
		minWidth: 344,
	},
	typography: {
		fontWeight: 500,
	},
	actionRoot: {
		padding: '8px 8px 8px 16px',
		color: theme.palette.getContrastText(theme.palette.primary.main),
		background: theme.palette.primary.main,
	},
	icons: {
		marginLeft: 'auto !important',
	},
	expand: {
		padding: '8px 8px',
		color: theme.palette.getContrastText(theme.palette.primary.main),
		transform: 'rotate(0deg)',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
	collapse: {
		padding: 16,
	},
	checkIcon: {
		fontSize: 20,
		color: '#b3b3b3',
		paddingRight: 4,
	},
	button: {
		padding: '2px 5px',
		textTransform: 'none',
		marginRight: '10px',
	},
}));

export default customSnackStyles
