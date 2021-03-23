// import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { observer } from "mobx-react";
import React from 'react';
import { store } from "./../../store/store";
import SidebarFormFieldEdit from './SidebarFormFieldEditItem';
import sidebarFormFieldEditorContainer from './SidebarFormFieldEditorContainerStyles';
const { __ } = wp.i18n;
const SidebarFormFieldEditorContainer = observer((props) => {
	const classes = sidebarFormFieldEditorContainer();
	return (
		<React.Fragment>
			<If condition={store._FIELD_COMPONENTS_.fieldComponents.length === 0}>
				<Box className={classes.contentBox}>{__('Add your first form field!', 'kaliforms')}</Box>
			</If>
			<If condition={store._FIELD_COMPONENTS_.fieldComponents.length > 0}>
				<Box>
					<SidebarFormFieldEdit />
				</Box>
			</If>
		</React.Fragment>
	);
})


export default SidebarFormFieldEditorContainer;
