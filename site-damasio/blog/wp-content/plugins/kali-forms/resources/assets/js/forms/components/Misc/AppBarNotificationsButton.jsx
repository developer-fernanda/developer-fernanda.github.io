import React from 'react';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from "mobx-react";
import { store } from './../../store/store';
import Badge from '@material-ui/core/Badge';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import Qs from 'qs';
const styles = makeStyles(theme => {
	return {
		notificationMenu: {
			borderTopRightRadius: 0,
			minWidth: 325,
			width: 325,
		},
		progress: {
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: 0,
		},
		loading: {
			opacity: .6,
		},
		notificationMenuItem: {
			fontSize: 14,
			paddingLeft: 6,
			paddingRight: 6,
			'& .MuiIcon-root': {
				marginRight: theme.spacing(1)
			},
			'&.info': {
				color: theme.palette.info.main
			},
			'&.warning': {
				color: theme.palette.warning.main
			},
			'&.error': {
				color: theme.palette.error.main
			}
		},
		typography: {
			whiteSpace: 'normal',
			fontSize: 14,
			lineHeight: '16px',
			paddingRight: 30,
		},
		icon: {
			position: 'relative',
			top: 0,
			'&.icon-down': {
				fontSize: 14,
				top: 2,
			},
			color: props => {
				return store._GLOBAL_NOTIFICATIONS_.notificationsExist
					? theme.palette.error.main
					: 'inherit';
			},
		},
		root: {
			background: props => {
				return store._GLOBAL_NOTIFICATIONS_.notificationsExist
					? '#fff'
					: 'transparent';
			},
			padding: '0 20px',
			'& .MuiBadge-root': {
				position: 'relative'
			},
			'& .MuiBadge-badge': {
				minWidth: 16,
				height: 16,
				fontSize: 9,
			}
		},
		dismissIcon: {
			marginRight: '0 !important',
			color: theme.palette.error.main,
			fontSize: '1.8rem',
			position: 'absolute',
			bottom: 7,
			right: 5,
		},
	}
})

const AppBarNotificationsButton = () => {
	const classes = styles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const openDropDown = event => {
		event.preventDefault();
		if (!store._GLOBAL_NOTIFICATIONS_.notificationsExist) {
			return;
		}
		setAnchorEl(event.currentTarget);
	}
	const dismissNotification = element => {
		if (element.loading) {
			return;
		}

		element.loading = true;
		const data = {
			action: 'kaliforms_update_option_ajax',
			args: {
				nonce: KaliFormsObject.ajax_nonce,
				userId: userSettings.uid,
				method: 'update',
				option: {
					key: element.id + '_dismissed',
					value: true,
				}
			}
		}
		axios.post(KaliFormsObject.ajaxurl, Qs.stringify(data))
			.then(r => {
				if (r.data.success) {
					setTimeout(() => {
						store._GLOBAL_NOTIFICATIONS_.removeNotification(element.id);
						if (store._GLOBAL_NOTIFICATIONS_.count === 0) {
							setAnchorEl(null);
						}
					}, 1500);
				}
			})
			.catch(e => {
				console.log(e);
			});
	}
	const handleClose = element => {
		if (element.loading) {
			return;
		}

		switch (element.actionType) {
			case 'redirect':
				window.open(element.action, '_blank');
				setAnchorEl(null);
				break;
			case 'ajax':
				const data = {
					action: 'kaliforms_' + element.action,
					args: {
						nonce: KaliFormsObject.ajax_nonce,
						userId: userSettings.uid
					}
				};
				element.loading = true;
				axios.post(KaliFormsObject.ajaxurl, Qs.stringify(data))
					.then(r => {
						if (r.data.success) {
							element.loading = false;
						}

						if (r.data.sent) {
							element.message = r.data.message;
						}

						setTimeout(() => {
							store._GLOBAL_NOTIFICATIONS_.removeNotification(element.id);
							if (store._GLOBAL_NOTIFICATIONS_.count === 0) {
								setAnchorEl(null);
							}
						}, 2500);
					})
					.catch(e => {
						console.log(e);
					});
				break;
			default:
				setAnchorEl(null);
				break;
		}
	};
	const getIcon = key => {
		switch (key) {
			case 'info':
				return 'icon-about';
			case 'warning':
				return 'icon-info';
			case 'error':
				return 'icon-info-rotated';
			default:
				return 'icon-info'
		}
	};
	return (
		<React.Fragment>
			<a href="#"
				onClick={e => openDropDown(e)}
				className={classes.root}
			>
				<Badge
					badgeContent={store._GLOBAL_NOTIFICATIONS_.count}
					invisible={!store._GLOBAL_NOTIFICATIONS_.notificationsExist}
					color="error"
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
				>
					<Icon className={classes.icon + ' icon-notification'} />
				</Badge>
			</a>
			<Menu
				anchorEl={anchorEl}
				keepMounted
				PopoverClasses={{ paper: classes.notificationMenu }}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				getContentAnchorEl={null}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				{store._GLOBAL_NOTIFICATIONS_.notifications.map(e =>
					<MenuItem
						key={e.id}
						className={classes.notificationMenuItem + ' ' + e.type}
					>
						<If condition={typeof e.loading !== 'undefined' && e.loading}>
							<LinearProgress className={classes.progress} />
						</If>

						<Icon className={getIcon(e.type)} />
						<Typography className={classes.typography} onClick={(event) => handleClose(e)}>
							{e.message}
						</Typography>

						<If condition={e.dismissable}>
							<Icon onClick={event => dismissNotification(e)} className={'icon-delete ' + classes.dismissIcon} />
						</If>
					</MenuItem>
				)}
			</Menu>
		</React.Fragment>
	)
}
export default observer(AppBarNotificationsButton);
