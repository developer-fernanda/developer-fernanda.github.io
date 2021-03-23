import { makeStyles } from '@material-ui/core/styles';
const conditionalLogicComponentStyles = makeStyles(theme => {
	return {
		createButton: {
			position: 'absolute',
			right: 0,
			padding: '11px 16px',
			borderLeft: '1px solid #E8EBF7',
			cursor: 'pointer',
			'&:hover': {
				color: theme.palette.primary.main
			}
		},
	}
});

export default conditionalLogicComponentStyles;
