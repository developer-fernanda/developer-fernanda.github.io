import { observer } from "mobx-react";
import React from 'react';
import { store } from './../../store/store';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import templateCardStyles from './TemplateCardStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormRectangle from './../../../../img/form-rectangle.png';
const { __ } = wp.i18n;

const TemplateCard = props => {
	const classes = templateCardStyles();
	/**
	 * Redirect to pro
	 */
	const redirectToPro = () => {
		window.open('https://www.kaliforms.com/pricing?utm_source=formBuilder&utm_campaign=userInterests&utm_medium=proBadge', '_blank');
	}
	return (
		<Card variant="outlined" className={classes.root}>
			<CardMedia className={classes.media}>
				<img className={classes.mediaImg} src={FormRectangle} />
				<If condition={props.thumb}>
					<img className={classes.mediaThumb + ' kali-image-preview'} src={props.thumb} />
				</If>
				<Typography color="textPrimary" className={classes.titleWhenHovered} gutterBottom>
					{props.title}
				</Typography>
			</CardMedia>
			<CardContent>
				<Typography color="textPrimary" className={classes.title} gutterBottom>
					{props.title}
				</Typography>
				<Typography variant="body2" component="p" color="textSecondary" className={classes.body}>
					{props.description}
				</Typography>
			</CardContent>
			<CardActions className={classes.footer}>
				<If condition={props.blank}>
					<Button
						size="small"
						variant="text"
						color="inherit"
						className={classes.actionButton}
						onClick={() => store._UI_.setTemplateSelecting(false)}
					>
						{__('Create new', 'kaliforms')}
					</Button>
				</If>
				<If condition={!props.blank}>
					<If condition={props.pro}>
						<Button
							size="small"
							variant="text"
							color="inherit"
							className={classes.proButton}
							onClick={() => redirectToPro()}
						>
							{__('Upgrade to Pro', 'kaliforms')}
						</Button>
					</If>
					<If condition={!props.pro}>
						<Button
							size="small"
							variant="text"
							color="inherit"
							className={classes.actionButtonGroup}
							onClick={() => window.open(props.demoUrl, '_blank')}
						>
							{__('See demo', 'kaliforms')}
						</Button>
						<Button
							size="small"
							variant="text"
							color="inherit"
							className={classes.actionButtonGroup}
							onClick={() => props.selectForm(props.predefinedFormKey)}
						>
							{__('Get started', 'kaliforms')}
						</Button>
					</If>
				</If>
			</CardActions>
		</Card>
	)
};

export default observer(TemplateCard);
