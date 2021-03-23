import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import { observer } from "mobx-react";
import React from 'react';
import { store } from "./../../store/store";
import EmailBuilderSidebar from './EmailBuilderSidebar';
import FormBuilderSidebar from './FormBuilderSidebar';
import FormSettingsSidebar from './FormSettingsSidebar';
import appStyles from './../AppStyles';

const AppSidebar = observer(props => {
	const classes = appStyles(props);
	return (
		<React.Fragment>
			<Drawer className={classes.drawer}
				variant="permanent"
				classes={{
					paper: classes.drawerPaper,
				}}>
				<Box className={classes.toolbar} />
				<Choose>
					<When condition={store._UI_.appBar === 'formBuilder'}>
						<FormBuilderSidebar />
					</When>
					<When condition={store._UI_.appBar === 'emailBuilder'}>
						<EmailBuilderSidebar />
					</When>
					<When condition={store._UI_.appBar === 'formSettings'}>
						<FormSettingsSidebar />
					</When>
				</Choose>
				<Box className={classes.toolbar} />
			</Drawer>
		</React.Fragment>
	)
})

export default AppSidebar;
