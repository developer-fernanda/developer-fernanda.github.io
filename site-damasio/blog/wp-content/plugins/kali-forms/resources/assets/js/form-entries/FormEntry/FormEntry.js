import React from 'react'
import Api from './../utils/Api';
import { Form, Button, Space, PageHeader, message } from 'antd';
import RenderField from './RenderField';
import { useParams, useHistory } from "react-router-dom";
const { __ } = wp.i18n;

export default function FormEntry() {
	let { id } = useParams();
	let history = useHistory();

	const [loading, setLoading] = React.useState(false);
	const [entry, setEntry] = React.useState({});

	React.useEffect(() => {
		setLoading(true);
		Api.getFormEntry(id).then(res => {
			setEntry(res.data)
			setLoading(false);
		}).catch(err => console.warn(err));
		return () => {
			setEntry({})
			setLoading(false)
		};
	}, [])

	const layout = {
		labelCol: { span: 3 },
		wrapperCol: { span: 8 },
	};
	const tailLayout = {
		wrapperCol: { offset: 3, span: 6 },
	};

	const shouldNotChangeFilter = (fields) => {
		let arr = ['product', 'fileUpload', 'donation', 'digitalSignature', 'multipleProducts'];
		let saneObj = {};

		for (let key in fields) {
			let field = entry.fields.filter(field => field.id === key);
			field = field[0];

			if (arr.includes(field.type)) {
				continue;
			}

			saneObj[key] = fields[key]
		}

		return saneObj;
	}

	const onFinish = (values) => {
		setLoading(true);
		let saneValues = shouldNotChangeFilter(values);
		Api.saveEntry({ id, fields: saneValues }).then(res => {
			setLoading(false)
			message.success({
				content: __('Entry has been updated successfully', 'kaliforms'),
				duration: 5,
			});

		}).catch(err => console.warn(err));
	}
	const onFinishFailed = () => { }

	return (
		<React.Fragment>
			<PageHeader
				onBack={() => history.goBack()}
				title={__('Form entry', 'kaliforms')}
				subTitle={__('edit', 'kaliforms')}
			/>
			<Form {...layout}
				autoComplete={'false'}
				name="entry-edit"
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}>
				{entry.hasOwnProperty('fields') && entry.fields.length && entry.fields.map(el => {
					if (['divider', 'grecaptcha', 'freeText', 'button', 'submitButton', 'stripe', 'paypal', 'total'].includes(el.type)) {
						return false
					}

					return (
						<Form.Item key={el.id}
							label={el.caption}
							name={el.id}
							initialValue={el.value}
						>
							<RenderField autoComplete={'false'} {...el} separator={entry.separator} />
						</Form.Item>
					)
				})}
				<Form.Item {...tailLayout}>
					<Space>
						<Button type="primary" htmlType="submit" loading={loading}>
							{__('Save', 'kaliforms')}
						</Button>
						<Button htmlType="button" onClick={history.goBack}>
							{__('Go back', 'kaliforms')}
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</React.Fragment>
	)
}
