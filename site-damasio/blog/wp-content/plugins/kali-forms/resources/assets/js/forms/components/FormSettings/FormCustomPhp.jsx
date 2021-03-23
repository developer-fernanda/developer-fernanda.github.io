import Grid from '@material-ui/core/Grid';
import Container from './../LayoutComponents/Container';
import SectionTitle from './../Misc/SectionTitle';
import React from 'react';
const { CodeEditor } = (typeof Kali !== 'undefined' && Kali.hasOwnProperty('components')) ? Kali.components : () => (<div>Hello world</div>);
import { observer } from "mobx-react";
import { store } from "./../../store/store";
const { __ } = wp.i18n;
const FormCustomPhp = observer((props) => {
	return (
		<React.Fragment>
			<Container maxWidth="md">
				<SectionTitle title={__('Before form process PHP script', 'kaliforms')} />
				<Grid container direction="row" spacing={3}>
					<Grid item xs={12}>
						<CodeEditor
							mode="php"
							height="400px"
							width="100%"
							theme="monokai"
							value={store._FORM_INFO_.customPhpBefore}
							debounceChangePeriod={600}
							onChange={(newValue) => store._FORM_INFO_.customPhpBefore = newValue}
							name="custom-php-before-process-editor"
							enableBasicAutocompletion={true}
							enableLiveAutocompletion={true}
							onLoad={instance => instance.getSession().setMode({ path: 'ace/mode/php', inline: true })}
							editorProps={{ $blockScrolling: Infinity }}
						/>
					</Grid>
				</Grid>
				<SectionTitle title={__('After form process PHP script', 'kaliforms')} />
				<Grid container direction="row" spacing={3}>
					<Grid item xs={12}>
						<CodeEditor
							mode="php"
							height="400px"
							width="100%"
							theme="monokai"
							value={store._FORM_INFO_.customPhpAfter}
							debounceChangePeriod={600}
							onChange={(newValue) => store._FORM_INFO_.customPhpAfter = newValue}
							name="custom-php-after-process-editor"
							enableBasicAutocompletion={true}
							enableLiveAutocompletion={true}
							onLoad={instance => instance.getSession().setMode({ path: 'ace/mode/php', inline: true })}
							editorProps={{ $blockScrolling: Infinity }}
						/>
					</Grid>
				</Grid>
			</Container>
		</React.Fragment>
	);
});

export default FormCustomPhp;
