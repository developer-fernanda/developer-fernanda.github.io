import Container from './../LayoutComponents/Container';
import Grid from '@material-ui/core/Grid';
import { observer } from "mobx-react";
import React from 'react';
import { store } from "./../../store/store";
import SectionTitle from './../Misc/SectionTitle';
import StylesCard from './../TemplateCard/StylesCard';
const { __ } = wp.i18n;
const FormStyling = observer(props => {
	const setSelectedStyle = value => {
		store._FORM_STYLES_.setSelectedStyle(value)
	}
	return (
		<React.Fragment>
			<Container maxWidth="md">
				<SectionTitle title={__('Form styling', 'kaliforms')} />
				<Grid container direction="row" spacing={3}>
					{store._FORM_STYLES_.styles.map(e => (
						<Grid item xs={6} key={e.id}>
							<StylesCard
								title={e.label}
								thumb={e.thumb}
								styleToApply={store._FORM_STYLES_.selectedStyle}
								onChangeCallback={setSelectedStyle}
								value={e.id}
							>
							</StylesCard>
						</Grid>
					))}
				</Grid>
			</Container>
		</React.Fragment>
	)
})
export default FormStyling;
