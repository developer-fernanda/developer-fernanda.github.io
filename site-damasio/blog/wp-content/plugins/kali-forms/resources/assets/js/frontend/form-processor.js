import PaymentHelper from './payment-helper.js';
const { __, sprintf } = wp.i18n;
const { axios, Qs, maskInput } = window.KaliExports;

export default class FormProcessor {
	/**
	 * Get initial load
	 */
	get initialLoaded() {
		return this._initialLoaded;
	}
	/**
	 * Set initial load
	 */
	set initialLoaded(state) {
		state ? this.form.classList.add('fade-in-bck') : '';
		return this._initialLoaded = state;
	}
	/**
	 * Sets loading state of the form
	 *
	 * @memberof FormProcessor
	 */
	set loading(value) {
		this._loading = value;
		value ? this.appendLoader() : this.removeLoader()
	}
	/**
	 * Get loading state
	 *
	 * @memberof FormProcessor
	 */
	get loading() {
		return this._loading;
	}
	/**
	 * Error message
	 * @memberof FormProcessor
	 * @param {string} value
	 */
	set errorMessage(value) {
		this._errorMessage = value;
		document.getElementById(`kaliforms-global-error-message-${this.formId}`).innerText = value;
	}
	/**
	 * Returns the error message
	 *
	 * @readonly
	 * @memberof FormProcessor
	 */
	get errorMessage() {
		return document.getElementById(`kaliforms-global-error-message-${this.formId}`).innerText
	}
	/**
	 * Check if the form elements are all valid
	 *
	 * @readonly
	 * @memberof FormProcessor
	 */
	get valid() {
		let checks = { formValidation: true };
		if (this.grecaptcha) {
			checks = { ...checks, recaptcha: this.grecaptchaValidation }
			if (!checks.recaptcha) {
				this.errorMessage = __('Please complete recaptcha challenge', 'kaliforms');
			}
		}

		if (this.editors.length) {
			this.editors.map(e => {
				let required = e.getAttribute('data-was-required');
				if (required === 'true' && e.value === '') {
					checks.formValidation = false;
				}
			})
		}

		if (this.hasOwnProperty('digitalSignatures') && this.digitalSignatures.length) {
			this.digitalSignatures.map(signature => {
				let required = signature.input.hasAttribute('required');
				if (required && signature.input.value === '') {
					checks.formValidation = false;
					signature.handler.triggerError();
				}
			})
		}

		if (this.choices.length) {
			const multipleValidation = choice => {
				let required = choice.passedElement.element.hasAttribute('data-was-required');
				if (!required) {
					return true;
				}

				let value = choice.getValue();
				return value.length > 0;

			}
			const singleValidation = choice => {
				let required = choice.passedElement.element.hasAttribute('required');
				if (!required) {
					return true;
				}

				let value = choice.getValue();
				if (value.placeholder || value === '') {
					return false
				}

				return true;
			}

			this.choices.map(choice => {
				let valid = choice.passedElement.element.hasAttribute('multiple')
					? multipleValidation(choice)
					: singleValidation(choice)


				if (!valid) {
					checks.formValidation = false;
					choice.triggerError()
				}
			})
		}
		if (Object.keys(this.checkboxes).length) {
			for (let key in this.checkboxes) {
				let group = this.checkboxes[key];
				if (!group.required) {
					continue;
				}

				group.fields.map(field => group.valid = group.valid ? true : field.checked)
			}

			for (let key in this.checkboxes) {
				let group = this.checkboxes[key];
				// Let s see if we have a conditioned field
				if (group.required && !group.valid) {
					group.fields.map((field, idx) => {
						if (field.offsetParent === null) {
							group.valid = true;
							return;
						}
					})
				}
				// Run check
				if (group.required && !group.valid) {
					checks.formValidation = false;
					group.fields.map((field, idx) => {
						if (idx === 0) {
							field.setAttribute('required', 'true');
							this.form.reportValidity()

							setTimeout(() => field.removeAttribute('required'), 1000)
						}
					});
				}
			}
		}

		if (this.hasOwnProperty('akismet') && checks.formValidation) {
			checks.formValidation = !this.akismet
		}

		if (this.honeypot) {
			this.honeypotFields.map(e => {
				if (e.value !== '') {
					checks.formValidation = false;
				}
			});
		}

		return this.grecaptcha ? (checks.formValidation && checks.recaptcha) : checks.formValidation
	}
	/**
	 * Sleep function
	 * @param {} ms
	 */
	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	/**
	 * Class constructor
	 * @param {*} nodeElement
	 * @memberof FormProcessor
	 */
	constructor(nodeElement) {
		// This is how we start
		this.attachInitialLoadevent();

		// Define some ids,style and the most important form id
		this.id = nodeElement.getAttribute('id');
		this.style = nodeElement.getAttribute('data-form-style');
		this.formId = parseInt(nodeElement.getAttribute('data-form-id'));

		// Form HTML
		this.form = nodeElement;
		this.formElements = this.form.elements;

		// Special fields
		this.uploadFields = [];
		this.editors = [];
		this.checkboxes = {};
		this.choices = [];

		// We do need a nonce
		this.nonce = KaliFormsObject.ajax_nonce;

		// Global error message holder
		this.globalErrorMessage = this.errorMessage;

		// Submit button ( so we can prevent submission )
		this.submitButton = this.form.querySelector('input[type=submit]');

		// We need preflight for AKISMET ( for now, we should add here whatever we need )
		this.preFlightNeeded = KaliFormsObject.akismetEnabled !== '0';

		// AJAX RELATED
		this.axios = axios;
		this.Qs = Qs;

		// Define honeypot fields
		this.checkHoneypot();

		// Enable styling
		this.enableStyling();

		// Enable javascript for special fields
		this.handleCheckboxes();
		this.handleEditors();
		this.handleInputMasks();
		this.handleFileUploads();
		this.handleRecaptcha();
		this.handleSubmit();

		// In case its a payment form, start the process
		this.verifyAndStartPayments();

		// Dispatch the constructed event
		document.dispatchEvent(new CustomEvent('kaliFormProcessConstructed', { detail: this }))
	}

