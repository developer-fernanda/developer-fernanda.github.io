import React, { useContext } from 'react'
import { Table, Space, PageHeader } from 'antd';
import { Link } from 'react-router-dom';
import { UiContext } from './../Context/UiContext';
import { AppPropsContext } from './../Context/AppPropsContext';
const { __ } = wp.i18n;
export default function Forms() {
	const context = useContext(AppPropsContext);
	const [ui, setUi] = useContext(UiContext);

	const updateUi = () => {
		setUi(prevUi => { return { ...prevUi, selectedNavbar: ['form-entries'] } });
	}
	const columns = [
		{
			title: __('Id', 'kaliforms'),
			dataIndex: 'id',
			key: 'id'
		},
		{
			title: __('Form name', 'kaliforms'),
			dataIndex: 'name',
			key: 'name'
		},
		{
			title: __('Entries', 'kaliforms'),
			dataIndex: 'entries',
			key: 'entries'
		},
		{
			title: __('Actions', 'kaliforms'),
			dataIndex: 'actions',
			key: 'actions',
			render: (text, record) => (
				<Space size="middle">
					<Link to={`/form-entries/${record.id}`} onClick={updateUi}>{__('View entries', 'kaliforms')}</Link>
				</Space>
			),

		}
	];
	return (
		<React.Fragment>
			<PageHeader
				backIcon={false}
				title={__('Forms', 'kaliforms')}
				subTitle={__('All your existing forms', 'kaliforms')}
			/>
			<Table bordered={true} columns={columns} dataSource={context.allForms} pagination={false} />
		</React.Fragment>
	)
}
