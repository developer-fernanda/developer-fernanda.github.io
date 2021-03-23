import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classnames from 'classnames';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import customSnackStyles from './CustomSnackStyles';

const CustomSnack = React.forwardRef((props, ref) => {
	const classes = customSnackStyles();
	const { closeSnackbar } = useSnackbar();
	const [expanded, setExpanded] = useState(false);
	
	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const handleDismiss = () => {
		closeSnackbar(props.id);
	};

	const clickedAction = (e, action) => {
		if (action.href === '#') {
			e.preventDefault();
			closeSnackbar(props.id);
		}
		closeSnackbar(props.id);
	}
	return (
		<Card className={classes.card} ref={ref}>
			<CardActions classes={{ root: classes.actionRoot }}>
				<Typography variant="subtitle2" className={classes.typography}>{props.title}</Typography>
				<div className={classes.icons}>
					<IconButton
						aria-label="Show more"
						className={classnames(classes.expand, { [classes.expandOpen]: expanded })}
						onClick={handleExpandClick}
					>
						<ExpandMoreIcon />
					</IconButton>
					<IconButton className={classes.expand} onClick={handleDismiss}>
						<CloseIcon />
					</IconButton>
				</div>
			</CardActions>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<Paper className={classes.collapse}>
					<Typography gutterBottom>{props.message}</Typography>
					{
						props.actions.map((action, idx) => (
							<Button variant="contained"
								key={action.id + idx}
								color={action.class.search('primary') > 0 ? 'primary' : 'default'}
								size="small"
								href={action.href}
								target="_blank"
								className={classes.button + ' ' + action.class}
								onClick={(e) => clickedAction(e, action)}
								id={action.id}>
								{/* <CheckCircleIcon className={classes.checkIcon} /> */}
								{action.label}
							</Button>
						))
					}
				</Paper>
			</Collapse>
		</Card>
	);
});

CustomSnack.propTypes = {
	id: PropTypes.number.isRequired,
};

export default CustomSnack;
