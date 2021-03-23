import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { observer } from "mobx-react";
import React from 'react';
import SidebarFieldComponentItem from './../../components/Sidebar/SidebarFieldComponentItem';
import SidebarFormFieldEditorContainer from './../../components/Sidebar/SidebarFormFieldEditorContainer';
import { store } from "./../../store/store";
import SidebarTabs from './../../components/Misc/SidebarTabs';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
const { __ } = wp.i18n;
const styles = makeStyles(theme => {
	return {
		panel: {
			boxShadow: 'none',
			borderRadius: 0,
			borderRight: 0,
			borderLeft: 0,
			borderTop: 0,
			borderBottom: '1px solid #E8EBF7',
			'&:before': {
				display: 'none',
			},
			'&.Mui-expanded': {
				borderTop: 0,
				margin: 0,
				borderBottom: 0,
			}
		},
		panelDetails: {
			background: '#FAFAFA',
			padding: theme.spacing(1),
		}
	}
})

const FormBuilderSidebar = observer(props => {
	const classes = styles();
	const toggle = (e, tab) => {
		if (store._UI_.activeTabInSidebar !== tab) {
			store._UI_.setActiveTabInSidebar(tab);
		}
	}

	const displayStyles = {
		formFields: store._UI_.activeTabInSidebar === 'formFields' ? { display: 'block' } : { display: 'none' },
		fieldProperties: store._UI_.activeTabInSidebar === 'fieldProperties' ? { display: 'block' } : { display: 'none' },
	}

	return (
		<React.Fragment>
			<React.Fragment>
				<SidebarTabs
					value={store._UI_.activeTabInSidebar}
					indicatorColor="primary"
					textColor="primary"
					onChange={toggle}
				>
					<Tab value="formFields" label={__('Form fields', 'kaliforms')} />
					<Tab value="fieldProperties" label={__('Field properties', 'kaliforms')} />
				</SidebarTabs>
			</React.Fragment>
			<React.Fragment>
				<If condition={store._UI_.dragDropHelper && store._UI_.activeTabInSidebar === 'formFields'}>
					<Box m={2}>
						<Typography variant={'body1'} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
							<Icon className="icon-info" style={{ fontSize: 18, marginRight: 8 }} /> {__('Drag & Drop fields to the builder', 'kaliforms')}

							<Icon className="icon-delete16" onClick={e => store._UI_.dragDropHelper = false} style={{ cursor: 'pointer', position: 'absolute', right: 5, top: 0 }} />
						</Typography>
					</Box>
				</If>
				<Box style={displayStyles.formFields}>
					{
						store._FIELD_COMPONENTS_.formFieldTypes.map((group, index) => {
							return (
								<Accordion key={group.id} className={classes.panel} defaultExpanded={true}>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
									>
										<Typography variant="subtitle2">{group.label}</Typography>
									</AccordionSummary>
									<AccordionDetails className={classes.panelDetails}>
										<Grid container spacing={1}>
											{group.fields.map((e, idx) => {
												return (
													<Grid item xs={12} md={6} key={e.id + idx}>
														<SidebarFieldComponentItem
															id={e.id}
															label={e.label}
															icon={e.icon}
															constraint={e.constraint}
															properties={e.properties}
														/>
													</Grid>
												)
											})}
										</Grid>
									</AccordionDetails>
								</Accordion>
							)
						})
					}
				</Box>
				<Box style={displayStyles.fieldProperties}>
					<SidebarFormFieldEditorContainer />
				</Box>
			</React.Fragment>
		</React.Fragment>
	)
})

export default FormBuilderSidebar;
