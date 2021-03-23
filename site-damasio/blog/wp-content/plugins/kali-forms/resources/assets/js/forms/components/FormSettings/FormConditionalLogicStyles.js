import { makeStyles } from '@material-ui/core/styles';
const formConditionalLogicStyles = makeStyles(theme => {
	return {
		conditionalLogicRow: {
			display: 'flex',
			flexDirection: 'row',
			'& .MuiBox-root': {
				'&:first-of-type': {
					marginRight: theme.spacing(2)
				}
			}
		},
		addConditionButton: {
			minWidth: 130,
			height: 40,
			'& .MuiIcon-root': {
				marginRight: theme.spacing(1)
			}
		}
	}
});

export default formConditionalLogicStyles;
