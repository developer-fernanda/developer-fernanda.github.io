import Grid from '@material-ui/core/Grid';
import Container from './../LayoutComponents/Container';
import SectionTitle from './../Misc/SectionTitle';
import React from 'react';
const { CodeEditor } = (typeof Kali !== 'undefined' && Kali.hasOwnProperty('components')) ? Kali.components : () => (<div>Hello world</div>);
import { observer } from "mobx-react";
import { store } from "./../../store/store";
const { __ } = wp.i18n;
const FormCustomJs = observer((props) => {
	return (
		<React.Fragment>
			<Container maxWidth="md">
				<SectionTitle title={__('Custom JS', 'kaliforms')} />
				<Grid container direction="row" spacing={3}>
					<Grid item xs={12}>
						<CodeEditor
							mode="javascript"
							height="400px"
							width="100%"
							theme="monokai"
							value={store._FORM_INFO_.customJs}
							onChange={(newValue) => store._FORM_INFO_.customJs = newValue}
							debounceChangePeriod={600}
							name="custom-js-editor"
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

export default FormCustomJs;
