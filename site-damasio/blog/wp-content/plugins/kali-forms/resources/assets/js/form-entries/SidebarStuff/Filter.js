import React, { useContext } from 'react'
import { Space, Form, Input, Button, Slider, Select, Checkbox, DatePicker } from 'antd';
import { FormEntriesContext } from './../Context/FormEntriesContext';
import moment from 'moment';
const { __ } = wp.i18n;

export default function Filter() {
	const context = useContext(FormEntriesContext);
	// Available filters
	const [filters] = context.filters;
	// Pagination
	const [pagination] = context.pagination;
	// Our form reference
	const [formRef] = Form.useForm();
	// Loading state
	const [loading] = context.loading;
	// Our form values
	const [form, setForm] = React.useState({});

	let initialValues = form ? form : {};
	if (typeof initialValues.date_published !== 'undefined'
		&& typeof initialValues.date_published === 'string'
		&& initialValues.date_published !== ''
	) {
		let val = [];

		initialValues.date_published.split(',').map(el => val.push(moment(el, 'DD-MM-YYYY')))
		initialValues.date_published = val;
	}

	// Starts filter
	const startFilter = (filter) => {
		context.fetchData({ page: 1, pageSize: pagination.pageSize, filter })
	}
	// Resets filters
	const onReset = (evt, detail) => {
		setForm({});
		initialValues = {};
		formRef.resetFields();
		context.fetchData({ page: 1, pageSize: pagination.pageSize, filter: {} });
	}

	return (
		<React.Fragment>
			<Form onFinish={startFilter} layout="vertical" form={formRef}>
				{filters.map(el => {
					if (['actions', 'fileUpload'].includes(el.key)) {
						return;
					}
					return (
						<Form.Item key={el.key} label={el.title} name={el.key}>
							<Choose>
								<When condition={['dropdown', 'radio', 'donation'].includes(el.type)}>
									<Select>
										{el.choices.map(choice => {
											return (<Select.Option key={choice.value} value={choice.value}>{choice.label}</Select.Option>)
										})}
									</Select>
								</When>
								<When condition={['gdpr', 'termsAndConditions'].includes(el.type)}>
									<Select>
										<Select.Option value="">{__('-- Please select an option --', 'kaliforms')}</Select.Option>
										<Select.Option value="yes">{__('Yes', 'kaliforms')}</Select.Option>
										<Select.Option value="no">{__('No', 'kaliforms')}</Select.Option>
									</Select>
								</When>
								<When condition={['rating', 'range'].includes(el.type) && typeof el.minMax !== 'undefined'}>
									<Slider min={parseFloat(el.minMax.min)} max={parseFloat(el.minMax.max)}></Slider>
								</When>
								<When condition={['choices', 'checkbox'].includes(el.type)}>
									<Checkbox.Group options={el.choices} />
								</When>
								<When condition={['date'].includes(el.type)}>
									<DatePicker.RangePicker format={'DD-MM-YYYY'} />
								</When>
								<Otherwise>
									<Input />
								</Otherwise>
							</Choose>
						</Form.Item>
					)
				})}
				<Form.Item>
					<Space>
						<Button type="primary" htmlType="submit" loading={loading}>
							{__('Apply filter', 'kaliforms')}
						</Button>
						<Button htmlType="button" onClick={onReset} loading={loading}>
							{__('Clear', 'kaliforms')}
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</React.Fragment>
	)
}
