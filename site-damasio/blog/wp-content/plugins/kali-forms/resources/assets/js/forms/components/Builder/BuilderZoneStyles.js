import { makeStyles } from '@material-ui/core/styles';
const builderZoneStyles = makeStyles(theme => {
	return {
		builderZoneContainer: {
			background: '#fff',
			padding: theme.spacing(1.5),
			paddingTop: theme.spacing(3.2),
			paddingTop: theme.spacing(3.2),
			borderRadius: 4,
			maxWidth: 810,
			marginLeft: 525,
			minHeight: 370,
			'& .react-grid-layout': {
				minHeight: 352
			}
		},
		itemLoading: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			background: 'rgba(255, 255, 255, .5)',
			zIndex: 1000,
			paddingTop: 21,
		},
		gridItem: {
			textAlign: 'center',
			display: 'flex',
			borderRadius: theme.shape.borderRadius,
			border: '1px dashed #E8EBF7',
			// boxShadow: theme.shadows[2],
			background: theme.palette.background.paper,
			'& > div >.KaliFormsBuilderDragHandle': {
				opacity: 0,
			},
			'&:hover': {
				border: '1px solid #E8EBF7',
				background: '#fff',
				// borderColor: theme.palette.primary.main,
				transition: 'all .25 ease-in-out',
			},
			'&:hover > div:last-of-type': {
				transition: 'all .25 ease-in-out',
				opacity: 1,
			},
			'&:hover > .react-resizable-handle': {
				transition: 'all .25 ease-in-out',
				opacity: 1
			},
			'&:hover .KaliFormsBuilderDragHandle': {
				transition: 'all .25 ease-in-out',
				opacity: 1
			},
			'&.active': {
				'&> .react-resizable-handle': {
					transition: 'all .25 ease-in-out',
					opacity: 1
				},
				'& div:last-of-type': {
					transition: 'all .25 ease-in-out',
					opacity: 1,
				},
				'& > div >.KaliFormsBuilderDragHandle': {
					opacity: 1
				}
			},
		},
		icon: {
			// color: theme.palette.primary.main
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
		actionButtons: {
			display: 'flex',
			opacity: 0,
			flexDirection: 'row',
			position: 'absolute',
			top: 5,
			right: 5,
			zIndex: 100,
		},
		iconDuplicate: {
			color: theme.palette.primary.main,
			fontSize: 20,
			cursor: 'pointer',
			marginRight: theme.spacing(.5)
		},
		iconRemove: {
			color: theme.palette.error.light,
			fontSize: 20,
			cursor: 'pointer'
		},
		placeholder: { display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', minHeight: 390 }
	}
});

export default builderZoneStyles
