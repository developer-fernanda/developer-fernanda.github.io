import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

const KaliCheckbox = withStyles(theme => ({
	checked: {
		color: 'rgba(0, 0, 0, 0.54) !important'
	}
}))(Checkbox);
export default KaliCheckbox;
