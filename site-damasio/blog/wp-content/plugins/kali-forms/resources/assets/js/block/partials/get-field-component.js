const {
	Button,
	TextareaControl,
	TextControl,
	SelectControl,
	CheckboxControl,
	RadioControl,
} = wp.components;
const { __ } = wp.i18n;

/**
 * Get the field compoent
 */
const getFieldComponent = (col, valueGetter, callback) => {
	if (col.type === 'textbox') {
		col.type = col['properties.type'];
	}

	switch (col.type) {
		case 'freeText':
		case 'smartTextOutput':
			return <span>{col.content}</span>;
		case 'submitButton':
		case 'button':
			return <Button isPrimary>{col.caption === '' ? col.name : col.caption}</Button>
		case 'textarea':
			return <TextareaControl
				label={col.caption === '' ? col.name : col.caption}
				value={valueGetter(col.name)}
				onChange={value => callback(col.name, value)}
			/>
		case 'select':
		case 'choices':
		case 'dropdown':
			return <SelectControl
				label={col.caption === '' ? col.name : col.caption}
				value={valueGetter(col.name)}
				options={col.choices}
				onChange={value => callback(col.name, value)}
			/>
		case 'radio':
			return <RadioControl
				label={col.caption === '' ? col.name : col.caption}
				selected={valueGetter(col.name)}
				options={col.choices}
				onChange={value => callback(col.name, value)}
			/>
		case 'checkbox':
			let values = valueGetter(col.name);
			values = values.split(',');
			let parseValue = (state, val) => {
				if (values.includes(val) && state) {
					return;
				}

				if (state) {
					values.push(val);
				}

				if (!state) {
					values = values.filter(vl => vl !== val)
				}

				callback(col.name, values.join(','))
			}
			return (
				col.choices.map(choice => <CheckboxControl
					label={choice.label === '' ? choice.label : choice.value}
					checked={values.includes(choice.value)}
					onChange={value => parseValue(value, choice.value)}
				/>)
			);
		case 'pageBreak':
			return (<span className={'pagebreak-placeholder'}>
				<div><button className="button">{__('Back', 'kaliforms')}</button></div>
				<div> {col.caption === '' ? col.name : col.caption} </div>
				<div><button className="button">{__('Next', 'kaliforms')}</button></div>
			</span>)
		case 'text':
		case 'email':
		case 'number':
		case 'tel':
		case 'telephone':
		case 'hidden':
		case 'date':
		case 'dateTimePicker':
		case 'password':
			return <TextControl
				label={col.caption === '' ? col.name : col.caption}
				value={valueGetter(col.name)}
				onChange={value => callback(col.name, value)}
				type={col.type}
			/>
		case 'range':
			return <TextControl
				label={col.caption === '' ? col.name : col.caption}
				value={valueGetter(col.name)}
				onChange={value => callback(col.name, value)}
				max={col.max}
				min={col.min}
				type={col.type}
			/>
		case 'colorPicker':
			return <TextControl
				label={col.caption === '' ? col.name : col.caption}
				value={valueGetter(col.name)}
				onChange={value => callback(col.name, value)}
				type={'color'}
				className="kali-color-picker"
			/>
		case 'divider':
			return <hr />;
		case 'fileUpload':
			return (<span className={'fileUpload-placeholder'}>
				{__('Drag & drop', 'kaliforms')}
			</span>);
		default:
			return <span className="kali-placeholder">{col.caption === '' ? col.name : col.caption}</span>
	}
}

export default getFieldComponent;
