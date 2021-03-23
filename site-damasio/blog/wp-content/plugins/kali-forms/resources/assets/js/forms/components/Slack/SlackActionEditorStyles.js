import { makeStyles } from '@material-ui/core/styles';
const slackActionEditorStyles = makeStyles(theme => {
	return {
		selectImg: {
			'& .MuiSelect-root': {
				paddingLeft: 40
			}
		},
	}
});

export default slackActionEditorStyles;
