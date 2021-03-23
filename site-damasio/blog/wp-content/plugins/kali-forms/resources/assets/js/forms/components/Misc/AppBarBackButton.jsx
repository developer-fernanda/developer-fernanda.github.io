import React from 'react';
import { clear } from './../../store/store';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { makeStyles } from '@material-ui/core/styles';
const { __ } = wp.i18n;
const styles = makeStyles(theme => {
	return {
		icon: {
			color: '#fff',
			position: 'relative',
			top: 5
		},
		root: {
			color: '#fff',
			opacity: .6,
			padding: '0 20px',
		}
	}
})

const AppBarBackButton = () => {
	const classes = styles();
	const backToWp = (e) => {
		e.preventDefault()
		clear();
		window.location.href = KaliFormsObject.exit_url
	}
	return (
		<React.Fragment>
			<a href="#" onClick={e => backToWp(e)} className={classes.root}>
				<ArrowBackIosIcon className={classes.icon} fontSize="small"></ArrowBackIosIcon>
				{__('Back', 'kaliforms')}
			</a>
		</React.Fragment>
	)
}
export default AppBarBackButton;
