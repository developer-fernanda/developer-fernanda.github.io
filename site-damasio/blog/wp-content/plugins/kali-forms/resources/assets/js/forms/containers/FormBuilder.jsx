import LogoPng from '@img/logo.png';
import Box from '@material-ui/core/Box';
// import Button from '@material-ui/core/Button';
import Button from './../components/StyledButton';
import IconButton from '@material-ui/core/IconButton';
import GridOffIcon from '@material-ui/icons/GridOff';
import GridOnIcon from '@material-ui/icons/GridOn';
import { observer } from "mobx-react";
import React, { useState } from 'react';
import BuilderZone from './../components/Builder/BuilderZone';
import { store } from "./../store/store";
import formBuilderStyles from './FormBuilderStyles';
const { __ } = wp.i18n;
/**
 * The Form Builder
 *
 * @param {*} props
 * @returns
 */
const FormBuilder = observer((props) => {
	const classes = formBuilderStyles(props);
	const [gridHelper, setGridHelper] = useState(false);

	// State
	return (
		<React.Fragment>
			<Box className={classes.paper}>
				<Choose>
					<When condition={store._FIELD_COMPONENTS_.fieldComponents.length === 0 && !store._GRID_.dragStarted}>
						<Box className={classes.placeholder + ' ' + 'MuiPaper-elevation4'} droppable="true">
							<img src={LogoPng} style={{ width: 250 }} alt="logo" />
							<h4>{__('Add fields to the builder by dragging them from the sidebar', 'kaliforms')}</h4>
							<Button
								variant="text"
								color="inherit"
								className={classes.placeholderButton}
								onClick={() => store._UI_.setTemplateSelecting(true)}
							>
								{__('Or select a pre-defined template', 'kaliforms')}
							</Button>
						</Box>
					</When>
					<Otherwise>
						<BuilderZone />
					</Otherwise>
				</Choose>

				<If condition={gridHelper}>
					<div className={classes.gridHelperParent}>
						{[...Array(12)].map((x, i) =>
							<div key={i} className={classes.gridHelperColumn}>
								<span className={classes.gridHelperSpan}></span>
							</div>
						)}
					</div>
				</If>
			</Box>

			<Box className={classes.gridHelperButton}>
				<If condition={gridHelper}>
					<IconButton onClick={() => setGridHelper(false)}>
						<GridOffIcon />
					</IconButton>
				</If>
				<If condition={!gridHelper}>
					<IconButton onClick={() => setGridHelper(true)}>
						<GridOnIcon />
					</IconButton>
				</If>
			</Box>
		</React.Fragment>
	);
})

export default FormBuilder;
