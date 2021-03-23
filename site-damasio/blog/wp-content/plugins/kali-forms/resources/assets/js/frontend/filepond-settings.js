const { __, sprintf } = wp.i18n;

/**
 * A small wrapper to create settings for the file pond plugin
 */
export default class FilePondSettings {
	/**
	 * URL etterg
	 *
	 * @readonly
	 * @memberof FilePondSettings
	 */
	get url() {
		return this._url;
	}
	/**
	 * URL setter
	 *
	 * @memberof FilePondSettings
	 */
	set url(v) {
		this._url = v;
	}
	/**
	 * Timeout getter
	 *
	 * @readonly
	 * @memberof FilePondSettings
	 */
	get timeout() {
		return this._timeout;
	}
	/**
	 * Timeout setter
	 *
	 * @memberof FilePondSettings
	 */
	set timeout(v) {
		this._timeout = parseInt(v);
	}

	/**
	 * Function to upload file to WP
	 *
	 * @readonly
	 * @memberof FilePondSettings
	 */
	get process() {
		const self = this;
		return (fieldName, file, metadata, load, error, progress, abort) => {
			const formData = new FormData();
			formData.append('action', 'kaliforms_form_upload_file');
			formData.append(fieldName, file, file.name);
			formData.append('nonce', KaliFormsObject.ajax_nonce)
			const request = new XMLHttpRequest();
			request.open('POST', this.url);

			request.upload.onprogress = (e) => {
				progress(e.lengthComputable, e.loaded, e.total);
			};

			request.onload = function () {
				if (request.status >= 200 && request.status < 300) {
					if (self.isJson(request.response)) {
						let json = JSON.parse(request.response);
						if (json.hasOwnProperty('errors')) {
							return error('something went wrong');
						}
					}
					load(request.responseText);
				}
				else {
					error('oh no');
				}
			};

			request.send(formData);
			return {
				abort: () => {
					request.abort();
					abort();
				}
			};
		};
	}

	/**
	 * Revert function, is called when you click UNDO in the image
	 *
	 * @readonly
	 * @memberof FilePondSettings
	 */
	get revert() {
		return (uniqueFileId, load, error) => {
			const formData = new FormData();

			formData.append('action', 'kaliforms_form_delete_uploaded_file')
			formData.append('id', parseFloat(uniqueFileId))
			formData.append('nonce', KaliFormsObject.ajax_nonce)
			const request = new XMLHttpRequest();
			request.open('POST', this.url);
			request.send(formData);

			// error('oh my goodness');

			// Should call the load method when done, no parameters required
			load();
		}
	}

	/**
	 * This should return the object needed to make the request
	 *
	 * @readonly
	 * @memberof FilePondSettings
	 */
	get settings() {
		return {
			server: {
				url: this.url,
				timeout: this.timeout,
				process: this.process,
				revert: this.revert,
			},
			...this._labels
		}
	}

	get filePondLabels() {
		return {
			'labelIdle': sprintf(__('Drag & Drop your files or %sBrowse%s', 'kaliforms'), '<span class="filepond--label-action">', '</span>'),
			'labelInvalidField': __('Field contains invalid files', 'kaliforms'),
			'labelFileWaitingForSize': __('Waiting for size', 'kaliforms'),
			'labelFileSizeNotAvailable': __('Size not available', 'kaliforms'),
			'labelFileLoading': __('Loading', 'kaliforms'),
			'labelFileLoadError': __('Error during load', 'kaliforms'),
			'labelFileProcessing': __('Uploading', 'kaliforms'),
			'labelFileProcessingComplete': __('Upload complete', 'kaliforms'),
			'labelFileProcessingAborted': __('Upload cancelled', 'kaliforms'),
			'labelFileProcessingError': __('Error during upload', 'kaliforms'),
			'labelFileProcessingRevertError': __('Error during revert', 'kaliforms'),
			'labelFileRemoveError': __('Error during remove', 'kaliforms'),
			'labelTapToCancel': __('tap to cancel', 'kaliforms'),
			'labelTapToRetry': __('tap to retry', 'kaliforms'),
			'labelTapToUndo': __('tap to undo', 'kaliforms'),
			'labelButtonRemoveItem': __('Remove', 'kaliforms'),
			'labelButtonAbortItemLoad': __('Abort', 'kaliforms'),
			'labelButtonRetryItemLoad': __('Retry', 'kaliforms'),
			'labelButtonAbortItemProcessing': __('Cancel', 'kaliforms'),
			'labelButtonUndoItemProcessing': __('Undo', 'kaliforms'),
			'labelButtonRetryItemProcessing': __('Retry', 'kaliforms'),
			'labelButtonProcessItem': __('Upload', 'kaliforms'),
		}
	}

	/**
	 * Class constructor
	 * @memberof FilePondSettings
	 */
	constructor() {
		this._timeout = 7000;
		this._url = KaliFormsFilePondObject.ajaxurl;
		this._labels = this.filePondLabels
	}

	/**
	 * verify if is json
	 * @param {string} str
	 */
	isJson(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}
}

