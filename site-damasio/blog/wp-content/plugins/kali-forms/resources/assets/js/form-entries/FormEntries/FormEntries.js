import React, { useState, useContext } from 'react'
import { FormEntriesContext } from './../Context/FormEntriesContext';
import { UiContext } from './../Context/UiContext';
import { Table, Button } from 'antd';
import { useParams, Link } from "react-router-dom";
const { __, sprintf } = wp.i18n;

export default function FormEntries() {
	const context = useContext(FormEntriesContext)
	const { id } = useParams();
	const [data] = context.data;
	const [columns] = context.columns;
	const [loading] = context.loading;
	const [tableWidth] = context.tableWidth;
	const [selectedFilter] = context.selectedFilter;
	const [pagination, setPagination] = context.pagination;
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [ui, setUi] = useContext(UiContext);
	const hasSelected = selectedRowKeys.length > 0;

	const onSelectChange = selectedKeys => {
		setSelectedRowKeys(selectedKeys);
	}

	const pageChange = (page, pageSize) => {
		context.fetchData({ page, pageSize, filter: selectedFilter })
	}
	const updatePagination = (current, size) => {
		setPagination(prevPag => { return { ...prevPag, pageSize: size } })
	}
	const deleteEntries = () => {
		context.deleteEntries(selectedRowKeys);
		setSelectedRowKeys([]);
	}
	const updateUi = () => {
		setUi(prevUi => { return { ...prevUi, selectedNavbar: ['forms'] } });
	}
	return (
		<React.Fragment>
			<If condition={id}>
				<div style={{ marginBottom: 16 }}>
					<Button type="primary" onClick={deleteEntries} disabled={!hasSelected} loading={loading}>
						{__('Delete', 'kaliforms')}
					</Button>
					<span style={{ marginLeft: 8 }}>
						{hasSelected ? sprintf(__('Selected %s items', 'kaliforms'), selectedRowKeys.length) : ''}
					</span>
				</div>
				<Table sticky
					scroll={{ x: tableWidth }}
					loading={loading}
					columns={columns}
					dataSource={data}
					bordered={true}
					rowSelection={data.length ? {
						selectedRowKeys,
						onChange: onSelectChange,
					} : false}
					pagination={{
						onChange: pageChange,
						current: pagination.currentPage,
						total: pagination.totalRows,
						showSizeChanger: true,
						onShowSizeChange: updatePagination,
						pageSize: pagination.pageSize,
						pageSizeOptions: [10, 15, 25],
					}}
				/>
			</If>
			<If condition={!id}>
				<Link to={'/'} onClick={updateUi}>{__('... select a form first!', 'kaliforms')}</Link>
			</If>
		</React.Fragment>
	)
}
