import React from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import {
	useGmailTabsStyles,
	useGmailTabItemStyles,
} from '@mui-treasury/styles/tabs';
import SettingsApplicationsOutlinedIcon from '@material-ui/icons/SettingsApplicationsOutlined';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import BugReportOutlinedIcon from '@material-ui/icons/BugReportOutlined';
const indicatorColors = ['#d93025', '#1a73e8', '#188038', '#e37400'];
const { __ } = wp.i18n;
const Header = props => {
	const tabsStyles = useGmailTabsStyles({ indicatorColors });

	return (
		<React.Fragment>
			<Tabs
				classes={tabsStyles}
				value={props.nav.selected}
				onChange={(e, index) => props.nav.set(index)}
				TabIndicatorProps={{
					children: <div className={`MuiIndicator-${props.nav.selected}`} />,
				}}
			>
				<Tab
					disableTouchRipple
					classes={useGmailTabItemStyles({ color: indicatorColors[0] })}
					label={'Settings'}
					icon={<SettingsApplicationsOutlinedIcon />}
				/>
				<Tab
					disableTouchRipple
					classes={useGmailTabItemStyles({ color: indicatorColors[1] })}
					label={__('Email test', 'kaliforms')}
					icon={<SendOutlinedIcon />}
				/>
				<Tab
					disableTouchRipple
					classes={useGmailTabItemStyles({ color: indicatorColors[2] })}
					label={__('Log', 'kaliforms')}
					icon={<BugReportOutlinedIcon />}
				/>
			</Tabs>
		</React.Fragment>
	);
}
export default Header;
