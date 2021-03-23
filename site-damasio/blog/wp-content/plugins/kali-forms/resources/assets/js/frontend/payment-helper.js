const { __ } = wp.i18n;
export default {
	/**
	 * Gather and test products with server
	 */
	async gatherProducts() {
		const data = { action: 'kaliforms_form_verify_products', data: { formId: this.formId, nonce: KaliFormsObject.ajax_nonce } };
		return this.axios.post(KaliFormsObject.ajaxurl, this.Qs.stringify(data))
			.then(r => {
				this._products = (r.data.response === 'ok') ? [] : r.data.response;
				this.form.dispatchEvent(new CustomEvent('kaliFormProductsGathered', { detail: this }))
			})
			.catch(e => {
				console.log(e);
			});
	},

	/**
	 * Get cart contents
	 */
	getCart() {
		let price = 0;
		let currency = 'USD';
		let description = [];
		if (typeof this._products === 'undefined') {
			return { price: price.toFixed(2), description: description.join("\n"), currency }
		}
		this._products.map(e => {
			this._payee = typeof e.payee !== 'undefined' ? e.payee : null;
			if (e.type === 'donation') {
				let htmlEl = document.querySelector(`[data-internal-id="${e.internalId.toLowerCase()}"]`)
				if (htmlEl === null) {
					price += 0;
					return;
				}
				if (htmlEl.value === '') {
					price += 0;
					return;
				};
				price += parseFloat(htmlEl.value) > 0 ? parseFloat(htmlEl.value) : 0;
				description.push(e.caption);
			}

			if (e.type === 'product') {
				price += parseFloat(e.price);
				description.push(e.caption);
			}

			if (e.type === 'multipleProducts' && this.isSelectedPrice(e)) {
				price += parseFloat(e.price)
				description.push(e.variant);
			}

			currency = e.currency;
		});
		return { price: price.toFixed(2), description: description.join("\n"), currency };
	},

	/**
	 * Is selected price?
	 * @param {} e
	 */
	isSelectedPrice(e) {
		let items = [...document.querySelectorAll(`[data-internal-id="${e.internalId.toLowerCase()}"]`)]
		if (!items.length) {
			return false;
		}

		if (typeof items.find(r => r.checked) === 'undefined') {
			return false;
		}

		if ((items.find(r => r.checked).value) === e.id) {
			return true;
		}
	},

	/**
	 * When a payment is approved, we need to dispatch the form submit event
	 * @param {*} data
	 * @param {*} actions
	 */
	async onApprove(data, actions) {
		this.loading = true;
		return actions.order.capture().then(async details => {
			if (this.hasOwnProperty('_logPayPalIntent')) {
				await this._logPayPalIntent(details);
			}

			this.payments = {
				payment_id: details.id,
				provider: 'paypal',
			}
			this.form.dispatchEvent(new Event('submit', { cancelable: true }));
		});
	},
	/**
	 * Create order callback
	 *
	 * @param {*} data
	 * @param {*} actions
	 */
	createOrder(data, actions) {
		const cart = this.getCart();
		let orderObj = {
			purchase_units: [
				{
					amount: {
						value: cart.price,
						currency_code: cart.currency,
					},
					description: cart.description,
				}
			]
		}
		if (this._payee !== null) {
			orderObj.purchase_units[0].payee = {
				email_address: this._payee,
			}
		}

		return actions.order.create(orderObj);
	},
	/**
	 * Callback when buttons are rendered
	 * @param {*} data
	 * @param {*} actions
	 */
	onInit(data, actions) {
		this.valid && this.form.checkValidity() ? actions.enable() : actions.disable();
		this.form.addEventListener('change', (e) => {
			this.valid && this.form.checkValidity() ? actions.enable() : actions.disable();
		})
	},
	/**
	 * Button click callback
	 * @param {*} data
	 * @param {*} actions
	 */
	onClick(data, actions) {
		[...this.formElements].map(e => {
			e.reportValidity();
		});

		if (!this.valid) {
			this.throwError();
		}
	},

	/**
	 * Handles PayPal
	 *
	 * @param {*} paypalObject
	 * @memberof FormProcessor
	 */
	async handlePayPalPayment(paypalObject) {
		if (typeof paypalObject.Buttons !== 'function') {
			return
		}

		this.createOrder = this.createOrder.bind(this);
		this.onApprove = this.onApprove.bind(this);
		this.onInit = this.onInit.bind(this);
		this.onClick = this.onClick.bind(this);

		this.paypalObject = paypalObject.Buttons({
			onInit: this.onInit,
			onClick: this.onClick,
			createOrder: this.createOrder,
			onApprove: this.onApprove,
		});

		if (this.conditionalFields) {
			return;
		}

		this.paypalObject.render('#kaliforms-paypal-button-container');
	},

	/**
	 * Returns the payment method chooser
	 */
	_getPaymentMethodChooser(paymentMethods) {
		if (!window.hasOwnProperty('KaliFormConditionalLogic' + this.formId)) {
			return null
		}
		let logic = 'KaliFormConditionalLogic' + this.formId;
		let identifier = window[logic].find(e => paymentMethods.includes(e.field.replace(/[0-9]/g, '')))

		return typeof identifier === 'undefined' ? null : document.querySelector(`[data-internal-id="${identifier.conditioner}"]`);
	},
	/**
	 * Returns the payment method translated, based on the field id
	 * @param {} value
	 */
	_getPaymentMethodTranslated(value) {
		let logic = 'KaliFormConditionalLogic' + this.formId;
		let identifier = window[logic].find(e => value === e.value)

		return typeof identifier !== 'undefined' ? identifier.field.replace(/[0-9]/g, '') : null;
	}
}
