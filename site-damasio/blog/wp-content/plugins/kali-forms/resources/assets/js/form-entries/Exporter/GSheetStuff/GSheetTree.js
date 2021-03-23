import React, { useState, useContext, useEffect } from 'react'
import { Transfer, Typography, Form, Select, DatePicker, TreeSelect } from 'antd';
import Api from './../../utils/Api';
const { __ } = wp.i18n;

export default function GSheetTree(props) {
	const [loading, setLoading] = useState(false);
	const [treeValue, setTreeValue] = useState('new');
	const [treeData, setTreeData] = useState([
		{ pId: 0, value: 'new', title: __('New file', 'kaliforms'), isLeaf: true },
	])

	const treeChange = (value, label, extra) => {
		setTreeValue(value);
		props.onChange(value, label, extra);
	}

	useEffect(() => {
		setLoading(true);
		Api.getSheets()
			.then(res => {
				let newData = []

				res.data.spreadsheets.map(el => {
					let obj = {
						pId: 0,
						id: el.id,
						value: el.id,
						title: el.name,
						children: [],
						selectable: false
					}

					el.sheets.map(sheet => {
						obj.children.push({
							pId: el.id,
							value: el.id + '|' + sheet.id + '|' + sheet.name,
							title: sheet.name,
							isLeaf: true
						})
					})

					newData.push(obj);
				})

				setTreeData(prevState => {
					return [...prevState, ...newData]
				})
				setLoading(false)
			})
			.catch(err => console.warn(err))

		return () => {
			setLoading(false)
			setTreeValue('')
			setTreeData([
				{ id: 1, pId: 0, value: 'new', title: __('New file', 'kaliforms'), isLeaf: true },
			])
		}
	}, [])

	return (
		<div>
			<If condition={loading}>
				<Typography.Paragraph>{__('... loading Google data', 'kaliforms')}</Typography.Paragraph>
			</If>
			<TreeSelect onChange={treeChange}
				style={{ width: 350, textAlign: 'left' }}
				value={treeValue}
				dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
				placeholder={__('Please select', 'kaliforms')}
				treeData={treeData}
			/>
		</div>
	)
}
