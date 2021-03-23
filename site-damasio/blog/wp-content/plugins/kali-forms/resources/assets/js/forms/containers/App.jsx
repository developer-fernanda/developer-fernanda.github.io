import { observer } from "mobx-react";
import { useSnackbar } from 'notistack';
import React from 'react';
import ConfirmationDialog from '../components/ConfirmationDialog/ConfirmationDialog';
import PlaceholderDialog from '../components/PlaceholderDialog/PlaceholderDialog';
import AppBar from './../components/AppBar';
import AppSidebar from './Sidebars/AppSidebar';
import FooterBar from './../components/FooterBar';
import BottomDrawer from './../components/LayoutComponents/BottomDrawer';
import SaveDataComponent from './../components/SaveDataComponent/SaveDataComponent';
import CustomSnack from './../components/Snackbars/CustomSnack';
import SnackBarAction from './../components/SnackBars/SnackBarAction';
import { store } from "./../store/store";
import MainContent from './MainContent';

/**
 * App created as a hook
 *
 * @param {*} props
 * @returns
 */
const App = observer(props => {
	const { enqueueSnackbar } = useSnackbar();
	const queueSnack = (props) => {
		props.tip === true
			?
			enqueueSnackbar(props.message, {
				persist: true,
				preventDuplicate: true,
				content: (key) => (
					<CustomSnack id={key} message={props.message} title={props.title} type={props.type} actions={props.actions} />
				),
			})
			:
			enqueueSnackbar(props.message,
				{
					preventDuplicate: true,
					variant: props.type,
					action: (key) => <SnackBarAction snackKey={key} />
				}
			)
	}

	React.useEffect(() => {
		KaliFormsObject.notices.map(e => {
			queueSnack(e);
		});

		if (store._UI_.templateSelecting) {
			document.getElementsByTagName('body')[0].style.background = '#fff';
			return;
		}

		document.getElementsByTagName('body')[0].style.background = store._UI_.appBar === 'formSettings'
			? '#fff'
			: '#898989';

	}, [])

	return (
		<React.Fragment>
			{/* Application Bar (Header) */}
			<AppBar />
			{/* Application Sidebar */}
			<AppSidebar />
			{/* The main component, should load whatever we need at a given time */}
			<MainContent />
			{/* Footer bar component */}
			<FooterBar />
			{/* Save Data component creates hidden inputs that save data directly through WP (easiest solution to the problem) */}
			<SaveDataComponent />
			{/* Placeholder Dialog (a material table with a list of placeholder) */}
			{store._UI_.placeholderDialog && <PlaceholderDialog />}
			{/* Confirmation Dialog (handles alerts like duplicate/remove with confirmation) */}
			{store._CONFIRMATION_DIALOG_.state && <ConfirmationDialog />}
			{/* Bottom drawer used through out the app */}
			{store._UI_.bottomDrawer && <BottomDrawer />}
		</React.Fragment>
	)
});

export default App;

