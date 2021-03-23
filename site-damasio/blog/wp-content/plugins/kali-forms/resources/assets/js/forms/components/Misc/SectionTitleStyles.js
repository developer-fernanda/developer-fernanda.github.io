import { makeStyles } from '@material-ui/core/styles';
const sectionTitleStyles = makeStyles(theme => {
	return {
		root: {
			marginTop: 45,
			marginBottom: 20,
		},
		title: {
			fontWeight: 400,
			fontSize: 18,
			lineHeight: '22px',
			color: theme.palette.kaliText,
		}
	}
});

export default sectionTitleStyles
