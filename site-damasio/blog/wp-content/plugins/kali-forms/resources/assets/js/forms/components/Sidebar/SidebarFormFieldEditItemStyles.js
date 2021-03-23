import { makeStyles } from '@material-ui/core/styles';
const sidebarFormFieldEditItemStyles = makeStyles(theme => {
	return {
		tabsRoot: {
			// borderLeft: '1px solid #e9e9e9',
			// borderRight: '1px solid #e9e9e9',
		},
		tabRoot: {
			minWidth: 120
		},
		groupBox: {
			padding: theme.spacing(3),
			border: '1px solid #e9e9e9',
			width: '100%',
			position: 'relative',
			top: -1
		},
		panel: {
			boxShadow: 'none',
			borderRadius: 0,
			borderRight: 0,
			borderLeft: 0,
			borderTop: 0,
			borderBottom: '1px solid #E8EBF7',
			'&:before': {
				display: 'none',
			},
			'&.Mui-expanded': {
				borderTop: 0,
				margin: 0,
				borderBottom: 0,
			}
		},
		panelDetails: {
			background: '#FAFAFA',
			padding: theme.spacing(1.5),
			flexDirection: 'column',
			'& .MuiFormControl-root': {
				marginBottom: 20,
			}
		}
	}
});
export default sidebarFormFieldEditItemStyles
