import Grid from '@material-ui/core/Grid';
import Container from './../LayoutComponents/Container';
import SectionTitle from './../Misc/SectionTitle';
import React from 'react';
const { CodeEditor } = (typeof Kali !== 'undefined' && Kali.hasOwnProperty('components')) ? Kali.components : () => (<div>Hello world</div>);
import { observer } from "mobx-react";
import { store } from "./../../store/store";
const { __ } = wp.i18n;
const FormCustomCss = observer((props) => {
	return (
		<React.Fragment>
			<Container maxWidth="md">
				<SectionTitle title={__('Custom CSS', 'kaliforms')} />
				<Grid container direction="row" spacing={3}>
					<Grid item xs={12}>
						<CodeEditor
							mode="css"
							height="400px"
							width="100%"
							theme="monokai"
							debounceChangePeriod={600}
							value={store._FORM_INFO_.customCss}
							onChange={(newValue) => store._FORM_INFO_.customCss = newValue}
							name="custom-css-editor"
							enableBasicAutocompletion={true}
							enableLiveAutocompletion={true}
							editorProps={{ $blockScrolling: Infinity }}
						/>
					</Grid>
				</Grid>
			</Container>
		</React.Fragment>
	);
})

export default FormCustomCss;
