import { observer } from "mobx-react";
import React from 'react';
import ConditionalLogicComponent from './../ConditionalLogic/ConditionalLogicComponent';
import Container from './../LayoutComponents/Container';
import SectionTitle from './../Misc/SectionTitle';
const { __ } = wp.i18n;
const FormConditionalLogic = observer((props) => {
	return (
		<React.Fragment>
			<Container maxWidth="md">
				<SectionTitle title={__('Conditional logic', 'kaliforms')} />
				<ConditionalLogicComponent sidebar={false} />
			</Container>
		</React.Fragment>
	);
})
export default FormConditionalLogic;
