import React from 'react';
import { useDropzone } from 'react-dropzone'
import { observer } from "mobx-react";
import { store } from "./../../store/store";
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
const fileUploaderStyles = makeStyles(theme => {
	return {
		container: {
			border: '1px solid #E8EBF7',
			borderRadius: 4,
			maxWidth: 215,
			padding: theme.spacing(2),
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
		},
		icon: {
			fontSize: '2.8rem',
		}
	}
})

/**
 * File uploader field
 */
const FileUploader = observer(props => {
	const classes = fileUploaderStyles();
	/**
	 * What happens when you drop the file?
	 */
	const onDrop = React.useCallback(acceptedFiles => {
		// console.log(acceptedFiles);
	}, [])
	/**
	 * I have no idea, for now, what these are
	 */
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

	return (
		<div {...getRootProps()} className={classes.container}>
			<input {...getInputProps()} />
			{
				isDragActive
					? <Icon className={'icon-upload ' + classes.icon} />
					: <React.Fragment><Icon className={'icon-upload ' + classes.icon} />Accepted files:</React.Fragment>
			}
		</div>
	)
})

export default FileUploader;
