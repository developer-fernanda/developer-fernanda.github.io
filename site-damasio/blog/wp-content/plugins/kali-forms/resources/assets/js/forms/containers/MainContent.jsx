import Container from '@material-ui/core/Container';
import { observer } from "mobx-react";
import React from 'react';
import EmailEditorContainer from './../containers/EmailEditorContainer';
import SmsEditorContainer from './../components/SmsEditor/SmsEditorContainer';
import { store } from "./../store/store";
import appStyles from './AppStyles';
import FormBuilder from './FormBuilder';
import FormSettings from './FormSettings';
import TemplateSelector from './TemplateSelector';
import Box from '@material-ui/core/Box';
/**
 * Main Content hook
 *
 * @param {*} props
 * @returns
 */
const MainContent = observer(props => {
	const classes = appStyles(props);
	return (
		<React.Fragment>
			<Box component="main" className={classes.content}>
				<Box className={classes.appBarSpacer} />
				<Choose>
					<When condition={store._UI_.templateSelecting}>
						<Container className={classes.container} fixed={true} maxWidth="lg" disableGutters={true}>
							<TemplateSelector />
						</Container>
					</When>
					<Otherwise>
						<If condition={store._UI_.appBar === 'formBuilder'}>
							<FormBuilder />
						</If>
						<If condition={store._UI_.appBar === 'emailBuilder'}>
							<Choose>
								<When condition={store._UI_.activeTabInNotificationSidebar === 'sms'}>
									<SmsEditorContainer />
								</When>
								<Otherwise>
									<EmailEditorContainer />
								</Otherwise>
							</Choose>
						</If>
						<If condition={store._UI_.appBar === 'formSettings'}>
							<FormSettings />
						</If>
					</Otherwise>
				</Choose>
				<Box className={classes.appBarSpacer} />
			</Box>
		</React.Fragment>
	)
});

export default MainContent;
