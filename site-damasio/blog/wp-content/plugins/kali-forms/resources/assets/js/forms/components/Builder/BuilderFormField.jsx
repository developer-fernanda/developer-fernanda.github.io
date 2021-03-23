import React from 'react';
import paypalLogo from './../../../../img/paypal.svg';
import Box from '@material-ui/core/Box';
import builderFormFieldStyles from './BuilderFormFieldStyles';
import { observer } from "mobx-react";
import { store } from "./../../store/store";
const { __, sprintf } = wp.i18n;
import Icon from '@material-ui/core/Icon';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

const BuilderFormField = observer((props) => {
	const classes = builderFormFieldStyles(props);
	const previewField = (field, classes) => {
		if (field === null) {
			field = store._GRID_.draggedItem
		}

		const iconClass = store._FIELD_COMPONENTS_.formFieldIconMap.hasOwnProperty(field.id)
			? store._FIELD_COMPONENTS_.formFieldIconMap[field.id]
			: '';
		switch (field.id) {
			case 'gdpr':
			case 'termsAndConditions':
				var label = setComputedLabelFunc(field);
				var required = field.properties.required;
				var defaultVal = field.properties.default;
				var placeholder = field.properties.placeholder;
				return (
					<React.Fragment>
						<Box className={classes.label} component="label">
							<If condition={iconClass !== ''}>
								<Icon className={iconClass} />
							</If>
							{label} {required ? store._FORM_INFO_.requiredFieldMark || '(*)' : ''}
						</Box>
						<Box className={classes.small} component="small">
							{field.properties.description}
						</Box>
					</React.Fragment>
				)
				break;
			case 'rating':
				var label = setComputedLabelFunc(field);
				var items = [];
				var defaultVal = field.properties.default;
				var max = parseFloat(field.properties.max) > 10 ? 10 : parseFloat(field.properties.max);
				for (var j = 0; j < max; j++) {
					items.push(<Icon className={'icon-star'} key={j} color={defaultVal <= j ? 'inherit' : 'primary'} />);
				}

				return (
					<React.Fragment>
						<Box component="label" className={classes.label}>
							<If condition={iconClass !== ''}>
								<Icon className={iconClass} />
							</If>
							{label} {required ? store._FORM_INFO_.requiredFieldMark || '(*)' : ''}
						</Box>
						<Box component="span" className={classes.rating}>
							{items}
						</Box>
						<Box component="small" className={classes.small}>
							{field.properties.description}
						</Box>
					</React.Fragment>
				)
			case 'choices':
			case 'dropdown':
				var label = setComputedLabelFunc(field);
				var checked = field.properties.default;
				var required = field.properties.required;
				var value = checked === '' ? __('-- Select an option --', 'kaliforms') : checked.split(',')[0];
				return (
					<React.Fragment>
						<Box component="label" className={classes.label}>
							<If condition={iconClass !== ''}>
								<Icon className={iconClass} />
							</If>
							{label} {required ? store._FORM_INFO_.requiredFieldMark || '(*)' : ''}
						</Box>
						<Box component="span" className={classes.select}>
							<Box component="span" className={'select-value'}>
								{value}
							</Box>
							<Box component="span" className={'select-arrow'}>
								<Icon className={'icon-down'} />
							</Box>
						</Box>
						<Box component="small" className={classes.small}>{field.properties.description}</Box>
					</React.Fragment>
				)
			case 'freeText':
				var label = field.properties.id;
				var content = field.properties.content;
				if (content !== '') {
					return (<Box className={classes.freeText} ><span dangerouslySetInnerHTML={{ __html: field.properties.content }}></span></Box>);
				}

				return (<Box component="span">{label}</Box>)
			case 'radio':
				var label = setComputedLabelFunc(field);
				return (
					<React.Fragment>
						<Box className={classes.label} component="label">
							<If condition={iconClass !== ''}>
								<Icon className={iconClass} />
							</If>
							{label} {required ? store._FORM_INFO_.requiredFieldMark || '(*)' : ''}
						</Box>
						<Box className={classes.radioCheckbox}>
							<If condition={field.properties.hasOwnProperty('choices')}>
								{
									field.properties.choices.map((choice, idx) => {
										var checked = choice.value === field.properties.default;
										return (
											<Box component="label" className={classes.labelCheckbox} key={choice.value + idx}>
												<input type="radio" checked={checked} onChange={e => e} className={classes.checkbox} />
												<em>{choice.value}</em> / {choice.label}
											</Box>
										)
									})
								}
							</If>
						</Box>
						<Box component="small" className={classes.small}>{field.properties.description}</Box>
					</React.Fragment>
				);
			case 'checkbox':
				var label = setComputedLabelFunc(field);
				return (
					<React.Fragment>
						<Box className={classes.label} component="label">
							<If condition={iconClass !== ''}>
								<Icon className={iconClass} />
							</If>
							{label} {required ? store._FORM_INFO_.requiredFieldMark || '(*)' : ''}
						</Box>
						<Box className={classes.radioCheckbox}>
							<If condition={field.properties.hasOwnProperty('choices')}>
								{
									field.properties.choices.map((choice, idx) => {
										let checkedOptions = field.properties.default.split(',');
										let checked = checkedOptions.includes(choice.value);
										return (
											<Box component="label" className={classes.labelCheckbox} key={choice.value + idx}>
												<input type="checkbox" checked={checked} onChange={e => e} className={classes.checkbox} />
												<em>{choice.value}</em> / {choice.label}
											</Box>
										)
									})
								}
							</If>
						</Box>
						<Box component="small" className={classes.small}>{field.properties.description}</Box>
					</React.Fragment>
				);
			case 'textarea':
				var label = setComputedLabelFunc(field);
				var required = field.properties.required;
				var defaultVal = field.properties.default;
				var placeholder = field.properties.placeholder;
				return (
					<React.Fragment>
						<Box component="label" className={classes.label}>
							<If condition={iconClass !== ''}>
								<Icon className={iconClass} />
							</If>
							{label} {required ? store._FORM_INFO_.requiredFieldMark || '(*)' : ''}
						</Box>
						<textarea className={classes.textarea} placeholder={placeholder} value={defaultVal || ''} onChange={e => e} />
						<Box component="small" className={classes.small}>{field.properties.description}</Box>
					</React.Fragment>
				);
			case 'divider':
				return (
					<span className={classes.divider}>
						<span>{field.properties.type}</span>
						<hr />
					</span>
				);
			case 'fileUpload':
				return (
					<span className={classes.fileUpload}>
						<span>{__('Drag & Drop your files or Browse', 'kaliforms')}</span>
					</span>
				);
			case 'button':
			case 'submitButton':
				var label = setComputedLabelFunc(field);
				return (
					<React.Fragment>
						<If condition={typeof field.properties.style === 'undefined' || field.properties.style === 'default'}>
							<button className={classes.submitButton}>{label}</button>
						</If>
						<If condition={typeof field.properties.style !== 'undefined' && field.properties.style !== 'default'}>
							<button className={classes.submitButtonStripped + ' ' + field.properties.style}>{label}</button>
						</If>
						<Box component="small" className={classes.small}>{field.properties.description}</Box>
					</React.Fragment>
				)
			case 'hidden':
				var required = field.properties.required;
				var defaultVal = field.properties.default;
				var label = field.properties.name + ' field';
				return (
					<React.Fragment>
						<Box className={classes.label} component="label">
							<If condition={iconClass !== ''}>
								<Icon className={iconClass} />
							</If>
							{label} {required ? store._FORM_INFO_.requiredFieldMark || '(*)' : ''}
						</Box>
						<input className={classes.input} type="textbox" value={defaultVal || ''} onChange={e => e} />
						<Box className={classes.small} component="small">
							{field.properties.description}
						</Box>
					</React.Fragment>
				)
			case 'grecaptcha':
				return (
					<span className={classes.grecaptcha}>
						<img src={KaliFormsObject.assetsUrl + '/img/recaptcha.gif'} />
					</span>
				);
			case 'pageBreak':
				var label = setComputedLabelFunc(field);
				return (
					<span className={classes.pageBreak}>
						<div><button className="button">{__('Back', 'kaliforms')}</button></div>
						<div> {label} </div>
						<div><button className="button">{__('Next', 'kaliforms')}</button></div>
					</span>
				);
			case 'dateTimePicker':
			case 'date':
				var label = setComputedLabelFunc(field);
				var required = field.properties.required;
				var defaultVal = field.properties.default;
				var placeholder = field.properties.placeholder;
				return (
					<React.Fragment>
						<Box component="label" className={classes.label}>
							<If condition={iconClass !== ''}>
								<Icon className={iconClass} />
							</If>
							{label} {required ? store._FORM_INFO_.requiredFieldMark || '(*)' : ''}
						</Box>
						<input className={classes.input} type="date" placeholder={placeholder} value={defaultVal || ''} onChange={e => e} />
						{/* <Box component="span" className={'date-icon'}>
							<Icon className={'icon-data-picker'} />
						</Box> */}
						<Box className={classes.small} component="small">{field.properties.description}</Box>
					</React.Fragment>
				)
			case 'password':
				var label = setComputedLabelFunc(field);
				var required = field.properties.required;
				var defaultVal = field.properties.default;
				var placeholder = field.properties.placeholder;
				return (
					<React.Fragment>
						<Box className={classes.label} component="label">
							<If condition={iconClass !== ''}>
								<Icon className={iconClass} />
							</If>
							{label} {required ? store._FORM_INFO_.requiredFieldMark || '(*)' : ''}
						</Box>
						<input className={classes.input} type="textbox" placeholder="*******" onChange={e => e} />
						<Box className={classes.small} component="small">
							{field.properties.description}
						</Box>
					</React.Fragment>
				)
			case 'range':
				var label = setComputedLabelFunc(field);
				var required = field.properties.required;
				var defaultVal = field.properties.default;
				var placeholder = field.properties.placeholder;
				return (
					<React.Fragment>
						<Box className={classes.label} component="label">
							<If condition={iconClass !== ''}>
								<Icon className={iconClass} />
							</If>
							{label} {required ? store._FORM_INFO_.requiredFieldMark || '(*)' : ''}
						</Box>
						<input className={classes.input} min="0" max="100" type="range" placeholder={placeholder} value={defaultVal || ''} onChange={e => e} />
						<Box className={classes.small} component="small">
							{field.properties.description}
						</Box>
					</React.Fragment>
				)
			case 'wireTransfer':
				return (<React.Fragment>
					<Box className={classes.wireTransfer}>
						<Icon className={'icon-new-letter'} />
						<span style={{ marginLeft: 8 }}>{__('Wire Transfer', 'kaliforms')}</span>
					</Box>
				</React.Fragment>)
			case 'product':
				var label = setComputedLabelFunc(field);
				return (<React.Fragment>
					<Box className={classes.productField}>
						<ShoppingBasketIcon />
						<br />
						{label} - {field.properties.price} {store._FORM_INFO_.currency}
					</Box>
				</React.Fragment>)
			case 'multipleProducts':
				return (
					<React.Fragment>
						<Box className={classes.multipleProductField}>
							{!field.properties.products.length && (<div>{__('Add your first product', 'kaliforms')}</div>)}
							{field.properties.products.length > 0 && field.properties.products.map(product => (
								<Box key={product.id} className={classes.productField}>
									<ShoppingBasketIcon />
									<br />
									{product.label} - {product.price} {store._FORM_INFO_.currency}
								</Box>
							))}
						</Box>
					</React.Fragment>
				);
			case 'paypal':
				return (<span className={classes.paypal}><img src={paypalLogo} /></span>)
			case 'total':
				return (<React.Fragment>
					<Box className={classes.totalField}>
						<If condition={iconClass !== ''}>
							<Icon className={iconClass} />
						</If>
						<span dangerouslySetInnerHTML={{ __html: field.properties.content }}></span>
					</Box>
				</React.Fragment>)
			case 'stripe':
				var label = setComputedLabelFunc(field);
				return (
					<React.Fragment>
						<Box className={classes.label} component="label">
							<If condition={iconClass !== ''}>
								<Icon className={iconClass} />
							</If>
							{label} {required ? store._FORM_INFO_.requiredFieldMark || '(*)' : ''}
						</Box>
						<input className={classes.input} type="textbox" placeholder={placeholder} value={defaultVal || ''} onChange={e => e} />
						<Box className={classes.stripe} component="div">
							<Box className={classes.stripeCard}>{__('Card Number', 'kaliforms')}</Box>
							<Box className={classes.stripeDate}>MM/YY</Box>
							<Box className={classes.stripeCvc}>CVC</Box>
						</Box>
						<Box className={classes.small} component="small">
							{field.properties.description}
						</Box>
					</React.Fragment>
				);
			case 'smartTextOutput':
				return (
					<React.Fragment>
						<If condition={iconClass !== ''}>
							<Icon className={iconClass} />
						</If>
						<code className={classes.code}>{field.properties.content}</code>
					</React.Fragment>
				)
			case 'digitalSignature':
				var label = setComputedLabelFunc(field);
				return (
					<React.Fragment>
						<Box className={classes.label} component="label">
							<If condition={iconClass !== ''}>
								<Icon className={iconClass} />
							</If>
							{label} {required ? store._FORM_INFO_.requiredFieldMark || '(*)' : ''}
						</Box>
						<Box className={classes.imageRadio}>
							<Icon style={{ margin: '0 auto', lineHeight: '29px', fontSize: '2.65rem' }} className={'icon-digital-signature'} />
						</Box>
						<Box component="small" className={classes.small}>{field.properties.description}</Box>
					</React.Fragment>)
			case 'imageRadio':
				var label = setComputedLabelFunc(field);
				return (
					<React.Fragment>
						<Box className={classes.label} component="label">
							<If condition={iconClass !== ''}>
								<Icon className={iconClass} />
							</If>
							{label} {required ? store._FORM_INFO_.requiredFieldMark || '(*)' : ''}
						</Box>
						<Box className={classes.imageRadio}>
							<If condition={field.properties.hasOwnProperty('choices')}>
								{
									field.properties.choices.map((choice, idx) => {
										return (
											<Box component="div"
												key={(choice?.image?.id ? choice.image.id : choice.id) + idx + Math.floor(Math.random() * 100)}>
												<Icon className={'icon-image-choices ' + classes.imageRadioIcon} />
											</Box>
										)
									})
								}
							</If>
						</Box>
						<Box component="small" className={classes.small}>{field.properties.description}</Box>
					</React.Fragment>
				);
			case 'colorPicker':
				var label = setComputedLabelFunc(field);
				var required = field.properties.required;
				var defaultVal = field.properties.default;
				var placeholder = field.properties.placeholder;
				return (
					<React.Fragment>
						<Box className={classes.label} component="label">
							<If condition={iconClass !== ''}>
								<Icon className={iconClass} />
							</If>
							{label} {required ? store._FORM_INFO_.requiredFieldMark || '(*)' : ''}
						</Box>
						<input className={classes.inputColor} type="color" placeholder={placeholder} value={defaultVal || ''} onChange={e => e} />
						<Box className={classes.small} component="small">
							{field.properties.description}
						</Box>
					</React.Fragment>
				)
			default:
				var label = setComputedLabelFunc(field);
				var required = field.properties.required;
				var defaultVal = field.properties.default;
				var placeholder = field.properties.placeholder;
				return (
					<React.Fragment>
						<Box className={classes.label} component="label">
							<If condition={iconClass !== ''}>
								<Icon className={iconClass} />
							</If>
							{label} {required ? store._FORM_INFO_.requiredFieldMark || '(*)' : ''}
						</Box>
						<input className={classes.input} type="textbox" placeholder={placeholder} value={defaultVal || ''} onChange={e => e} />
						<Box className={classes.small} component="small">
							{field.properties.description}
						</Box>
					</React.Fragment>
				)
		}
	}

	/**
	 * Better labels
	 * @return {*}
	 */
	const setComputedLabelFunc = (field) => {
		let compLabel = `${field.label} field`;
		if (field.properties.caption !== '') {
			compLabel = field.properties.caption;
		}

		return compLabel;
	}

	const getField = (id) => {
		let field = store._FIELD_COMPONENTS_.fieldComponents.filter(el => el.internalId === id)
		if (!field.length) {
			return null
		}
		return field[0];
	}

	const field = getField(props.field);

	return (
		<Box className={classes.container}>
			<Icon className={'KaliFormsBuilderDragHandle icon-move16 ' + classes.moveButton} />
			{<If condition={typeof props.field !== 'undefined'}>
				{previewField(field, classes)}
			</If>}
		</Box>
	);
});

export default BuilderFormField;
