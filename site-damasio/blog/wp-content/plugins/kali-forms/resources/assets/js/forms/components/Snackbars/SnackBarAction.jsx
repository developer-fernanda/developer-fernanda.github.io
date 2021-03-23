import React, { Fragment } from 'react';
import { useSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const SnackBarAction = (props) => {
	const { closeSnackbar } = useSnackbar();
	return (
		<Fragment>
			<IconButton
				key="close"
				aria-label="Close"
				color="inherit"
				onClick={() => closeSnackbar(props.snackKey)}
			>
				<CloseIcon />
			</IconButton>
		</Fragment>
	)
}

export default SnackBarAction;
