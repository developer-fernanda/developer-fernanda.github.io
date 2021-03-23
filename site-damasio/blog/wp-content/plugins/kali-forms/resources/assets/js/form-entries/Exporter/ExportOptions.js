import React, { useContext, useState, useEffect } from 'react'
import { ExportContext } from './../Context/ExportContext';
import { AppPropsContext } from '../Context/AppPropsContext';
import { Transfer, Typography, Form, Select, DatePicker } from 'antd';
import Api from './../utils/Api';
import DataFormatter from './../utils/DataFormatter';
import GSheetTree from './GSheetStuff/GSheetTree';

const { __ } = wp.i18n;
export default function ExportOptions() {
	const [exportOptions, setExportOptions] = useContext(ExportContext);
	const appProps = useContext(AppPropsContext);

	const [columns, setColumns] = useState([]);
	const [columnTitleMap, setColumnTitleMap] = useState({})

	useEffect(() => {
		Api.getFormEntries(exportOptions.form, 1, 1, false).then(res => {
			if (res.data.length) {
				const { columns } = DataFormatter(res.data)
				const map = {};
				columns.map(el => {
					map[el.key] = el.title
				})
				setColumns(columns.slice(0, -1));
				setColumnTitleMap(map);
			}

			return () => setColumns([]);
		})
	}, [])

	const handleChange = fields => {
		let formattedFields = [];
		fields.map(el => formattedFields.push({ key: el, newName: columnTitleMap[el] }))
		setExportOptions(prevOptions => { return { ...prevOptions, fields, formattedFields } })
	}

	const gSheetChanged = (value, label, extra) => {
		setExportOptions(prevState => {
			return { ...prevState, googleSheet: value }
		})
	}

	const valuesChanged = (key, value) => {
		switch (key) {
			case 'fileFormat':
				setExportOptions(prevState => {
					return { ...prevState, fileFormat: value }
				});
				break;
			case 'dateFilter':
				if (!value) {
					return setExportOptions(prevState => {
						return {
							...prevState,
							filters: []
						}
					})
				}

				let from = value[0].format('D-M-YYYY');
				let to = value.length > 1 ? value[1].format('D-M-YYYY') : null;
				let filter = to !== null
					? {
						after: from,
						before: to
					}
					: {
						after: from
					}

				return setExportOptions(prevState => {
					return {
						...prevState,
						filters: [
							{
								date: filter
							}
						]
					}
				});
				break;
		}
	}

	return (
		<div>
			<Typography.Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
				{__('Select which fields you want to export', 'kaliforms')}
			</Typography.Title>
			<Transfer
				style={{ justifyContent: 'center' }}
				dataSource={columns}
				targetKeys={exportOptions.fields}
				onChange={handleChange}
				listStyle={{
					width: 350
				}}
				render={item => item.title}
			/>
			<Form autoComplete={'false'}
				name="exporter-options"
				onValuesChange={valuesChanged}
				style={{ textAlign: 'center' }}
			>
				<Typography.Title level={4} style={{ textAlign: 'center', marginTop: 24, marginBottom: 24 }}>
					{__('Do you wish to export from a certain range?', 'kaliforms')}
				</Typography.Title>
				<DatePicker.RangePicker name="dateFilter" format={'DD-MM-YYYY'} style={{ width: 350 }} onChange={val => valuesChanged('dateFilter', val)} />
				<Typography.Title level={4} style={{ textAlign: 'center', marginTop: 24, marginBottom: 24 }}>
					{__('Exported file type', 'kaliforms')}
				</Typography.Title>
				<Select name={'fileFormat'} defaultValue={exportOptions.fileFormat} style={{ width: 350, textAlign: 'left' }} onChange={val => valuesChanged('fileFormat', val)}>
					<Select.Option value="csv">{__('CSV', 'kaliforms')}</Select.Option>
					<Select.Option value="xls">{__('Microsoft Excel™', 'kaliforms')}</Select.Option>
					<Select.Option value="xlsx">{__('Microsoft Excel™ 2007', 'kaliforms')}</Select.Option>
					<Select.Option disabled={appProps.plugins.googleSheets ? false : true} value="gsheet">
						{__('Google sheet', 'kaliforms')}
						<If condition={!appProps.plugins.googleSheets}>
							{__(' (requires the google sheets plugin)', 'kaliforms')}
						</If>
					</Select.Option>
				</Select>

				<If condition={exportOptions.fileFormat === 'gsheet'}>
					<Typography.Title level={4} style={{ textAlign: 'center', marginTop: 24, marginBottom: 24 }}>
						{__('Google sheets export options', 'kaliforms')}
					</Typography.Title>

					<GSheetTree onChange={gSheetChanged} />
				</If>
			</Form>
		</div>
	)
}
