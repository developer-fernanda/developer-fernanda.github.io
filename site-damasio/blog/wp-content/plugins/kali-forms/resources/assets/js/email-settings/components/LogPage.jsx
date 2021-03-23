import React from 'react';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import Qs from 'qs';
import { DataGrid } from '@material-ui/data-grid';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import Button from '@material-ui/core/Button';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
const { __ } = wp.i18n;
const LogPage = props => {
	const [rows, setRows] = React.useState([]);
	const [openModal, setOpenModal] = React.useState(false);
	const [modalText, setModalText] = React.useState('');
	const [loading, setLoading] = React.useState(true);
	const displayModal = text => {
		setOpenModal(true);
		setModalText(text);
	}
	const columns = [
		{ field: 'id', headerName: __('#', 'kaliforms'), width: 40, sortable: false, },
		{ field: 'mailer', headerName: __('Sender', 'kaliforms'), width: 110, sortable: false },
		{ field: 'type', headerName: __('Type', 'kaliforms'), width: 75, sortable: false, },
		{ field: 'date', headerName: __('Date', 'kaliforms'), width: 170, sortable: false, },
		{
			field: 'message',
			headerName: __('Content', 'kaliforms'),
			width: 520,
			sortable: false,
			renderCell: params => {
				const value = params.getValue('message')
				if (value === null) {
					return;
				}
				let intermediate = null;
				if (value.length > 70) {
					intermediate = value.substr(0, 70);
				}

				return (
					<React.Fragment>
						<If condition={value.length > 70}>
							<span>{intermediate}
								<IconButton disableRipple={true} style={{ padding: 5, minWidth: 0, color: 'rgb(255, 152, 0)' }} size="small" variant="text" onClick={e => displayModal(value)}><InfoOutlinedIcon /></IconButton>
							</span>
						</If>
						<If condition={value.length <= 70}>
							{value}
						</If>
					</React.Fragment>
				)
			}
		},
		{
			field: 'info',
			width: 50,
			sortable: false,
			headerName: __('Help', 'kaliforms'),
			renderCell: (params) => {
				const value = params.getValue('info');
				return (
					<React.Fragment>
						<If condition={value === 'ok'}>
							<CheckCircleOutlineIcon />
						</If>
						<If condition={value !== 'ok'}>
							<IconButton href={value} size="small" variant="text" color="primary" target="_blank"><HelpIcon /></IconButton>
						</If>
					</React.Fragment>
				)
			},
		}
	]
	const clearLog = () => {
		setLoading(true);
		const data = {
			action: 'kaliforms_clear_log',
			args: {
				nonce: KaliFormsEmailSettingsObject.ajax_nonce,
			}
		}
		axios.post(KaliFormsEmailSettingsObject.ajaxurl, Qs.stringify(data))
			.then(r => {
				if (r.data.success) {
					setRows([]);
				}

				setLoading(false);
			})
			.catch(e => {
				console.log(e);
			});
	}

	React.useEffect(() => {
		const data = {
			action: 'kaliforms_get_email_log',
			args: {
				nonce: KaliFormsEmailSettingsObject.ajax_nonce,
			}
		}
		axios.post(KaliFormsEmailSettingsObject.ajaxurl, Qs.stringify(data))
			.then(r => {
				if (r.data.success) {
					setRows([...r.data.content]);
				}

				setLoading(false);
			})
			.catch(e => {
				console.log(e);
			});

		return () => setRows([]);
	}, [])


	return (
		<React.Fragment>
			<Typography variant={'h6'}>
				{__('See your email log', 'kaliforms')}
			</Typography>
			<Grid container direction="row">
				<Grid item xs={12}>
					<Button onClick={e => clearLog()}>{__('Clear log', 'kaliforms')}</Button>
				</Grid>
				<Grid item xs={12} style={{ background: '#fff', height: 650, width: '100%' }}>
					<DataGrid loading={loading} rows={rows} columns={columns} pageSize={10} />
				</Grid>
			</Grid>
			<Dialog
				open={openModal}
				onClose={() => {
					setOpenModal(false);
					setModalText('');
				}}
			>
				<DialogTitle>{__('Error Info', 'kaliforms')}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{modalText}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={e => {
						setOpenModal(false);
						setModalText('');
					}} color="primary" autoFocus>
						{__('Ok', 'kaliforms')}
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment >
	);
}
export default LogPage;