	/**
	 * Verifies and start payment scripts if needed
	 */
	async verifyAndStartPayments() {
		this.paymentForm = false;
		// Let s assume its not a multiple payment method submission
		this.multiplePaymentMethods = false;
		// Payments is sent on form submission
		this.payments = null;
		// Payment method holder
		let paymentMethods = [];
		// Do we have wire transfer on our page?
		if (document.querySelector('[data-kali-form-type="wireTransfer"]') !== null) {
			paymentMethods.push('wireTransfer')
		}
		// Do we have paypal on our page?
		if (typeof paypal !== 'undefined') {
			paymentMethods.push('paypal')
		}
		// Do we have stripe on our page?
		if (typeof Stripe !== 'undefined'
			&& typeof KaliFormsStripe !== 'undefined'
			&& KaliFormsStripe.hasOwnProperty('key')
		) {
			paymentMethods.push('stripe');
		}

		// In case we dont have payment methods, it means its not a payment form
		if (!paymentMethods.length) {
			return;
		}

		// Load helpers
		this.handlePayments(PaymentHelper);
		if (typeof KaliPaymentsPluginHelper !== 'undefined') {
			this.handlePayments(KaliPaymentsPluginHelper)
		}

		// Lets gather our products here
		await this.gatherProducts();
		if (this._products.length) {
			// Determined that its a payment form
			this.paymentForm = true;
		}
		// And if it has or not multiple payment methods
		this.multiplePaymentMethods = paymentMethods.length > 1

		// In case we need to load stripe
		if (paymentMethods.includes('stripe')) {
			this.handlePayments(KaliPaymentsPluginHelper);
			let methods = await this.handleStripePayment(Stripe);
			if (methods.includes('iban')) {
				paymentMethods.push('stripeiban');
			}
		}
		// In case we need to load paypal
		if (paymentMethods.includes('paypal')) {
			this.paypalObject = null;
			this.handlePayPalPayment(paypal);
		}

		// Determine the payment method chooser
		this.paymentMethodChooser = this._getPaymentMethodChooser(paymentMethods)

		this.form.dispatchEvent(new CustomEvent('kaliFormPaymentChecked', {
			detail: {
				paymentForm: this.paymentForm,
				getCart: typeof this.getCart === 'function' ? this.getCart : null,
				paymentMethodChooser: this.paymentMethodChooser,
				products: this._products
			}
		}))
	}

