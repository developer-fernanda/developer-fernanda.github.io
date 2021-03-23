import { makeStyles } from '@material-ui/core/styles';
const templateCardStyles = makeStyles(theme => {
	return {
		root: {
			borderRadius: 4,
			height: 350,
			position: 'relative',
			border: '1px solid #E8EBF7',
			'& .kali-image-preview': {
				width: '101%',
				left: -1,
				right: -1,
				top: -1,
			},
			'&:hover': {
				boxShadow: theme.shadows[10],
				borderColor: 'transparent',
				'& .kali-image-preview': {
					opacity: 1,
					transition: theme.transitions.create(['opacity'], {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.leavingScreen,
					}),
				},
				'& > .MuiCardMedia-root': {
					maxHeight: 'initial',
					height: 293,
					background: 'linear-gradient(180deg, rgba(70, 73, 76, 0.8) 0%, #46494C 100%);',
					borderBottomColor: 'transparent',
					transition: theme.transitions.create(['height', 'background'], {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.leavingScreen,
					}),
					'&:after': {
						content: '""'
					}
				},
				'& > .MuiCardContent-root': {
					'& > .MuiTypography-body1': {
						opacity: 0,
						visibility: 'hidden',
						transition: theme.transitions.create(['opacity'], {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.leavingScreen,
						}),
					},
					'& > .MuiTypography-body2': {
						opacity: 0,
						visibility: 'hidden',
						transition: theme.transitions.create(['opacity'], {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.leavingScreen,
						}),
					}
				}
			}
		},
		titleWhenHovered: {
			color: '#fff',
			fontWeight: 500,
			fontSize: 18,
			textAlign: 'center',
			position: 'relative',
			zIndex: 9999,
			paddingLeft: theme.spacing(2),
			paddingRight: theme.spacing(2),
			marginTop: theme.spacing(4.4),
		},
		title: {
			fontWeight: 500,
			fontSize: 18,
			textAlign: 'center',
			marginTop: theme.spacing(2),
			transition: theme.transitions.create(['color'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
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
			background: 'linear-gradient(180deg, #EAEAEA 0%, #EAEAEA 100%);',
			height: 110,
			position: 'relative',
			overflow: 'hidden',
			borderBottom: '1px solid #E8EBF7',
			transition: theme.transitions.create(['height', 'background'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			'&:after': {
				content: 'none',
				display: 'block',
				position: 'absolute',
				top: 0, left: 0, right: 0, bottom: 0,
				background: 'linear-gradient(180deg, rgba(70, 73, 76, 0) 0%, rgba(70, 73, 76, 0) 70%, rgba(70, 73, 76, .6) 89% ,#46494C 100%)',
				zIndex: 9998
			}
		},
		mediaThumb: {
			position: 'absolute',
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			opacity: 0,
			transition: theme.transitions.create(['opacity'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
		},
		mediaImg: {
			margin: '0 auto',
			marginTop: theme.spacing(3.5),
			display: 'block',
		},
		footer: {
			position: 'absolute',
			bottom: 0,
			left: 0,
			right: 0,
			padding: 0,
			borderTop: '1px solid #E8EBF7'
		},
		proButton: {
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
