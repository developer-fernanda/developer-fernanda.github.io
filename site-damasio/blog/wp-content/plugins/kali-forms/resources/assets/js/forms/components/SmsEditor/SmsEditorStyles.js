import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
const smsEditorStyles = makeStyles(theme => {
	return {
		buttonDanger: {
			color: theme.palette.getContrastText(red[500]),
			backgroundColor: red[500],
			'&:hover': {
				backgroundColor: red[700],
			},
		},
		smsFooterPlaceholder: {
			height: 64,
			display: 'inline-block',
		},
		smsEditorFooter: {
			display: 'block',
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: 0,
			textAlign: 'right',
			borderTop: '1px solid #E8EBF7',
			padding: theme.spacing(1.25),
			'& .MuiIcon-root': {
				marginRight: theme.spacing(1),
			},
			'& .icon-remove': {
				color: theme.palette.error.light
			},
			'& button': {
				fontSize: 18,
				fontWeight: 400,
				textTransform: 'none',
				marginRight: theme.spacing(3),
				'&:last-of-type': {
					marginRight: 0,
				}
			}
		}
	}
});

export default smsEditorStyles;