	/**
	 * Attaches an initial load event
	 */
	attachInitialLoadevent() {
		this.initialLoaded = false;
		document.addEventListener('kaliFormProcessConstructed', async e => {
			this.saveInitialSnapshot();
			if (this.conditionalFields) {
				while (!this.conditionalFieldsLoaded) {
					await this.sleep(50);
				}
				this.initialLoaded = true;
				return;
			}
			this.initialLoaded = true;
		})
		this.scrollTyIntoView();
	}
	/**
	 * Check honey pot
	 */
	checkHoneypot() {
		let nameHp = document.getElementById('kf-name-field');
		let emailHp = document.getElementById('kf-email-field');

		if (nameHp !== null && emailHp !== null) {
			this.honeypotFields = [
				nameHp,
				emailHp,
			]

			this.honeypot = true;
			return;
		}

		this.honeypot = false;
	}

	/**
	 * Formats the element as we need them
	 */
	enableStyling() {
		switch (this.style) {
			case 'inputLabelMerge':
				[...this.formElements].map(e => {
					if (e.tagName === 'BUTTON') {
						return;
					}
					if (['hidden', 'checkbox', 'radio', 'button', 'submit', 'file'].includes(e.getAttribute('type'))) {
						return
					}

					const wrapper = this.wrapAll(e.parentNode)
					wrapper.classList.add(this.style);
				});
				break;
			case 'inputLabelMergeOverlap':
				[...this.formElements].map(e => {
					if (e.tagName === 'BUTTON') {
						return;
					}

					if (['hidden', 'button', 'submit', 'file'].includes(e.getAttribute('type'))) {
						return
					}
					if (['checkbox', 'radio'].includes(e.getAttribute('type'))) {
						const parentNode = e.parentNode.parentNode;
						if (e.parentNode.classList.contains('image-radio-label')) {
							return;
						}
						if (parentNode.classList.contains(this.style)) {
							return;
						}

						const wrapper = this.wrapAll(e.parentNode.parentNode)
						wrapper.classList.add(this.style);
						wrapper.classList.add('checkbox-radio');
						return;
					}

					const wrapper = this.wrapAll(e.parentNode)
					wrapper.classList.add(this.style);
				});
				break;
			default: break;
		}
	}
	/**
	 *
	 * @param {DOMElement} target
	 * @param {DOMElement} wrapper
	 */
	wrapAll(target, wrapper = document.createElement('div')) {
		[...target.childNodes].forEach(child => wrapper.appendChild(child))
		target.appendChild(wrapper)
		return wrapper
	}
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

