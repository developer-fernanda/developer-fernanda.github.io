import React, { useContext, useState, useEffect, useCallback } from 'react'
import { Table, Input } from 'antd';
import arrayMove from 'array-move';
import { ExportContext } from './../Context/ExportContext';
import { DragHandle, SortableContainer, SortableItem } from './SortableStuff/sortable';
import EditableCell from './EditableStuff/EditableCell';
const { __ } = wp.i18n;

export default function ExportFormatting() {
	const [exportOptions, setExportOptions] = useContext(ExportContext);
	const [dataSource, setDataSource] = useState([]);
	const columns = [
		{
			title: __('Sort', 'kaliforms'),
			dataIndex: 'sort',
			width: 30,
			className: 'drag-visible',
			render: () => <DragHandle />,
		},
		{
			title: __('Field', 'kaliforms'),
			dataIndex: 'field',
			className: 'drag-visible',
		},
		{
			title: __('Column name (in the generated file)', 'kaliforms'),
			dataIndex: 'newName',
			render: (text, record, index) => <EditableCell record={record} index={index} text={text} />
		}
	]

	const onSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex !== newIndex) {
			const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
			let formattedFields = [];
			newData.map(el => formattedFields.push({ key: el.field, newName: el.newName }))
			setDataSource(newData);
			setExportOptions(prev => { return { ...prev, formattedFields: formattedFields } })
		}
	}

	const DraggableContainer = props => (
		<SortableContainer
			useDragHandle
			disableAutoscroll
			helperClass="row-dragging"
			onSortEnd={onSortEnd}
			{...props}
		/>
	);

	const DraggableBodyRow = ({ className, style, ...restProps }) => {
		// function findIndex base on Table rowKey props and should always be a right array index
		const index = dataSource.findIndex(x => x.index === restProps['data-row-key']);
		return <SortableItem index={index} {...restProps} />;
	};

	useEffect(() => {
		let data = [];
		exportOptions.formattedFields.map((el, idx) => {
			data.push({
				key: idx,
				field: el.key,
				newName: el.newName,
				index: idx,
			})
		})
		setDataSource(data);
		return () => setDataSource([])
	}, [])

	useEffect(() => {
		let data = [];
		exportOptions.formattedFields.map((el, idx) => {
			data.push({
				key: idx,
				field: el.key,
				newName: el.newName,
				index: idx,
			})
		})
		setDataSource(data);
		return () => setDataSource([])
	}, [exportOptions])

	return (
		<Table
			pagination={false}
			dataSource={dataSource}
			columns={columns}
			rowKey="key"
			components={{
				body: {
					wrapper: DraggableContainer,
					row: DraggableBodyRow,
				},
			}}
		/>
	)
}
