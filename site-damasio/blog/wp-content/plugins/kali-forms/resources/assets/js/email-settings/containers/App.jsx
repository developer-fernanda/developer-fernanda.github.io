import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';
import Footer from './Footer';
import Body from './Body';
/**
 * App created as a hook
 *
 * @param {*} props
 * @returns
 */
const useStyles = makeStyles(theme => {
	return {
		app: {
			padding: '5px'
		},
		title: {
			marginBottom: '20px'
		},
		divider: {
			marginTop: '15px',
			marginBottom: '15px'
		},
		header: {
			marginBottom: 16
		}
	}
});

const App = props => {
	const classes = useStyles();
	const navToUrlMap = {
		settings: 0,
		test: 1,
		log: 2,
	}
	const [currentNavigation, setCurrentNavigation] = React.useState(navToUrlMap[props.settings.selected_tab])
	return (
		<React.Fragment>
			<Header className={classes.header} nav={{ selected: currentNavigation, set: setCurrentNavigation }} />
			<Body nav={{ selected: currentNavigation }} providers={props.providers} settings={props.settings} />
			<Footer />
		</React.Fragment>
	);
}
export default App;

