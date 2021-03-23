import { makeStyles } from '@material-ui/core/styles'
const addableListItemStyles = makeStyles(theme => {
	return {
		root: {
			position: 'relative',
			display: 'flex',
			flexDirection: 'row',
		},
		handle: {
			position: 'relative',
			top: 8,
			cursor: 'ns-resize'
		},
		handleContainer: {

		},
		inputFieldsContainer: {
			display: 'flex',
			flexDirection: 'row',
		},
		firstInput: {
			marginRight: theme.spacing(1),
		},
		secondInput: {
			width: '70%',
		},
		checkboxInput: {

		},
		deleteButtonContainer: {

		},
		delete: {
			position: 'relative',
			top: 8,
			marginLeft: theme.spacing(1),
			color: theme.palette.error.main,
			cursor: 'pointer',
			'&:hover': {
				color: theme.palette.error.main
			}
		},
		checkboxLabel: {
			fontWeight: 400,
			color: 'rgba(0, 0, 0, 0.54)',
			position: 'relative',
			top: -1,
			marginLeft: 0,
			marginRight: 2,
			'& .MuiTypography-body1': {
				fontSize: 12,
			},
			'& .MuiCheckbox-root': {
				position: 'relative',
				top: 0,
			}
		}
	}
})

export default addableListItemStyles;
