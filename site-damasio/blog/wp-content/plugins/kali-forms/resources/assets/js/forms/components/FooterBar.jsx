import Toolbar from '@material-ui/core/Toolbar';
import { observer } from "mobx-react";
import React from 'react';
import FooterNavigationBar from './Misc/FooterNavigationBar';
import LogoSvg from './../../../img/logo.svg';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon';
const { __ } = wp.i18n;
const footerBarStyles = makeStyles(theme => {
	return {
		alignMiddle: {
			marginLeft: 'auto',
			'& a': {
				textDecoration: 'none',
			},
			'& .MuiIcon-root': {
				color: theme.palette.primary.main,
				position: 'relative',
				top: 3,
				'&:first-of-type': {
					marginLeft: theme.spacing(1),
				}
			}
		},
		kfLinks: {
			marginLeft: 'auto',
			'& a': {
				marginRight: theme.spacing(2.5),
				opacity: .6,
				'&:last-of-type': {
					marginRight: 0,
				}
			}
		},
		logoBox: {
			'& img': {
				verticalAlign: 'middle'
			}
		}
	}
});

const FooterBar = props => {
	const classes = footerBarStyles();
	return (
		<FooterNavigationBar position="fixed" elevation={0} id="kali-footerbar">
			<Toolbar variant="dense">
				<Box className={classes.logoBox}>
					<a href="https://www.kaliforms.com" target="_blank">
						<img src={LogoSvg} alt={__('Kali Forms logo', 'kaliforms')} />
					</a>
				</Box>
				<Box className={classes.alignMiddle}>
					<a href="https://wordpress.org/support/plugin/kali-forms/reviews/#rate-response" target="_blank">
						{__('Rate us on WordPress!', 'kaliforms')}
						<Icon className={'icon-rating'} />
						<Icon className={'icon-rating'} />
						<Icon className={'icon-rating'} />
						<Icon className={'icon-rating'} />
						<Icon className={'icon-rating'} />
					</a>
				</Box>
				<Box className={classes.kfLinks}>
					<a href="https://www.kaliforms.com/docs" target="_blank">
						{__('Documentation', 'kaliforms')}
					</a>
					<a href="https://www.kaliforms.com/contact-us" target="_blank">
						{__('Contact Us', 'kaliforms')}
					</a>
				</Box>
			</Toolbar>
		</FooterNavigationBar>
	)
}
export default observer(FooterBar);

