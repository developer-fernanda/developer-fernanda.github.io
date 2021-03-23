import Api from './Api';
import { message } from 'antd';
const { __ } = wp.i18n;

message.config({
	top: 40,
});

export const resendNotifications = (entryId, formId) => {
	Api.resendEmails({ id: entryId, formId: formId })
		.then(res => {
			if (res.data.status) {

				message.success({
					content: __('Notifications resent', 'kaliforms'),
					duration: 5,
				});
			}
		})
		.catch(err => console.warn(err))
}
