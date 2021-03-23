import React, { useContext, useState, useEffect } from 'react'
import { ExportContext } from './../Context/ExportContext';
import ExportDetails from './ExportDetails';
import { Result, Button, Spin } from 'antd';
import Api from './../utils/Api';

const { __ } = wp.i18n;

export default function StartExport() {
	const [exportOptions, setExportOptions] = useContext(ExportContext);
	const [downloadUrl, setDownloadUrl] = useState('');

	const labels = {
		idle: {
			title: __('Click the button below to start the export process!', 'kaliforms'),
			subTitle: '',
			button: __('Start export', 'kaliforms'),
		},
		processing: {
			title: __('We are currently processing the export file', 'kaliforms'),
			subTitle: __('Please be patient, this process might take a few minutes to complete', 'kaliforms'),
			button: __('Processing', 'kaliforms')
		},
		success: {
			title: __('Processing complete!', 'kaliforms'),
			subTitle: __('If the download does not start automatically, click the button below to start the download of your file', 'kaliforms'),
			button: __('Download file', 'kaliforms'),
		},
		successGoogle: {
			title: __('Processing complete!', 'kaliforms'),
			subTitle: __('A new file was created to your Google Drive account.', 'kaliforms'),
			button: __('Take me to Google Drive', 'kaliforms'),
		},
		error: {
			title: __('Something went wrong!', 'kaliforms'),
			subTitle: __('Something went wrong, please try exporting your data again. If you still encounter issues, please contact us directly so we can provide assistance.', 'kaliforms'),
			button: __('Go back', 'kaliforms'),
		}
	}

	const props = {
		title: labels[exportOptions.status].title,
		subTitle: labels[exportOptions.status].subTitle,
		status: (exportOptions.status === 'success' || exportOptions.status === 'error')
			? exportOptions.status
			: (exportOptions.status === 'successGoogle') ? 'success' : 'info',
		extra: (
			<Button type="primary" loading={exportOptions.loading} onClick={e => handleClick()}>
				{labels[exportOptions.status].button}
			</Button>
		)
	}

	if (exportOptions.status === 'processing') {
		props.icon = (<Spin size="large" />)
	}


	const handleClick = () => {
		switch (exportOptions.status) {
			case 'idle':
				startExport();
				break;
			case 'success':
				startDownload();
				break;
			case 'successGoogle':
				goToGoogleDrive();
				break;
			case 'error':
				resetExporter();
				break;
		}
	}

	const resetExporter = () => {
		setExportOptions(prevState => {
			return {
				loading: false,
				status: 'idle',
				form: null,
				fields: [],
				formattedFields: [],
				filters: [],
				fileFormat: 'csv',
				currentStep: 0,
				googleSheet: 'new',
			}
		})
	}

	const startDownload = () => {
		window.open(downloadUrl, '_blank');
	}

	const goToGoogleDrive = () => {
		window.open('https://drive.google.com', '_blank');
	}

	const startExport = () => {
		let data = {
			fields: exportOptions.formattedFields,
			filters: exportOptions.filters,
			form: exportOptions.form,
			fileType: exportOptions.fileFormat,
			googleSheet: exportOptions.googleSheet
		}
		setExportOptions(prevState => {
			return {
				...prevState,
				loading: true,
				status: 'processing'
			}
		})

		Api.startExport(data).then(res => {
			if (!res.data.status) {
				return setExportOptions(prevState => {
					return {
						...prevState,
						loading: false,
						status: 'error'
					}
				})
			}

			if (exportOptions.fileFormat !== 'gsheet') {
				setDownloadUrl(res.data.url);
				setTimeout(() => {
					window.open(res.data.url, '_blank');
				}, 2500)

				return setExportOptions(prevState => {
					return {
						...prevState,
						loading: false,
						status: 'success'
					}
				})
			}

			return setExportOptions(prevState => {
				return {
					...prevState,
					loading: false,
					status: 'successGoogle'
				}
			})
		}).catch(err => {
			setExportOptions(prevState => {
				return {
					...prevState,
					loading: false,
					status: 'error'
				}
			})
		})
	}


	return (
		<div>
			<Result {...props} />
		</div>
	)
}
