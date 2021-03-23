import React, { useContext } from 'react'
import { Steps, Button } from 'antd';
import FormSelect from './FormSelect';
import ExportOptions from './ExportOptions';
import StartExport from './StartExport';
import ExportFormatting from './ExportFormatting';
import { ExportContext } from './../Context/ExportContext';

const { Step } = Steps;
const { __ } = wp.i18n;

const steps = [
	{
		title: __('Form select', 'kaliforms'),
		content: <FormSelect />,
	},
	{
		title: __('Options', 'kaliforms'),
		content: <ExportOptions />,
	},
	{
		title: __('Formatting', 'kaliforms'),
		content: <ExportFormatting />
	},
	{
		title: __('Start export', 'kaliforms'),
		content: <StartExport />,
	},
];

export default function Exporter() {
	const [exportOptions, setExportOptions] = useContext(ExportContext);

	const next = () => {
		setExportOptions(prevState => {
			return {
				...prevState,
				currentStep: prevState.currentStep + 1
			}
		})
	};

	const prev = () => {
		setExportOptions(prevState => {
			return {
				...prevState,
				currentStep: prevState.currentStep - 1
			}
		})
	};

	const validateStep = () => {
		switch (exportOptions.currentStep) {
			case 0:
				return !(exportOptions.form !== null && Number.isInteger(exportOptions.form))
			case 1:
				return exportOptions.fields.length === 0
		}
	}

	return (
		<React.Fragment>
			<Steps current={exportOptions.currentStep}>
				{steps.map(item => (
					<Step key={item.title} title={item.title} />
				))}
			</Steps>

			<div className="steps-content" style={{ padding: '24px 0' }}>
				{steps[exportOptions.currentStep].content}
			</div>

			<If condition={exportOptions.currentStep < steps.length - 1}>
				<div className="steps-action" style={{ textAlign: 'center' }}>
					{exportOptions.currentStep > 0 && (
						<Button style={{ margin: '0 8px' }} onClick={() => prev()}>
							{__('Previous', 'kaliforms')}
						</Button>
					)}
					{exportOptions.currentStep < steps.length - 1 && (
						<Button type="primary" disabled={validateStep()} onClick={() => next()}>
							{__('Next', 'kaliforms')}
						</Button>
					)}
				</div>
			</If>
		</React.Fragment>
	);
}
