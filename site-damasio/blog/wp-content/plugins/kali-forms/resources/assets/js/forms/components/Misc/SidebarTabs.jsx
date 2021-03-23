import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';

const SidebarTabs = withStyles(theme => ({
	root: {
		borderBottom: '1px solid #E8EBF7',
		paddingLeft: 10,
		paddingRight: 10,
		background: '#fff',
		'& .MuiButtonBase-root': {
			fontSize: 14,
			fontWeight: 400,
			paddingBottom: 0,
		},
	}
}))(Tabs);
export default SidebarTabs;
