import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Code from '@material-ui/icons/Code';
import { observer } from "mobx-react";
import { store } from "./../../store/store";

const PlaceholderDialogOpener = observer((props) => {
	return props.adornment
		? (
			<InputAdornment position="end">
				<IconButton
					edge="end"
					color="primary"
					variant="contained"
					aria-label="open placeholder list"
					onClick={() => store._UI_.setPlaceholderDialog(true)}
				>
					<Code />
				</IconButton>
			</InputAdornment>
		)
		: (
			<IconButton color="secondary" size="small" onClick={() => store._UI_.setPlaceholderDialog(true)}> <Code /> </IconButton>

		)
})

export default PlaceholderDialogOpener;
