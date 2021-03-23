import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';

const NavigationTabs = withStyles(theme => ({
	root: {
		'& .MuiButtonBase-root': {
			fontSize: 14,
			textTransform: 'initial',
			fontWeight: 400,
			'&.Mui-selected': {
				background: '#fff',
				color: theme.palette.primary.main
			}
		},
		'& .MuiTabs-indicator': {
			background: 'transparent'
		},
		'& .MuiTab-wrapper': {
			flexDirection: 'row',
			'& .MuiIcon-root': {
				marginRight: 10,
			}
		}
	}
}))(Tabs);
export default NavigationTabs;
