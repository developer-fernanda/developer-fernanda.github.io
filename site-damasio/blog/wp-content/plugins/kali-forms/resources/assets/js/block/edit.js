import './editor.scss';
const { __ } = wp.i18n;
const {
	InspectorControls,
} = wp.blockEditor;
const {
	Fragment,
	Component
} = wp.element;
const {
	SelectControl,
	Spinner,
	PanelBody,
} = wp.components;
/**
 * Import the get field component function ( separated because of lots of code in the switch )
 */
import getFieldComponent from './partials/get-field-component';
/**
 * Edit class
 */
class Edit extends Component {
	/**
	 * Class constructor
	 */
	constructor() {
		super(...arguments);
		this.onChangeContent = this.onChangeContent.bind(this);
		this.state = {
			formWithFields: [],
			formArr: [],
			forms: [],
			loading: false
		}
	}

	/**
	 * When changing content, save it the way it should be saved
	 * @param {*} data
	 */
	onChangeContent(data) {
		this.props.setAttributes({ content: data });
	}
	/**
	 * Component did update
	 * @param {*} newVal
	 * @param {*} oldVal
	 */
	componentDidUpdate(newVal, oldVal) {
		if (this.props.forms !== null && this.props.forms.length && oldVal.forms.length !== this.props.forms.length) {
			const formWithFields = [];
			const formArr = [{ value: 0, label: __('Please select a form', 'kaliforms') }];
			this.props.forms.map(e => {
				formArr.push({ value: e.id, label: e.title.rendered })
				formWithFields.push({ id: e.id, fields: JSON.parse(e.meta.kaliforms_field_components), grid: JSON.parse(e.meta.kaliforms_grid) })
			});

			this.setState(
				{ forms: this.props.forms, formArr: [...formArr], formWithFields: [...formWithFields] }
			)
		}
	}
	/**
	 * Component did mount hook
	 */
	componentDidMount() {
		if (typeof this.props.attributes.form === 'undefined' || parseFloat(this.props.attributes.form) === 0) {
			return;
		}
		this.props.setAttributes({
			loading: true,
		})
		jQuery.ajax({
			type: 'POST',
			data: {
				action: 'kaliforms_get_grid',
				id: this.props.attributes.form,
				nonce: KaliFormsGeneralObject.ajax_nonce
			},
			url: KaliFormsGeneralObject.ajaxurl,
			success: result => {
				this.props.setAttributes({
					loading: false,
					rows: JSON.parse(result),
				})
			},
		});
	}
	/**
	 * Update the placeholder value (default values in the frontend)
	 * @param {*} key
	 * @param {*} value
	 */
	updatePlaceholderValue = (key, value) => {
		let currentState = this.props.attributes.values;
		if (typeof currentState === 'undefined') {
			currentState = {};
		}

		currentState[key] = value;
		this.props.setAttributes(
			{ values: JSON.parse(JSON.stringify(currentState)) }
		);
	}
	/**
	 * Get the certain field value
	 * @param {*} name
	 */
	getFieldValue = name => {
		if (typeof this.props.attributes.values === 'undefined') {
			return '';
		}

		if (!this.props.attributes.values.hasOwnProperty(name)) {
			return ''
		}

		return this.props.attributes.values[name];
	}
	/**
	 * Update the "selected" form in the block
	 */
	updateFieldValue = val => {
		this.props.setAttributes(
			{
				loading: true,
				form: val,
				values: {}
			}
		);

		if (parseFloat(val) === 0) {
			this.props.setAttributes({ loading: false, form: 0, rows: {} })
			return;
		}

		jQuery.ajax({
			type: 'POST',
			data: {
				action: 'kaliforms_get_grid',
				id: val,
				nonce: KaliFormsGeneralObject.ajax_nonce
			},
			url: KaliFormsGeneralObject.ajaxurl,
			success: result => {
				this.props.setAttributes({
					loading: false,
					rows: JSON.parse(result),
				})
			},
		});
	}

	render() {
		if (!this.props.forms) {
			return <Spinner />
		}

		if (this.props.forms && this.props.forms.length === 0) {
			return __(
				'No forms available!',
				'kaliforms'
			);
		}

		if (typeof this.props.attributes.form === 'undefined' || parseFloat(this.props.attributes.form) === 0) {
			return (
				<Fragment>
					<p>{
						__(
							'Select a form created through Kali Forms in the sidebar!',
							'kaliforms'
						)
					}
					</p>
					<InspectorControls>
						<PanelBody title={__('Form selection', 'kaliforms')}>
							<SelectControl
								label={__(
									'Select a form created through Kali!',
									'kaliforms'
								)}
								value={this.props.attributes.form}
								options={this.state.formArr}
								onChange={(form) => this.updateFieldValue(form)}
							/>
						</PanelBody>
					</InspectorControls>
				</Fragment>
			)
		}

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={__('Form selection', 'kaliforms')}>
						<SelectControl
							label={__(
								'Select a form created through Kali!',
								'kaliforms'
							)}
							value={this.props.attributes.form}
							options={this.state.formArr}
							onChange={(form) => this.updateFieldValue(form)}
						/>
					</PanelBody>
				</InspectorControls>
				<If condition={typeof this.props.attributes.form !== 'undefined' && parseFloat(this.props.attributes.form) !== 0}>
					<Choose>
						<When condition={this.props.attributes.loading}>
							<Spinner />
						</When>
						<Otherwise>
							<div className="bootstrap-wrapper">
								{
									Object.keys(this.props.attributes.rows).map(row => {
										return (
											<div className={'row'}>
												{
													this.props.attributes.rows[row].map(col => {
														return (
															<div className={'col-' + col.col}>
																{getFieldComponent(col, this.getFieldValue, this.updatePlaceholderValue)}
															</div>
														)
													})
												}
											</div>
										)
									})
								}
							</div>
						</Otherwise>
					</Choose>
				</If>
			</Fragment>
		)
	}
}

export default Edit;
