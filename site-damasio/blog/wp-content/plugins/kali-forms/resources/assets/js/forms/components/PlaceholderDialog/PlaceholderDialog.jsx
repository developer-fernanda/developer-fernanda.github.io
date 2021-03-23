import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import FileCopy from '@material-ui/icons/FileCopy';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import copy from 'copy-to-clipboard';
import MaterialTable from 'material-table';
import React, { forwardRef, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import SnackBarAction from '@/forms/components/SnackBars/SnackBarAction';
import { observer } from "mobx-react";
import { store } from "./../../store/store";
const { __ } = wp.i18n;

/**
 * Icons used in the table
 */
const tableIcons = {
	Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
	Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
	Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
	Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
	DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
	Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
	Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
	Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
	FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
	LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
	NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
	PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
	ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
	Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
	SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
	ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
	ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
	Save: forwardRef((props, ref) => <Save {...props} ref={ref} />),
};

/**
 * Placeholder dialog
 */
const PlaceholderDialog = observer((props) => {
	const [labels, setLabels] = useState([]);
	const { enqueueSnackbar } = useSnackbar();

	/**
	 * Handles closing of the dialog
	 */
	const handleClose = () => {
		store._UI_.setPlaceholderDialog(false)
	};
	/**
	 * When it exits, we need to make sure the store is updated as well
	 */
	const onExit = () => {
		store._UI_.setPlaceholderDialog(false)
	}
	/**
	 * Array consutrctor using the name of the fields
	 */
	const labelConstructor = () => {
		let fieldComponentsSimplified = [];
		store._FIELD_COMPONENTS_.fieldComponents.map(e => {
			if ([
				'divider',
				'freeText',
				'stripe',
				'wireTransfer',
				'paypal',
				'payPal',
			].includes(e.id)) {
				return;
			}

			if (typeof e.properties.name !== 'undefined' && e.properties.name !== '') {
				fieldComponentsSimplified.push('{' + e.properties.name + '}')
			}

			if (e.id === 'product' || e.id === 'multipleProduct') {
				fieldComponentsSimplified.push('{' + e.properties.name + ':price}');
				fieldComponentsSimplified.push('{' + e.properties.name + ':label}');
				fieldComponentsSimplified.push('{' + e.properties.name + ':image}');

				return;
			}

			if (e.id === 'radio' || e.id === 'checkbox' || e.id === 'dropdown' || e.id === 'choices') {
				fieldComponentsSimplified.push('{' + e.properties.name + ':value}');
				fieldComponentsSimplified.push('{' + e.properties.name + ':label}');
			}

			if (e.id === 'imageRadio' || e.id === 'fileUpload') {
				fieldComponentsSimplified.push('{' + e.properties.name + ':image}');
				fieldComponentsSimplified.push('{' + e.properties.name + ':url}');
				fieldComponentsSimplified.push('{' + e.properties.name + ':id}');
			}
		})

		setLabels(fieldComponentsSimplified);
	};

	/**
	 * When field components change, we need to update the labels as well
	 */
	useEffect(() => {
		labelConstructor()

		return () => setLabels([]);
	}, [])

	/**
	 * Placeholders available
	 */
	const placeholders = () => {
		let placeholders = [
			{
				placeholder: '{sitetitle}',
				description: __('Site title (set in Settings - General)', 'kaliforms'),
			},
			{
				placeholder: '{tagline}',
				description: __('Site tagline (set in Settings - General)', 'kaliforms'),
			},
			{
				placeholder: '{siteurl}',
				description: __('The WordPress address (URL) (set in Settings - General)'),
			},
			{
				placeholder: '{homeurl}',
				description: __('The Site address (URL) (set in Settings - General)', 'kaliforms'),
			},
			{
				placeholder: '{admin_email}',
				description: __('Admin email (set in Settings - General)', 'kaliforms'),
			},
			{
				placeholder: '{entryCounter}',
				description: __('Show the current entry number', 'kaliforms'),
			},
			{
				placeholder: '{formName}',
				description: __('Current form name', 'kaliforms'),
			},
		];

		if (KaliFormsObject.hasOwnProperty('submissionViewPage')) {
			placeholders.push({
				placeholder: '{submission_link}',
				description: __('Returns a link to view the submission', 'kaliforms')
			});
		}

		labels.map(e => {
			placeholders.push({
				placeholder: e,
				description: __('Form field', 'kaliforms')
			})
		})
		return placeholders;
	}

	return (
		<Dialog
			open={store._UI_.placeholderDialog}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			fullWidth={true}
			onExited={onExit}
			maxWidth="md"
		>
			<DialogContent>
				<MaterialTable
					icons={tableIcons}
					components={{ Container: props => <div>{props.children}</div> }}
					columns={[
						{ title: __('Placeholder', 'kaliforms'), field: "placeholder" },
						{ title: __('Description', 'kaliforms'), field: "description" },
					]}
					localization={{
						header: {
							actions: __('Actions', 'kaliforms'),
						},
						toolbar: {
							searchTooltip: __('Search', 'kaliforms'),
							searchPlaceholder: __('Search', 'kaliforms')
						},
						body: {
							emptyDataSourceMessage: __('No records to display', 'kaliforms'),
						},
						pagination: {
							labelDisplayedRows: __('{from}-{to} of {count}', 'kaliforms'),
							labelRowsSelect: __('rows', 'kaliforms'),
							labelRowsPerPage: __('Rows per page:', 'kaliforms'),
							firstAriaLabel: __('First page', 'kaliforms'),
							firstTooltip: __('First page', 'kaliforms'),
							previousAriaLabel: __('Previous page', 'kaliforms'),
							previousTooltip: __('Previous page', 'kaliforms'),
							nextAriaLabel: __('Next page', 'kaliforms'),
							nextTooltip: __('Next page', 'kaliforms'),
							lastAriaLabel: __('Last page', 'kaliforms'),
							lastTooltip: __('Last page', 'kaliforms')
						}
					}}
					data={placeholders()}
					actions={[
						{
							icon: () => <FileCopy />,
							tooltip: __('Copy to clipboard', 'kaliforms'),
							onClick: (event, rowData) => {
								// Do save operation
								copy(rowData.placeholder);
								store._UI_.setPlaceholderDialog(false);
								let key = rowData.placeholder;
								enqueueSnackbar(
									`${__('Placeholder', 'kaliforms')} ${rowData.placeholder} ${__('copied to clipboard', 'kaliforms')}`,
									{
										preventDuplicate: true,
										variant: 'success',
										action: (key) => <SnackBarAction snackKey={key} />
									}
								)
							}
						}
					]}
					title={__('Available placeholders', 'kaliforms')}
				/>
			</DialogContent>
		</Dialog>
	);
})

export default PlaceholderDialog;
