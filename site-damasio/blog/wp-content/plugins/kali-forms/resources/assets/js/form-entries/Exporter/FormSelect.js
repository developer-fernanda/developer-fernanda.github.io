import React, { useContext, useState } from 'react'
import { ExportContext } from './../Context/ExportContext';
import { AppPropsContext } from './../Context/AppPropsContext';
import { Select, Typography } from 'antd';

const { __ } = wp.i18n;

export default function FormSelect() {
	const [exportOptions, setExportOptions] = useContext(ExportContext);
	const AppProps = useContext(AppPropsContext);

	const onSelectChange = value => {
		setExportOptions(prevOptions => { return { ...prevOptions, form: value } })
	}

	return (
		<div style={{ textAlign: 'center' }}>
			<Typography.Title level={4} style={{ marginBottom: 24 }}>
				{__('Select a form from which you want to export entries', 'kaliforms')}
			</Typography.Title>
			<Select onChange={onSelectChange} placeholder={__('Please select a form', 'kaliforms')} style={{ width: 250, textAlign: 'left' }} defaultValue={exportOptions.form}>
				{AppProps.allForms.map(form => <Select.Option key={form.id} value={form.id}>{form.name}</Select.Option>)}
			</Select>
		</div >
	)
}
