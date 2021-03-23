import React from 'react';
import Box from '@material-ui/core/Box';
import SettingsPage from '../components/SettingsPage';
import LogPage from '../components/LogPage';
import EmailTestPage from '../components/EmailTestPage';
const Body = props => {

	let pages = [
		SettingsPage,
		EmailTestPage,
		LogPage,
	]

	return (
		<React.Fragment>
			<Box m={2} style={{ maxWidth: 980 }}>
				{React.createElement(pages[props.nav.selected], { ...props })}
			</Box>
		</React.Fragment>
	);
}
export default Body;
