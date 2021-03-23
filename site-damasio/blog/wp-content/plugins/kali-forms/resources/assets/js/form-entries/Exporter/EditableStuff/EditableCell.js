import React, { useContext, useState } from 'react'
import { Typography } from 'antd';
import { ExportContext } from './../../Context/ExportContext';
export default function EditableCell({ record, index, text }) {
	const [exportOptions, setExportOptions] = useContext(ExportContext);
	const [recordData, setRecordData] = useState(record.newName);

	const handleChange = (value) => {
		let newFormattedFields = exportOptions.formattedFields;
		newFormattedFields[index].newName = value;
		setRecordData(value);
		setExportOptions(prevState => {
			return { ...prevState, formattedFields: newFormattedFields }
		})
	}

	return (
		<div>
			<Typography.Paragraph editable={{ onChange: handleChange }}>{exportOptions.formattedFields[index].newName}</Typography.Paragraph>
		</div>
	)
}
