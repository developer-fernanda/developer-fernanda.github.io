import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => {
	return {
		root: {
			flexDirection: 'row',
			alignItems: 'center',
			'& .MuiFormControlLabel-labelPlacementTop': {
				marginLeft: 0,
			}
		},
		label: {
			display: 'flex',
			flexDirection: 'column',
		},
		labelImg: {
			minHeight: 50,
			width: 100,
			height: 50,
			border: '1px solid rgba(0, 0, 0, 0.12)',
			borderRadius: 2,
			padding: theme.spacing(1),
			textAlign: 'center',
			display: 'flex',
			alignItems: 'center',
			background: '#fff',
			'&.active': {
				borderColor: theme.palette.info.main
			}
		},
		labelText: {
			fontSize: 13,
			marginTop: theme.spacing(1),
			textAlign: 'center',
		},
		img: {
			width: 85,
			display: 'block',
			margin: '0 auto',
		}
	}
});


const MailerSelect = props => {
	const classes = useStyles();
	const active = (key) => props.selected === key ? 'active' : '';

	return (
		<React.Fragment>
			<FormControl component="fieldset">
				<RadioGroup aria-label="mailer-select" className={classes.root} value={props.selected} onChange={(e, val) => props.setProvider(val)}>
					{
						Object.keys(props.providers).map((key, idx) =>
							<FormControlLabel
								labelPlacement='top'
								key={key}
								value={key}
								control={< Radio />}
								label={
									<React.Fragment>
										<div className={classes.label}>
											<div className={classes.labelImg + ' ' + active(key)}>
												<img src={props.providers[key].logo} className={classes.img} />
											</div>
											<span className={classes.labelText}>{props.providers[key].label}</span>
										</div>
									</React.Fragment>
								}
							/>
						)
					}
				</RadioGroup>
			</FormControl>

		</React.Fragment>
	)
}

export default MailerSelect;
