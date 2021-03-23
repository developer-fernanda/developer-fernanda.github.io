import { makeStyles } from '@material-ui/core/styles';
const builderFormFieldStyles = makeStyles(theme => {
	return {
		container: {
			width: '100%',
			display: 'inline-block',
			padding: theme.spacing(2.5) + 'px ' + theme.spacing(3.2) + 'px',
			fontSize: 12,
			lineHeight: '14px',
			cursor: 'pointer',
			position: 'relative',
			textAlign: 'left',
			overflow: 'hidden',
			'& > .button': {
				pointerEvents: 'none'
			},
			'& > .MuiBox-root': {
				pointerEvents: 'none',
			},
			'& > .react-resizable-handle': {
				bottom: 30 + '!important',
				right: -1 + '!important',
				cursor: 'e-resize !important',
			},
		},
		moveButton: {
			cursor: 'grab',
			position: 'absolute',
			top: 34,
			left: 4,
			fontSize: 20,
			color: theme.palette.text.secondary,
		},
		small: {
			fontSize: 11,
			color: '#605E5C',
			opacity: .6,
		},
		label: {
			pointerEvents: 'none',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			display: 'inherit',
			width: '70%',
			'& > .MuiIcon-root': {
				fontSize: 13,
				marginRight: theme.spacing(.8)
			}
		},
		labelCheckbox: {
			marginRight: '15px',
		},
		radioCheckbox: {
			display: 'inherit',
			marginTop: 6,
			marginBottom: 5,
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			display: 'inherit',
		},
		productField: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		},
		multipleProductField: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			'& > div': {
				marginRight: theme.spacing(1),

				'&:last-of-type': {
					marginRight: 0
				}
			}
		},
		submitButton: {
			width: '100%',
			background: theme.palette.primary.main,
			color: '#fff',
			fontSize: 15,
			padding: theme.spacing(1),
			marginTop: theme.spacing(1.2),
			pointerEvents: 'none',
			border: 'none',
			borderRadius: 4,
		},
		submitButtonStripped: {
			width: '100%',
			fontSize: 15,
			padding: theme.spacing(1),
			marginTop: theme.spacing(1.2),
			pointerEvents: 'none',
		},
		rating: {
			display: 'inherit',
			marginTop: 4,
			marginBottom: 3,
		},
		select: {
			width: '100%',
			padding: theme.spacing(.7),
			pointerEvents: 'none',
			borderRadius: 2,
			border: '1px solid #605E5C',
			marginTop: 4,
			marginBottom: 3,
			display: 'block',
			position: 'relative',
			opacity: .6,
			color: '#605E5C',
			'& .select-value': {
				opacity: .6,
			},
			'& .select-arrow': {
				position: 'absolute',
				top: 0,
				bottom: 0,
				right: 0,
				width: 22,
				borderLeft: '1px solid #605E5C',
				textAlign: 'center',
			},
			'& .MuiIcon-root': {
				fontSize: 18,
				lineHeight: '24px',
			}
		},
		input: {
			width: '100%',
			padding: theme.spacing(.7),
			borderRadius: 2,
			border: '1px solid #605E5C',
			pointerEvents: 'none',
			marginTop: 4,
			marginBottom: 3,
			color: '#605E5C',
			opacity: .6,
			maxHeight: 26,
		},
		inputColor: {
			width: '100%',
			padding: theme.spacing(.2),
			borderRadius: 2,
			border: '1px solid #605E5C',
			pointerEvents: 'none',
			marginTop: 4,
			marginBottom: 3,
			color: '#605E5C',
			opacity: .6,
			maxHeight: 26,
		},
		textarea: {
			width: '100%',
			borderRadius: 2,
			border: '1px solid #605E5C',
			padding: theme.spacing(.7),
			maxHeight: 26,
			lineHeight: '16px !important',
			boxShadow: 'none',
			resizable: false,
			pointerEvents: 'none',
			marginTop: 4,
			marginBottom: 1,
			opacity: .6,
		},
		checkbox: {
			marginRight: '10px'
		},
		divider: {
			width: '100%',
			position: 'relative',
			display: 'block',
			top: 23,
			'& span': {
				position: 'absolute',
				left: 'calc(50% - 70px)',
				top: -11,
				display: 'inline-block',
				width: '70px',
				textAlign: 'center',
				background: theme.palette.background.paper,
				zIndex: 100,
			}
		},
		fileUpload: {
			textAlign: 'center',
			borderRadius: '5px',
			background: '#fafafa',
			pointerEvents: 'none',
			display: 'block',
			padding: theme.spacing(2.5)
		},
		grecaptcha: {
			textAlign: 'center',
			display: 'inline-block',
			width: '100%',
			pointerEvents: 'none',
			'& > img': {
				width: '210px'
			}
		},
		pageBreak: {
			display: 'flex',
			alignItems: 'center',
			width: '100%',
			marginTop: theme.spacing(1.6),
			'& > div': {
				flexGrow: '1',
				textAlign: 'center',
				'&:first-of-type': {
					textAlign: 'left',
					marginLeft: '10%',
				},
				'&:last-of-type': {
					textAlign: 'right',
					marginRight: '10%',
				},
				'& > button': {
					pointerEvents: 'none',
					background: theme.palette.primary.main,
					color: '#fff',
					fontSize: 14,
					border: 'none',
					borderRadius: 4,
					fontSize: 14,
					padding: theme.spacing(1)
				}
			}
		},
		imageRadio: {
			display: 'flex',
			width: '100%',
			pointerEvents: 'none',
			padding: theme.spacing(.7)
		},
		imageRadioIcon: {
			fontSize: '1.8rem',
			marginRight: theme.spacing(1.5)
		},
		wireTransfer: {
			display: 'flex',
			alignItems: 'center',
			alignContent: 'center',
			pointerEvents: 'none',
			justifyContent: 'center',
			marginTop: 15,
		},
		totalField: {
			display: 'flex',
			height: '100%',
			alignItems: 'center',
			alignContent: 'center',
			pointerEvents: 'none',
			justifyContent: 'center',
		},
		paypal: {
			borderRadius: '5px',
			backgroundColor: '#ffc439',
			display: 'flex',
			alignItems: 'center',
			alignContent: 'center',
			pointerEvents: 'none',
			justifyContent: 'center',
			marginTop: 15,
		},
		stripe: {
			display: 'flex',
			position: 'absolute',
			top: 45,
			left: 40,
			right: 40,
			pointerEvents: 'none',
		},
		stripeCard: {
			width: '85%',
		},
		stripeDate: {
			width: '10%',
		},
		stripeCvc: {
			width: '5%',
		},
		code: {
			whiteSpace: 'pre',
			display: 'flex',
			maxHeight: 70,
			marginRight: 60,
			overflowY: 'hidden',
			pointerEvents: 'none',
		},
		freeText: {
			whiteSpace: 'pre',
			display: 'flex',
			maxHeight: 70,
			marginRight: 60,
			overflowY: 'hidden',
			pointerEvents: 'none',
			'& h4': {
				marginTop: 0,
			},
			'& p': {
				marginTop: 0,
			}
		}
	}
});

export default builderFormFieldStyles
