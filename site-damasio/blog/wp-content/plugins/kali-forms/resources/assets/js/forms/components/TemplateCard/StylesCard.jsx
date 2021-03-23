import { observer } from "mobx-react";
import React from 'react';
import { store } from './../../store/store';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import stylesCardStyles from './StylesCardStyles';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const StylesCard = props => {
	const classes = stylesCardStyles();
	return (
		<Card variant="outlined" className={classes.root}>
			<CardMedia className={classes.media} image={props.thumb}></CardMedia>
			<CardActions className={classes.footer}>
				<FormControlLabel
					className={classes.radio}
					value={props.value}
					control={<Radio
						color="primary"
						onChange={() => props.onChangeCallback(props.value)}
						checked={props.value === props.styleToApply}
					/>}
					label={props.title}
				/>
			</CardActions>
		</Card>
	)
};

export default observer(StylesCard);
