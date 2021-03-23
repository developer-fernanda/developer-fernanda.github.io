import { makeStyles } from '@material-ui/core/styles';
const templateCardStyles = makeStyles(theme => {
	return {
		root: {
			borderRadius: 4,
			height: 330,
			position: 'relative',
			border: '1px solid #E8EBF7',
			background: 'linear-gradient(180deg, rgba(70, 73, 76, 0.8) 0%, #46494C 75%)',
			'&:hover': {
				boxShadow: theme.shadows[10],
			}
		},
		body: {
			textAlign: 'center',
			marginTop: theme.spacing(1.5),
			transition: theme.transitions.create(['opacity'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			// color: theme.palette.text.textSecondary
		},
		media: {
			height: 270,
			position: 'relative',
			overflow: 'hidden',
			backgroundSize: '85%',
		},
		radio: {
			display: 'block',
			width: '100%',
			marginRight: 0,
		},
		footer: {
			background: '#fff',
			position: 'absolute',
			bottom: 0,
			left: 0,
			right: 0,
			padding: theme.spacing(1),
			paddingLeft: theme.spacing(2),
			borderTop: '1px solid #E8EBF7'
		},
		actionButton: {
			fontSize: 18,
			fontWeight: 'normal',
			textTransform: 'initial',
			padding: theme.spacing(1.5),
			display: 'block',
			textAlign: 'center',
			width: '100%',

			'&:hover': {
				background: 'linear-gradient(101.31deg, #55FA97 0%, #9FF277 100%)',
				color: '#fff',
			}
		},
		actionButtonGroup: {
			fontSize: 18,
			fontWeight: 'normal',
			textTransform: 'initial',
			padding: theme.spacing(1.5),
			display: 'inline-block',
			textAlign: 'center',
			width: '50%',
			'&:first-of-type': {
				borderRight: '1px solid #E8EBF7',
				borderTopRightRadius: 0,
				borderBottomRightRadius: 0,
			},
			'&:last-of-type': {
				borderTopLeftRadius: 0,
				borderBottomLeftRadius: 0,
				marginLeft: 0,
			},
			'&:hover': {
				background: 'linear-gradient(101.31deg, #55FA97 0%, #9FF277 100%)',
				color: '#fff',
			}
		}
	}
})
export default templateCardStyles
