import { makeStyles } from '@material-ui/core/styles';

const SidebarFieldComponentItemStyles = makeStyles(theme => {
	return {
		icon: {
			position: 'relative',
			marginRight: 10,
		},
		root: {
			borderColor: '#E8EBF7',
			borderRadius: 4,
			cursor: 'move',
			padding: 13,
			fontWeight: 400,
			fontSize: 14,
			'&:hover': {
				background: 'linear-gradient(98.77deg, #55FA97 0%, #9FF277 100%)',
				color: '#fff',

				'& object': {
					filter: 'brightness(0) invert(1)'
				},

				'& .MuiIcon-root': {
					color: '#fff'
				}
			}
		},
		proButtonHolder: {
			position: 'absolute',
			top: 0,
			right: 0,
			display: 'inline-block',
		},
		proButton: {
			textAlign: 'center',
			borderRadius: 10,
			padding: '4px 8px',
			fontSize: '.7rem',
			color: '#fff',
			borderRadius: 4,
			padding: '4px 8px',
			textTransform: 'uppercase',
			background: theme.palette.primary.main,
			fontWeight: 'bold',
			// boxShadow: theme.shadows[2],

			'&:hover': {
				background: theme.palette.primary.main,
				// borderColor: '#eee',
				// background: '#fafafa',
				// borderColor: theme.palette.primary.main,
				// transition: 'all .25 ease-in-out'
			}
		},
		collectionButton: {
			padding: '4px 4px',
			position: 'absolute',
			right: 0,
			'&:hover': {
				color: '#fff'
			}
		}
	}
});

export default SidebarFieldComponentItemStyles;
