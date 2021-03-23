import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { store } from "./../../store/store";
import { observer } from "mobx-react";
import bottomDrawerStyles from './BottomDrawerStyles'
import Presets from './../BottomDrawerComponents/Presets';
import MathHelper from './../BottomDrawerComponents/MathHelper';

const BottomDrawer = props => {
	const classes = bottomDrawerStyles();
	return (
		<Drawer anchor="bottom"
			PaperProps={{ className: classes.root }}
			open={store._UI_.bottomDrawer}
			ModalProps={{ onBackdropClick: () => { store._UI_.setBottomDrawer(false); store._UI_.setBackDropComponent(null) } }}
		>
			<If condition={store._UI_.backDropComponent === 'Presets'}>
				<Presets />
			</If>
			<If condition={store._UI_.backDropComponent === 'MathHelper'}>
				<MathHelper />
			</If>
		</Drawer>
	)
}

export default observer(BottomDrawer);
