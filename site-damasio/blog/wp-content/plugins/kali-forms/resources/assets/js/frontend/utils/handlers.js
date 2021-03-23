export default class Handlers {
	/**
	 * Handles checkboxes required status when there is a group
	 *
	 * @memberof FormProcessor
	 */
	handleCheckboxes() {
		let fields = this.form.querySelectorAll('input[type=checkbox]');
		let groups = {};

		[...fields].map(e => {
			let name = e.getAttribute('name');

			if (!groups.hasOwnProperty(name)) {
				groups[name] = {
					required: e.hasAttribute('required') ? true : false,
					valid: false,
					fields: []
				};
			};
			e.setAttribute('data-was-required', e.hasAttribute('required') ? true : false);
			e.removeAttribute('required');

			groups[name].fields.push(e);
			groups[name].valid = groups[name].valid ? true : e.checked
		});

		this.checkboxes = groups;
	}
	/**
	 * Handle editors
	 */
	handleEditors() {
		if (!window.hasOwnProperty('wp') || !wp.hasOwnProperty('editor') || typeof wp.editor.getDefaultSettings !== 'function') {
			return;
		}
		let fields = this.form.querySelectorAll('textarea[editor]');

		[...fields].map(e => {
			let id = e.getAttribute('id');
			if (id === null) {
				id = e.getAttribute('data-internal-id')
				e.setAttribute('id', id)
			}
			e.setAttribute('data-was-required', e.hasAttribute('required') ? true : false);
			e.removeAttribute('required');
			this.editors.push(e);
			wp.editor.initialize(id, {
				tinymce: {
					wpautop: false,
					plugins: 'charmap colorpicker compat3x directionality fullscreen hr image lists media paste tabfocus textcolor wordpress wpautoresize wpdialogs wpeditimage wpemoji wpgallery wplink wptextpattern wpview',
					toolbar1: 'formatselect bold italic | bullist numlist | blockquote | alignleft aligncenter alignright | link unlink | spellchecker',
					setup: editor => editor.on('change', () => {
						let event = new Event('change');
						e.dispatchEvent(event);
						editor.save()
					}),
				},
				quicktags: true,
			})
		})
	}
	/**
	 * Adds input masks where needed
	 */
	handleInputMasks() {
		let fields = this.form.querySelectorAll("[data-format]");

		let masks = {
			'us': ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
			'usWithCode': ['+', '1', ' ', /[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
		};

		[...fields].map(field => {
			let mask = field.getAttribute('data-format');
			if (masks.hasOwnProperty(mask)) {
				maskInput({
					inputElement: field,
					mask: masks[mask],
					guide: true,
					showMask: true,
				})
			}
		});
	}
	/**
	 * Handles file uploads
	 */
	handleFileUploads() {
		let fields = this.form.querySelectorAll("[type='file']");

		if (typeof FilePond === 'undefined') {
			return;
		}

		[...fields].map(field => {
			let pond = FilePond.create(field);

			this.uploadFields.push(field.getAttribute('name'));
			const options = {
				/**
				 * Required field attribute
				 */
				required: field.hasAttribute('required'),
				/**
				 * Name of the field
				 */
				name: field.getAttribute('name'),
				/**
				 * Is the field disabled?
				 */
				disabled: field.hasAttribute('readonly'),
				/**
				* In case we allow image preview
				*/
				allowImagePreview: field.hasAttribute('imagepreview'),
				/**
				 * Max file size
				 */
				maxFileSize: field.getAttribute('data-maxfilesize'),
				/**
				 * Instant upload files to the server
				 */
				instantUpload: field.hasAttribute('instantupload'),
				/**
				 * File type validation
				 */
				acceptedFileTypes: field.getAttribute('data-acceptedextensions') !== null ? field.getAttribute('data-acceptedextensions').split(',') : null,
				/**
				 * Add a file prefix
				 */
				fileRenameFunction: (file) => {
					let prefix = field.getAttribute('data-fileprefix')
					return prefix !== null ? `${prefix}${file.name}` : file.name;
				},
				/**
				 * Callback when field is ready to use
				 */
				oninit: () => document.dispatchEvent(new CustomEvent('kaliFormUploadFieldInit', {
					detail: { name: field.getAttribute('name'), instance: pond }
				}))
			}

			pond.setOptions(options);
		});
	}
	/**
	 * Handles recaptcha
	 */
	handleRecaptcha() {
		this.grecaptcha = false;
		let grecaptchas = document.querySelectorAll("[data-field-type='grecaptcha']")
		grecaptchas = [...grecaptchas];
		if (!grecaptchas.length) {
			return;
		}
		if (typeof grecaptcha === 'undefined') {
			return;
		}

		this.grecaptcha = true;
		grecaptcha.ready(() => {
			grecaptchas.map(e => {
				grecaptcha.render(e.getAttribute('id'),
					{
						sitekey: e.getAttribute('data-sitekey'),
						callback: this.verifyRecaptchaCallback.bind(this)
					}
				)
			})
		})
	}
	/**
	 * Verifies if the recaptcha is valid
	 * @param {String} res
	 */
	verifyRecaptchaCallback(res) {
		const data = { action: 'kaliforms_form_verify_recaptcha', data: { formId: this.formId, nonce: this.nonce, token: res } };
		this.submitButton.setAttribute('disabled', 'disabled');
		this.axios.post(KaliFormsObject.ajaxurl, this.Qs.stringify(data))
			.then(r => {
				this.submitButton.removeAttribute('disabled');
				if (r.data.hasOwnProperty('error')) {
					this.throwError();
				} else {
					this.grecaptchaValidation = r.data.response.success;
				}
			})
			.catch(e => {
				console.log(e);
			});
	}

}
