import { makeStyles } from '@material-ui/core/styles';
const conditionalLogicItemStyles = makeStyles(theme => {
	return {
		root: {
			border: '1px solid #E8EBF7',
			borderRadius: 4,
			padding: props => props.sidebar ? '8px 0px 8px 12px' : '0 12px',
			position: 'relative',
			fontSize: props => props.sidebar ? 13 : 14,
			display: 'flex',
			direction: 'row',
			lineHeight: props => props.sidebar ? '24px' : '40px',
			background: props => props.sidebar ? '#fff' : 'transparent'
		},
		label: {
			width: props => props.sidebar ? '75%' : '70%',
		},
		actionBox: {
			display: 'flex',
			direction: 'row',
			'& .MuiBox-root': {
				justifyContent: 'center',
				alignItems: 'center',
				display: 'flex',
				textAlign: 'center',
				padding: props => props.sidebar ? '0 8px' : '0 15px',
				cursor: 'pointer',
				borderLeft: '1px solid #e8ebf7',
				'& .MuiIcon-root': {
					marginRight: props => props.sidebar ? 0 : theme.spacing(1),
					fontSize: props => props.sidebar ? 20 : '1.5rem',
				},
				'&:hover': {
					color: theme.palette.primary.main
				},
				'&:last-of-type': {
					'& .MuiIcon-root': {
						color: theme.palette.error.light
					},
					'&:hover': {
						color: theme.palette.error.light
					},
				}
			}
		}
	}
});

export default conditionalLogicItemStyles;
