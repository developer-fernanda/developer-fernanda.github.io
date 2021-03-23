import { makeStyles } from '@material-ui/core/styles';
const presetsStyles = makeStyles(theme => ({
	root: {
		'& .MuiGrid-container': {
			height: 345,
			overflow: 'hidden',
		},
		'& .MuiGrid-item': {
			padding: theme.spacing(3),
			borderRight: '1px solid #e8ebf7',
			overflowX: 'hidden',
			overflowY: 'scroll',
			maxHeight: 345,
			'&:last-of-type': {
				borderRight: 'none',
			},
		}
	},
	selectableList: {
		listStyleType: 'none',
		padding: 0,
		margin: 0,
		'& li': {
			fontSize: 16,
			marginBottom: theme.spacing(1),
			cursor: 'pointer',
			display: 'block',
			width: '100%',
			'&:hover': {
				color: theme.palette.primary.main,
			},
			'&:last-of-type': {
				marginBottom: 'initial',
			}
		}
	},
	smallerList: {
		height: 235,
		paddingLeft: 10,
		marginBottom: 5,
		overflowY: 'scroll',
		overflowX: 'hidden',
	},
	smallMargin: {
		'& .MuiFormControlLabel-root': {
			width: '100%'
		},
		'& .MuiCheckbox-root': {
			padding: 0,
			marginRight: theme.spacing(1)
		}
	},
	listItemActive: {
		color: theme.palette.primary.main,
	},
	differentBg: {
		background: '#FAFAFA',
	},
	importButton: {
		width: '100%'
	},
	stepperRoot: {
		padding: 0
	},
	nextButton: {
		height: 40,
		marginLeft: theme.spacing(1),
		position: 'relative',
		bottom: 1
	}
}));

export default presetsStyles
