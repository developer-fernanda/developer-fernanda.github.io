import React from 'react';
import Box from '@material-ui/core/Box';
import Checkbox from './Checkbox';
import BootstrapInput from './../BootstrapInput';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import { store } from "./../../store/store";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { observer } from "mobx-react";
const buttonStylesStyles = makeStyles(theme => {
	return {
		lowerFont: {
			fontSize: 14,
		},
		container: {
			maxHeight: 350,
			overflowX: 'hidden',
			overflowY: 'scroll',
			marginTop: theme.spacing(3),
			width: 'calc(100% - 12px)',
			marginLeft: 6
		},
		active: {
			position: 'relative',
			'&:after': {
				display: 'block',
				content: '"\\f147"',
				fontFamily: 'dashicons',
				position: 'absolute',
				top: 3,
				right: 3,
				width: 20,
				height: 20,
				borderRadius: 50,
				color: '#fff',
				fontWeight: 700,
				textAlign: 'center',
				background: theme.palette.success.main,
				zIndex: 15,
				fontSize: '12px',
				lineHeight: '20px',
			}
		}
	}
})

const ButtonStyles = (props) => {
	const classes = buttonStylesStyles();
	const buttons = {
		flat: {
			label: 'Flat',
			classes: [
				"btn green",
				"btn light-green",
				"btn orange",
				"btn blue",
				"btn purple",
				"btn yellow",
				"btn grey",
				"btn red",
				"btn dark-blue",
				"btn ash-grey",
			]
		},
		rounded: {
			label: 'Rounded',
			classes: [
				"btn green rounded",
				"btn light-green rounded",
				"btn orange rounded",
				"btn blue rounded",
				"btn purple rounded",
				"btn yellow rounded",
				"btn grey rounded",
				"btn red rounded",
				"btn dark-blue rounded",
				"btn ash-grey rounded",
			]
		},
		fullRounded: {
			label: 'Full rounded',
			classes: [
				"btn green full-rounded",
				"btn light-green full-rounded",
				"btn orange full-rounded",
				"btn blue full-rounded",
				"btn purple full-rounded",
				"btn yellow full-rounded",
				"btn grey full-rounded",
				"btn red full-rounded",
				"btn dark-blue full-rounded",
				"btn ash-grey full-rounded",
			]
		},
		rounded3d: {
			label: '3D rounded',
			classes: [
				"btn green rounded press-me",
				"btn light-green rounded press-me",
				"btn orange rounded press-me",
				"btn blue rounded press-me",
				"btn purple rounded press-me",
				"btn yellow rounded press-me",
				"btn grey rounded press-me",
				"btn red rounded press-me",
				"btn dark-blue rounded press-me",
				"btn ash-grey rounded press-me",
			]
		},
		transparent: {
			label: 'Transparent',
			classes: [
				"btn green transparent",
				"btn light-green transparent",
				"btn orange transparent",
				"btn blue transparent",
				"btn purple transparent",
				"btn yellow transparent",
				"btn grey transparent",
				"btn red transparent",
				"btn dark-blue transparent",
				"btn ash-grey transparent",
			]
		},
	}

	const setDefault = () => {
		store._FIELD_COMPONENTS_.updatePropertyValue(
			store._UI_.activeFormFieldInSidebar,
			props.field.id,
			'default'
		)
	}

	const setStyle = (evt, styleClass) => {
		evt.preventDefault();
		store._FIELD_COMPONENTS_.updatePropertyValue(
			store._UI_.activeFormFieldInSidebar,
			props.field.id,
			styleClass
		)
	}

	const isActive = styleClass => {
		return styleClass === store._FIELD_COMPONENTS_.getPropertyValue(store._UI_.activeFormFieldInSidebar, props.field.id);
	}

	return (
		<React.Fragment>
			<Box className={classes.container}>
				<Grid direction="row" container>
					<Grid item xs={12}>
						<FormGroup row>
							<FormControlLabel
								control={
									<Checkbox
										value={'default'}
										onChange={e => setDefault()}
										checked={isActive('default')}
									/>
								}
								label={'Use theme default'}
							/>
						</FormGroup>
					</Grid>
				</Grid>
				{
					Object.keys(buttons).map(idx => (
						<React.Fragment key={idx}>
							<Typography variant={'body2'} style={{ marginBottom: 8 }}>{buttons[idx].label}</Typography>
							<Grid direction="row" container spacing={3} style={{ marginBottom: 16 }}>
								{buttons[idx].classes.map((cName, indx) =>
									<Grid item xs={3} key={cName + indx + idx} className={isActive(cName) ? classes.active : ''}>
										<a onClick={e => setStyle(e, cName)} className={cName + ' ' + classes.lowerFont} href="#">Button</a>
									</Grid>
								)}
							</Grid>
						</React.Fragment>
					))
				}
			</Box>
		</React.Fragment >
	)
};

export default observer(ButtonStyles);
