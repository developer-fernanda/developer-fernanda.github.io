import { makeStyles } from '@material-ui/core/styles';
const webHookEntityCreatorStyles = makeStyles(theme => {
	return {
		addOrRemoveIcon: {
			cursor: 'pointer',
			position: 'relative',
			top: 30,
			right: 9,
			'&:hover': {
				color: theme.palette.primary.main
			},
		},
		removeIcon: {
			top: 8,
		}
	}
});

export default webHookEntityCreatorStyles;
