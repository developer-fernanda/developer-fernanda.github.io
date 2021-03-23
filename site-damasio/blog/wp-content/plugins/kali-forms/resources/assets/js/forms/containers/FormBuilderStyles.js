import { makeStyles } from '@material-ui/core/styles';
const formBuilderStyles = makeStyles(theme => {
	return {
		paper: {
			marginTop: theme.spacing(3),
			// maxHeight: props => window.screen.width >= 1464 ? 'calc(100vh - 100px)' : 'calc(100vh - 145px)',
			// overflow: 'auto',
		},
		gridHelperButton: {
			position: 'absolute',
			top: props => window.screen.width >= 1464 ? 0 : 'initial',
			right: props => window.screen.width >= 1464 ? -50 : 0,
			bottom: props => window.screen.width >= 1464 ? 'initial' : -50,
			display: 'none',
		},
		gridHelperParent: {
			position: 'absolute',
			top: 20,
			left: 5,
			right: 5,
			bottom: 10,
			display: 'flex',
			pointerEvents: 'none',
		},
		gridHelperColumn: {
			flexGrow: '1',
			paddingRight: 10,
			paddingLeft: 10,
			pointerEvents: 'none',
		},
		gridHelperSpan: {
			background: 'rgba(0,0,0,.025)',
			width: '100%',
			height: '100%',
			display: 'inline-block',
			pointerEvents: 'none',
		},
		placeholder: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'column',
			minHeight: 390,
			width: 810,
			borderRadius: 4,
			background: '#fff',
			marginLeft: 525,
		},
		placeholderButton: {
			border: '1px solid #E8EBF7',
		}
	}
});

export default formBuilderStyles
