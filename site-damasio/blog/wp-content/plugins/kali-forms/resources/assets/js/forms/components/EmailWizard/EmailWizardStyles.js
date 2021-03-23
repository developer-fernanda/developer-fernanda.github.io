import { makeStyles } from '@material-ui/core/styles';
const emailWizardStyles = makeStyles(theme => ({
	button: {
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1),
		border: '1px solid #E8EBF7 !important',
		height: '40px !important'
	},
	actionsContainer: {
		marginBottom: theme.spacing(2),
	},
	resetContainer: {
		padding: theme.spacing(3),
	},
}));

export default emailWizardStyles;
