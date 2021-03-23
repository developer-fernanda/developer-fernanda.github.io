import React from 'react';
import copy from 'copy-to-clipboard';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import SnackBarAction from '@/forms/components/SnackBars/SnackBarAction';
const { __ } = wp.i18n;
const styles = makeStyles(theme => {
	return {
		icon: {
			color: '#fff',
			position: 'relative',
			top: 5,
			marginRight: 10,
		},
		root: {
			background: theme.palette.primary.main,
			color: '#fff !important',
			padding: '0 20px',
			borderRight: '1px solid rgba(255,255,255,.2)'
		}
	}
})

const EmbedButtons = () => {
	const classes = styles();
	const { enqueueSnackbar } = useSnackbar();
	const [count, setCount] = React.useState(KaliFormsObject.entries_count);

	const copyShortcode = (e) => {
		e.preventDefault()
		copy(`[kaliform id="${KaliFormsObject.formId}"]`);
		enqueueSnackbar(
			`Shortcode ${__('copied to clipboard', 'kaliforms')}`,
			{
				preventDuplicate: true,
				variant: 'success',
				action: (key) => <SnackBarAction snackKey={key} />
			}
		)
	}
	const goToEntries = (e) => {
		e.preventDefault();
		window.open(KaliFormsObject.entries_url, '_blank');
	}

	return (
		<React.Fragment>
			<If condition={KaliFormsObject.hasOwnProperty('submissionViewPage')}>
				<a href="#" onClick={e => goToEntries(e)} className={classes.root}>
					{__('Entries', 'kaliforms')} ({count})
				</a>
			</If>
			<a href="#" onClick={e => copyShortcode(e)} className={classes.root}>
				{__('Embed', 'kaliforms')}
			</a>
		</React.Fragment>
	)
}
export default EmbedButtons;
