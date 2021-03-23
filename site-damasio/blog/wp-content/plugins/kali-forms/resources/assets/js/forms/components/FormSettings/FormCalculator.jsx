import Grid from '@material-ui/core/Grid';
import Container from './../LayoutComponents/Container';
import SectionTitle from './../Misc/SectionTitle';
import React from 'react';
const { CodeEditor } = (typeof Kali !== 'undefined' && Kali.hasOwnProperty('components')) ? Kali.components : () => (<div>Hello world</div>);
import { observer } from "mobx-react";
import { store } from "./../../store/store";
import Typography from '@material-ui/core/Typography';
import Button from './../Misc/MinimalButton';
import Icon from '@material-ui/core/Icon';
const { __ } = wp.i18n;
const FormCalculator = observer((props) => {
	const addEquationFromHelper = (obj) => {
		let currentVal = store._FORM_INFO_.calculator;
		let newEq = `\n//${obj.name}\n${obj.formula}\n`;
		store._FORM_INFO_.calculator = currentVal + newEq;
	}

	const loadedEditor = (instance) => {
		instance.completers.push({
			getCompletions: function (editor, session, pos, prefix, callback) {
				var variableMap = {};
				store._FIELD_COMPONENTS_.fieldComponents.map(field => {
					if (['fileUpload', 'submitButton', 'freeText', 'divider', 'grecaptcha', 'pageBreak'].includes(field.id)) {
						return;
					}

					variableMap[field.properties.name] = { type: field.id }
				})

				let getVariableCompletions = function (state, session, pos, prefix) {
					var variables = Object.keys(variableMap);
					return variables.map(function (variable) {
						return {
							caption: variable,
							value: variable,
							meta: "calculation variable",
							score: Number.MAX_VALUE
						};
					});
				}

				var completions = getVariableCompletions(editor, session, pos, prefix);
				callback(null, completions);
			}
		})
	}

	return (
		<React.Fragment>
			<Container maxWidth="md">
				<SectionTitle title={__('Calculator', 'kaliforms')} />
				<Grid container direction="row" spacing={3}>
					<Grid item xs={12}>
						<Typography variant="body2">
							{__('Perform calculations through your form fields, you can use the field names and standard math operators in your equations. For example:', 'kaliforms')}
						</Typography>
						<Typography variant="body2">
							<code>result = first_field + second_field</code>
							<br />
							<code>total = product * quantity</code>
						</Typography>
						<Typography variant="body2">
							{__('You can access a list of math functions by pressing CTRL+SPACE, for example calculating the cube root or exponent of a number.', 'kaliforms')}
						</Typography>
						<br />
						<Button onClick={() => {
							store._UI_.setBottomDrawerCallback(addEquationFromHelper)
							store._UI_.setBackDropComponent('MathHelper');
							store._UI_.setBottomDrawer(true)
						}}>
							<Icon className={'icon-add-new'} style={{ marginRight: 8 }} />
							{__('Use our Math Helper', 'kaliforms')}
						</Button>
					</Grid>
					<Grid item xs={12}>
						<CodeEditor
							mode="calculation"
							height="400px"
							width="100%"
							theme="monokai"
							debounceChangePeriod={600}
							value={typeof store._FORM_INFO_.calculator !== 'string' ? '' : store._FORM_INFO_.calculator}
							onChange={(newValue) => store._FORM_INFO_.calculator = newValue}
							name="custom-calculator-editor"
							enableBasicAutocompletion={true}
							enableLiveAutocompletion={true}
							onLoad={(instance) => loadedEditor(instance)}
							editorProps={{ $blockScrolling: Infinity }}
						/>
					</Grid>
				</Grid>
			</Container>
		</React.Fragment>
	);
})

export default FormCalculator;
