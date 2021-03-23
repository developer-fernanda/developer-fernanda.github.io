import Badge from '@material-ui/core/Badge';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, withStyles, withTheme } from '@material-ui/core/styles';
import { observer } from "mobx-react";
import React from 'react';
import { store } from "./../../store/store";
import ArrowRightSvg from './../../../../img/arrow-right.svg';
import Icon from '@material-ui/core/Icon';
import listItems from './FormSettingsNavigation';
const StyledBadge = withStyles(theme => ({
	badge: {
		right: -30,
		top: 18,
		color: '#fff',
		borderRadius: 4,
		padding: '0 8px',
		fontWeight: 'bold',
		textTransform: 'uppercase',
		background: theme.palette.primary.main
	},
}))(Badge);

const useStyles = makeStyles(theme => {
	return {
		root: {
			background: theme.palette.background.default,
			padding: 0,
			position: 'relative',
			height: '100%',
			minHeight: 'calc(100vh - 52px)',
		},
		drawerList: {
			'& .MuiTypography-root': {
				fontSize: '18px'
			},
			'& .MuiListItemIcon-root': {
				minWidth: 40,
			},
			'& .Mui-selected': {
				background: '#fff',
				color: theme.palette.primary.main,
				position: 'relative',
				'&::after': {
					width: 12,
					height: 19,
					backgroundRepeat: 'no-repeat',
					background: 'url(' + ArrowRightSvg + ')',
					content: '""',
					position: 'absolute',
					right: 13,
					top: 15,
					opacity: .4,
				},
				'& .MuiListItemIcon-root': {
					color: theme.palette.primary.main,
				}
			}
		},
	}
});

const FormSettingsSidebar = observer((props) => {
	const classes = useStyles();

	const redirectToPricing = event => {
		window.open('https://www.kaliforms.com/pricing?utm_source=formSettings-SidebarOptions&utm_campaign=userInterests&utm_medium=proBadge', '_blank');
	}

	return (
		<List className={classes.drawerList}>
			{
				listItems.map(item => (
					<ListItem
						key={item.id}
						button
						selected={store._UI_.activeFormSettingsItem === item.id}
						onClick={event => {
							!item.pro || (item.pro && item.check)
								? store._UI_.setActiveFormSettingsItem(item.id)
								: redirectToPricing()
						}}
					>
						<ListItemIcon>
							<If condition={item.iconType === 'icon'}>
								<Icon className={item.icon} />
							</If>
							<If condition={item.iconType === 'image'}>
								<img src={item.icon} style={{ width: 35, height: 35, position: 'relative', left: -5 }} />
							</If>
						</ListItemIcon>

						<If condition={item.pro && !item.check}>
							<StyledBadge badgeContent={'Pro'} color="secondary">
								<ListItemText primary={item.text} />
							</StyledBadge>
						</If>
						<If condition={!item.pro || (item.pro && item.check)}>
							<ListItemText primary={item.text} />
						</If>
					</ListItem>
				))
			}
		</List>
	);
})

export default withTheme((FormSettingsSidebar));
