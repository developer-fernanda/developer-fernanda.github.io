import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const KaliFormControlLabel = withStyles(theme => ({
	label: {
		color: 'red',
		fontWeight: '400',
		fontSize: 14,
		lineHeight: '22px',
		color: theme.palette.kaliText
	}
}))(FormControlLabel);

export default KaliFormControlLabel;
