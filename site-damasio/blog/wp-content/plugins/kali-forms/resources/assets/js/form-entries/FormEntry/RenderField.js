import React from 'react';
import { Input, Checkbox, Radio, Image, Select, Card, Button, Switch, Rate, Slider } from 'antd';
const { Meta } = Card;
const { __ } = wp.i18n;
export default function RenderField(props) {
	const options = props?.props?.choices ? props.props.choices : [];

	const checkboxChange = (val) => {
		props.onChange(val.join(','))
	}
	const uploadClick = element => {
		window.open(element.url, '_blank');
	}
	const oldOrNew = option => {
		if (option?.image) {
			return option.image?.preview ? option.image.preview : '';
		};

		return option?.preview ? option?.preview : '';
	}

	switch (props.type) {
		case 'choices':
		case 'checkbox':
			return (<Checkbox.Group options={options}
				defaultValue={!Array.isArray(props.value) ? props.value.split(props.separator) : props.value}
				onChange={checkboxChange} />);
		case 'imageRadio':
			return (
				<Radio.Group
					defaultValue={props.value?.id ? props.value.id : ''}
					onChange={props.onChange}>
					{options.map((option, idx) => {
						return (
							<Radio
								key={'option-' + (option?.image?.id ? option.image.id : option.id) + idx}
								value={option?.image?.id ? option.image.id : option.id}>
								<Image src={oldOrNew(option)} fallback={fallbackSrc} preview={false} />
							</Radio>
						)
					})}
				</Radio.Group>
			)

		case 'radio':
			return (<Radio.Group options={options}
				defaultValue={props.value}
				onChange={props.onChange} />);
		case 'textarea':
			return (<Input.TextArea autoComplete={'false'} value={props.value} onChange={props.onChange} />);
		case 'fileUpload':
			return (
				<React.Fragment>
					<ul>
						{props?.value?.combined ? props.value.combined.map((el, idx) => {
							return el.url !== ''
								? <li key={'uploaded-' + el.id}><Button onClick={e => uploadClick(el)}>{el.title}</Button></li>
								: <li key={'uploaded-' + idx}>{__('No file uploaded', 'kaliforms')}</li>
						}) : ''}
					</ul>
				</React.Fragment>
			);
		case 'dropdown':
		case 'choices':
			return (<Select onChange={props.onChange} value={props.value}>
				{
					options.map(el => <Select.Option key={el.value} value={el.value}>{el?.label ? el.label : el.value}</Select.Option>)
				}
			</Select>)
		case 'donation':
			return (
				<Card style={{ width: 200 }}>
					<Meta title={props.props?.donationName ? props.props.donationName : props.props.caption}
						description={__('Price: ', 'kaliforms') + ' ' + (props.value !== '' ? parseFloat(props.value).toFixed(2) : '0.00')} />
				</Card>
			);
		case 'gdpr':
		case 'termsAndConditions':
			return (
				<Switch checked={props.value === 'yes'} onChange={checked => { props.onChange(checked ? 'yes' : '') }}></Switch>
			)
		case 'product':
			return (
				<Card style={{ width: 200 }}
					cover={<img src={props.props?.picture?.fullUrl ? props.props.picture.fullUrl : fallbackSrc} />}
				>
					<Meta title={props.value.label} description={__('Price: ', 'kaliforms') + ' ' + parseFloat(props.value.price).toFixed(2)} />
				</Card>
			);
		case 'rating':
			return (<Rate value={parseInt(props.value)} count={parseInt(props.props.max)} onChange={props.onChange} />)
		case 'range':
			return (
				<Slider value={parseInt(props.value)}
					max={props?.props?.max ? parseInt(props.props.max) : 100}
					min={props?.props?.min ? parseInt(props.props.min) : 0}
					onChange={props.onChange}
				/>
			)
		case 'digitalSignature':
			return (<Image src={props.value} preview={'false'} />)
		default:
			return (<Input autoComplete={'false'} disabled={props.id === 'date_published'} value={props.value} onChange={props.onChange} />);
	}
}

const fallbackSrc = 'data:image/png;base64,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'
