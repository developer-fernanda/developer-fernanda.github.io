import axios from 'axios';
const AppProps = KaliFormsFormEntriesObject;
const API_URL = AppProps.restUrl;
const API_NONCE = AppProps.restNonce;

const Api = {
	/**
	 * Make the request
	 *
	 * @param {string} method
	 * @param {string} endpoint
	 * @param {object} data
	 * @returns
	 */
	request(method, endpoint, data = {}) {
		let url = API_URL + endpoint;
		return axios({
			method,
			url,
			data,
			headers: { 'X-WP-Nonce': API_NONCE }
		});
	},
	/**
	 * Get form entry
	 */
	getFormEntries(id, page = 1, pageSize = 10, filter = false) {
		if (id === '') {
			throw new Error('No form id given');
		}

		let url = `entries/parsed/${id}/?per_page=${pageSize}&page=${page}`
		if (filter) {
			for (let key in filter) {
				if (isNaN(filter[key]) && !filter[key]) {
					continue;
				}
				if (Array.isArray(filter[key]) && filter[key].length === 0) {
					continue;
				}
				if (filter[key] === '') {
					continue;
				}
				if (Array.isArray(filter[key]) && filter[key].length > 0) {
					if (filter[key][0].hasOwnProperty('_isAMomentObject')) {
						let tempValues = [];
						filter[key].map((el, idx) => {
							tempValues.push(el.format('D-M-YYYY'));
						});
						filter[key] = tempValues.join(',');
					}
				}
				if (filter[key] === true) {
					filter[key] = 'yes'
				}

				url += `&${key}=${filter[key]}`
			}
		}


		return this.request('GET', url);
	},

	/**
	 * Get all submission info
	 * @param {*} id
	 */
	getFormEntry(id) {
		if (id === '') {
			throw new Error('No submission id given');
		}

		let url = `entry/${id}`
		return this.request('GET', url)
	},
	/**
	 * Save form entry
	 * @param {Entry} entry
	 */
	saveEntry(entry) {
		let url = `entries/${entry.id}`
		return this.request('PATCH', url, entry.fields)
	},
	/**
	 * Delete entry
	 * @param {int} id
	 */
	deleteEntry(id) {
		let url = `entries/${id}`
		return this.request('DELETE', url)
	},
	/**
	 * Delete entries
	 * @param {*} ids
	 */
	deleteEntries(ids) {
		let url = `entries/delete`
		return this.request('POST', url, { ids })
	},
	/**
	 * Start export
	 */
	startExport(data) {
		let url = `entries/export`;

		return this.request('POST', url, data)
	},
	/**
	 * Get sheets
	 */
	getSheets() {
		let url = `entries/export/google-sheets`;
		return this.request('GET', url)
	},
	/**
	 * Resend emails
	 */
	resendEmails(data) {
		let url = `entries/resend-emails`;
		return this.request('POST', url, data)
	},
	/**
	 * Grabs the frontend link from the submission frontend
	 * @param {} data
	 */
	getFrontendLink(data) {
		let url = `entries/frontend-link`;
		return this.request('POST', url, data);
	}
}

export default Api;