			e.setAttribute('data-saved-value', e.getAttribute('value'));
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
	 * Create functions from mixin
	 *
	 * @param {*} PaymentHelper
	 * @memberof FormProcessor
	 */
	handlePayments(PaymentHelper) {
		for (let key in PaymentHelper) {
			if (!this.hasOwnProperty(key)) {
				this[key] = PaymentHelper[key].bind(this)
			}
		}
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
				 * Min file size
				 */
				minFileSize: field.getAttribute('data-minfilesize'),
				/**
				 * Maximum total of file size exceeded
				 */
				maxTotalFileSize: field.getAttribute('data-maxtotalfilesize'),
				/**
				 * Instant upload files to the server
				 */
				instantUpload: field.hasAttribute('instantupload'),
				/**
				 * Allow multiple only if we have the attribute
				 */
				allowMultiple: field.hasAttribute('multiple'),
				/**
				 * How many files do we allow?
				 */
				maxFiles: field.hasAttribute('data-maxfiles') ? parseInt(field.getAttribute('data-maxfiles')) : 2,
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
				})),
				/**
				 * Functions that disable the submit button while we are "loading files"
				 */
				oninitfile: () => this.submitButton.setAttribute('disabled', 'disabled'),
				onprocessfiles: () => this.submitButton.removeAttribute('disabled'),
				onprocessfilerevert: () => {
					if (pond.instantUpload) {
						return;
					}
					this.submitButton.setAttribute('disabled', 'disabled')
				},
				onremovefile: () => {
					let currentFields = pond.getFiles();
					let unprocessed = currentFields.filter(el => el.status !== 5);
					unprocessed.length ? this.submitButton.setAttribute('disabled', 'disabled') : this.submitButton.removeAttribute('disabled');
				}
			}

			let generalSettings = window.generalFilePondSettings.settings;

			if (field.hasAttribute('multiple')) {
				generalSettings.labelIdle = sprintf(__('Drag & Drop your files (max %s) or', 'kaliforms'), options.maxFiles) + ' <span class="filepond--label-action"> ' + __('Browse', 'kaliforms') + ' </span>'
			}

			pond.setOptions({ ...generalSettings, ...options });
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
		this.grecaptchaValidation = false;
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
		if (this.submitButton !== null) {
			this.submitButton.setAttribute('disabled', 'disabled');
		}
		this.axios.post(KaliFormsObject.ajaxurl, this.Qs.stringify(data))
			.then(r => {
				if (this.submitButton !== null) {
					this.submitButton.removeAttribute('disabled');
				}
				if (r.data.hasOwnProperty('error')) {
					this.throwError();
				} else {
					this.grecaptchaValidation = r.data.response.success;

					let evnt = new Event('change');
					this.form.dispatchEvent(evnt)
				}
			})
			.catch(e => {
				console.log(e);
			});
	}

	/**
	 * Sets up validation
	 *
	 * @memberof FormProcessor
	 */
	setupValidation() {
		// console.log(Validate)
		// console.log('setting up validation')
	}

	/**
	 * Preflight request
	 */
	async preFlightRequest() {
		const data = {
			action: 'kaliforms_preflight', data: {
				formId: this.formId,
				nonce: this.nonce,
				data: this._getFormData()
			}
		}

		return this.axios.post(KaliFormsObject.ajaxurl, this.Qs.stringify(data))
	}

	/**
	 * Removes all errors from fields
	 */
	removeAllErrors() {
		for (let key in this._formFieldHTMLMap) {
			this._formFieldHTMLMap[key].classList.remove('kali-error');
		}
	}

	scrollTyIntoView() {
		document.addEventListener('kaliformShownThankYouMessage', evt => {
			document.querySelector('#kaliforms-thank-you-message').scrollIntoView({ behavior: 'smooth', block: 'start' })
		})
	}

	/**
	 * Handles form submit
	 *
	 * @memberof FormProcessor
	 */
	handleSubmit() {
		this.form.addEventListener('submit', async evt => {
			evt.preventDefault()
			document.getElementById(`kaliforms-global-error-message-${this.formId}`).style.display = 'none';
			this.errorMessage = this.globalErrorMessage;
			this.removeAllErrors();
			this.loading = true;
			const formData = this._getFormData();
			let continueProcess = true;
			if (this.preFlightNeeded && !this.hasOwnProperty('akismet')) {
				const result = await this.preFlightRequest();
				for (let key in result.data) {
					this[key] = result.data[key]
				}
			}

			if (this.paymentForm) {
				continueProcess = await this.handleSubmitPayment(formData);
			}

			this.valid && continueProcess ? this.makeRequest(this._getFormData()) : this.throwError();
		}, true)
	}
	/**
	 * Handle the payment during submission
	 */
	async handleSubmitPayment(formData) {
		// In case this.payments is already an object, it means that the request was processed ( paypal )
		if (this.payments !== null && this.payments.hasOwnProperty('payment_id')) {
			return true;
		}

		let handler = this.multiplePaymentMethods
			? await this.handleMultiplePaymentMethods(formData)
			: await this.handleSinglePaymentMethod(formData)


		if (handler) {
			this.form.dispatchEvent(new CustomEvent('kaliformPaymentProcessed', {
				detail: {
					payments: this.payments
				}
			}))
		}

		return handler;
	}
	/**
	 * Handles the single payment method submit
	 *
	 */
	async handleSinglePaymentMethod(formData) {
		if (document.querySelector('[data-kali-form-type="wireTransfer"]') !== null) {
			let createWireIntent = await this._processWireTransfer(formData)
			return createWireIntent.success
		}
		let process = await this.processStripe(formData, 'stripe');
		return process.success;
	}
	/**
	 * Handles the case where user can select a payment method
	 */
	async handleMultiplePaymentMethods(formData) {
		if (this.paymentMethodChooser === null) {
			return false;
		}

		let paymentMethodValue = this._getPaymentMethodTranslated(formData[this.paymentMethodChooser.getAttribute('name')]);

		if (['stripe', 'stripeiban'].includes(paymentMethodValue)) {
			let stripeProcess = await this.processStripe(formData, paymentMethodValue);
			return stripeProcess.success
		}

		if (paymentMethodValue === 'paypal' && this.payments === null) {
			this.errorMessage = __('Please complete the payment by clicking the PayPal button', 'kaliforms')
			return false;
		}

		if (paymentMethodValue === 'wiretransfer') {
			let createWireIntent = await this._processWireTransfer(formData)
			return createWireIntent.success
		}
	}

	/**
	 * Process stripe data
	 * @param {} formData
	 * @param {*} type
	 */
	async processStripe(formData, type) {
		let $stripeProcessed = { success: false, message: __('Something went wrong', 'kaliforms') };
		if (!this._products.length) {
			return { success: false, message: __('You don\'t have products in your form.', 'kaliforms') }
		}

		if (typeof this.stripe === 'object' && this._products.length) {
			let stripeType = typeof this.paymentRequestEvent !== 'undefined' ? 'paymentRequest' : type;
			let funcToRun = {
				stripe: this._processStripe,
				paymentRequest: this._processStripeRequestButton,
				stripeiban: this._processStripeIban,
			}

			try {
				$stripeProcessed = await funcToRun[stripeType].call(this, formData)
			} catch (error) {
				console.log(error);
			}
		}

		if ($stripeProcessed !== null && !$stripeProcessed.success) {
			this.errorMessage = $stripeProcessed.message;
			return $stripeProcessed;
		}

		return $stripeProcessed
	}

	/**
	 * Throw error if form is not valid
	 */
	throwError() {
		document.getElementById(`kaliforms-global-error-message-${this.formId}`).style.display = 'block';
		document.dispatchEvent(new CustomEvent('kaliformProcessError', { detail: this }))
		if (this.loading) {
			this.loading = false;
		}
	}

	/**
	 * Makes ajax request
	 *
	 * @memberof FormProcessor
	 */
	async makeRequest(formData) {
		let action = this.form.getAttribute('action');
		if (action !== null) {
			document.createElement('form').submit.call(this.form);
			return;
		}

		await this._processForm(formData)
	}

	/**
	 * Process form
	 *
	 * @param {*} data
	 */
	async _processForm(formData) {
		if (this.paymentForm) {
			formData.payments = this.payments;
		}
		const data = { action: 'kaliforms_form_process', data: formData, extraArgs: this._getExtra() };

		return axios.post(KaliFormsObject.ajaxurl, Qs.stringify(data))
			.then(r => {
				if (r.data.hasOwnProperty('error')) {
					this.throwError();
				} else {
					if (r.data.hasOwnProperty('terminated') && r.data.terminated) {
						if (r.data.hasOwnProperty('terminated_reason')) {
							this.errorMessage = r.data.terminated_reason;
						}

						if (r.data.hasOwnProperty('error_bag') && r.data.error_bag.length) {
							r.data.error_bag.map(el => {
								if (this._formFieldHTMLMap.hasOwnProperty(el.field)) {
									let htmlEl = this._formFieldHTMLMap[el.field];
									htmlEl.classList.add('kali-error');
								}
							})
						}

						this.throwError();
						return;
					}
					this.loading = false;
					this.showThankYouMessage(r.data)
					if (r.data.hasOwnProperty('redirect_url') && r.data.redirect_url !== '') {
						setTimeout(() => window.location.href = r.data.redirect_url, 5000)
					}
				}
			})
			.catch(e => {
				console.log(e);
			});
	}
	/**
	 * We use this object only for field uploads at the moment
	 */
	_getExtra() {
		return this.uploadFields
	}
	/**
	 * Gets form data
	 *
	 * @memberof FormProcessor
	 */
	_getFormData() {
		let arr = {
			formId: this.formId,
			nonce: this.nonce,
		};
		[...this.formElements].map(e => {
			let type = e.getAttribute('type');
			switch (type) {
				case 'checkbox':
					let values = [];
					[...document.getElementsByName(e.getAttribute('name'))].map(el => el.checked ? values.push(el.value) : false)
					arr[e.getAttribute('name')] = values
					break;
				case 'radio':
					let value = '';
					[...document.getElementsByName(e.getAttribute('name'))].map(el => el.checked ? value = el.value : false)
					arr[e.getAttribute('name')] = value
					break;
				case 'submit':
					break;
				case 'choices':
					let selected = e.querySelectorAll('option:checked');
					arr[e.getAttribute('name')] = Array.from(selected).map(el => el.value);
					break;
				case 'hidden':
					// This is how I send id's to the backend so we know we dont have to delete them
					if (this._getExtra().includes(e.getAttribute('name'))) {
						let currentVal = arr[e.getAttribute('name')];
						arr[e.getAttribute('name')] = typeof currentVal !== 'undefined'
							? arr[e.getAttribute('name')] + ',' + e.value
							: e.value;
						return;
					}

					if (e.getAttribute('name') !== null) {
						arr[e.getAttribute('name')] = e.value
					}
					break;
				default:
					if (e.getAttribute('name') !== null) {
						arr[e.getAttribute('name')] = e.value
					}
					break;
			}
		})
		return arr;
	}
	/**
	 * Shows the thank you message
	 *
	 * @param {*} response
	 * @memberof FormProcessor
	 */
	showThankYouMessage(response) {
		let resetForm = response.hasOwnProperty('reset') && response.reset === '1';

		resetForm ? this._resetFormAndShowThankYouMessage(response) : this._hideFormAndShowThankYou(response);
	}
	/**
	 * Resets form and shows the thank you message
	 * @param {*} $response
	 */
	_resetFormAndShowThankYouMessage(response) {
		this.form.insertAdjacentHTML('beforebegin', `<div id="kaliforms-thank-you-message">${response.thank_you_message}</div>`);
		this.form_data = response.form_data;
		document.dispatchEvent(new CustomEvent('kaliformShownThankYouMessage', { detail: this }))
		this.resetForm();
		setTimeout(() => document.getElementById('kaliforms-thank-you-message').remove(), 5000)
	}
	/**
	 * Hides the form and shows the thank you message
	 * @param {*} response
	 */
	_hideFormAndShowThankYou(response) {
		this.form.classList.add('fade-out-top');
		let animationEvent = this.whichAnimationEvent();
		animationEvent && this.form.addEventListener(animationEvent, () => {
			this.form.insertAdjacentHTML('beforebegin', `<div id="kaliforms-thank-you-message">${response.thank_you_message}</div>`);
			this.form.parentNode.removeChild(this.form)
			this.form_data = response.form_data;
			document.dispatchEvent(new CustomEvent('kaliformShownThankYouMessage', { detail: this }))
		});
	}
	/**
	 * Appends loader
	 *
	 * @memberof FormProcessor
	 */
	appendLoader() {
		this.form.classList.add('kaliform-loading');
		let loader = '<div id="kaliform-loader-container" class="kaliform-loader-container"><div class="kaliform-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';
		this.form.insertAdjacentHTML('beforeend', loader);
	}
	/**
	 * Removes loader
	 *
	 * @memberof FormProcessor
	 */
	removeLoader() {
		let loader = document.getElementById('kaliform-loader-container');
		this.form.classList.remove('kaliform-loading');
		if (loader !== null) {
			this.form.removeChild(loader);
		}
	}

	/**
	 * Reset form
	 *
	 * @memberof FormProcessor
	 */
	resetForm() {
		this.form.dispatchEvent(new CustomEvent('kaliResetForm', { detail: this }));
		[...this.formElements].map(e => {
			let name = e.getAttribute('name');
			let type = this._formFieldMap[name];
			if (this._initialSnapshot.hasOwnProperty(name)) {
				switch (type) {
					case 'rating':
						jQuery('.ui.rating').rating('set rating', parseFloat(this._initialSnapshot[name]));
						break;
					case 'checkbox':
						e.checked = this._initialSnapshot[name].includes(e.value)
						break;
					default:
						e.value = this._initialSnapshot[name];
						break;
				}

				let event = new Event('change');
				e.dispatchEvent(event);
			}
		})
	}
	/**
	 * Saves the initial snapshot
	 */
	saveInitialSnapshot() {
		this._initialSnapshot = this._getFormData();
		let maps = this._defineMap();
		this._formFieldMap = maps.types;
		this._formFieldHTMLMap = maps.html;
	}
	/**
	 * Define a form map
	 */
	_defineMap() {
		let formMap = {};
		let html = {};
		[...this.formElements].map(e => {
			if (e.getAttribute('name') === null) {
				return;
			}
			formMap[e.getAttribute('name')] = e.getAttribute('type');
			html[e.getAttribute('name')] = e;
			if (e.hasAttribute('data-kali-form-type')) {
				formMap[e.getAttribute('name')] = e.getAttribute('data-kali-form-type');
			}
		});

		return {
			types: formMap,
			html: html,
		}
	}
	/**
	 * Cross Browser compatibility for animation end
	 *
	 * @param {*} element
	 * @param {*} type
	 * @param {*} callback
	 * @memberof FormProcessor
	 */
	whichAnimationEvent() {
		let t;
		let el = document.createElement('fakeelement');
		let transitions = {
			'animation': 'animationend',
			'OAnimation': 'oAnimationEnd',
			'MozAnimation': 'animationend',
			'WebkitAnimation': 'webkitAnimationEnd'
		}

		for (t in transitions) {
			if (el.style[t] !== undefined) {
				return transitions[t];
			}
		}
	}
}
