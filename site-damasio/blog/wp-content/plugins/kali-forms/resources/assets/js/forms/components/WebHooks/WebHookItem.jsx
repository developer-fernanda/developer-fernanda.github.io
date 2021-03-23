import React from 'react';
import webHookItemStyles from './WebHookItemStyles';
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import { observer } from "mobx-react";
import { store } from "./../../store/store";
import DoneIcon from '@material-ui/icons/Done';
import WarningIcon from '@material-ui/icons/Warning';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import Qs from 'qs';
const { __ } = wp.i18n;
const WebHookItem = observer(props => {
	const classes = webHookItemStyles();
	const [test, setTested] = React.useState('not-tested');
	const [loading, setLoading] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState('');

	const setEditingContainer = () => {
		props.setEditingHook(true);
		store._WEBHOOKS_.setEditedHook(props.hookIdx)
	}
	const duplicateHook = () => {
		store._WEBHOOKS_.duplicateHook(props.hookIdx)
	}
	const removeHook = () => {
		store._WEBHOOKS_.removeHook(props.hookIdx)
	}
	const testServer = () => {
		const data = {
			action: 'kaliforms_test_webhook',
			args: {
				nonce: KaliFormsObject.ajax_nonce,
				hook: store._WEBHOOKS_.hooks[props.hookIdx]
			}
		};
		setLoading(true);
		axios.post(KaliFormsObject.ajaxurl, Qs.stringify(data))
			.then(r => {
				setTested(r.data.success ? 'ok' : 'nok');
				if (!r.data.success) {
					setErrorMsg(r.data.message);
				}
				setLoading(false);
			})
			.catch(e => {
				console.log(e);
			});
	}
	return (
		<React.Fragment>
			<Box className={classes.root}>
				<Box className={classes.label}>
					<span dangerouslySetInnerHTML={{ __html: props.name }}></span>
				</Box>
				<Box className={classes.actionBox}>
					<Box onClick={() => testServer()}>
						<If condition={loading}>
							<CircularProgress style={{ width: 20, height: 20, marginRight: 8 }} />
						</If>
						<If condition={test !== 'not-tested'}>
							<If condition={test === 'ok'}>
								<DoneIcon style={{ color: 'green', marginRight: 8 }} />
							</If>
							<If condition={test === 'nok'}>
								<Tooltip title={errorMsg}>
									<WarningIcon style={{ color: 'red', marginRight: 8 }} />
								</Tooltip>
							</If>
						</If>
						{__('Test', 'kaliforms')}
					</Box>
					<Box onClick={() => setEditingContainer()}>
						<Icon className={'icon-edit-2'} />
						{__('Edit', 'kaliforms')}
					</Box>
					<Box onClick={duplicateHook}>
						<Icon className={'icon-copy'} />
						{__('Duplicate', 'kaliforms')}
					</Box>
					<Box onClick={removeHook}>
						<Icon className={'icon-remove'} />
						{__('Delete', 'kaliforms')}
					</Box>
				</Box>
			</Box>
		</React.Fragment>
	)
})

export default WebHookItem;
