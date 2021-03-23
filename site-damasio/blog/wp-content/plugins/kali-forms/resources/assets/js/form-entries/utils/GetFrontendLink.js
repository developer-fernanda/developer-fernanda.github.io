import Api from './Api';
import { message } from 'antd';
const { __ } = wp.i18n;
const AppProps = KaliFormsFormEntriesObject;

message.config({
	top: 40,
});

export const createLinkMap = _ => {
	let dataObj = {};
	AppProps.allForms.map(form => {
		dataObj[form.id] = form.submissionPage
	})

	return dataObj;
};

export const getFrontendLink = (entryId, formId) => {
	Api.getFrontendLink({ id: entryId, formId: formId })
		.then(res => {
			if (res.data.status) {

				copyToClipboard(res.data.url);
				message.success({
					content: __('Link copied to clipboard', 'kaliforms'),
					duration: 5,
				});
			}
		})
		.catch(err => console.warn(err))
}

const copyToClipboard = str => {
	const el = document.createElement('textarea');  // Create a <textarea> element
	el.value = str;                                 // Set its value to the string that you want copied
	el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
	el.style.position = 'absolute';
	el.style.left = '-9999px';                      // Move outside the screen to make it invisible
	document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
	const selected =
		document.getSelection().rangeCount > 0        // Check if there is any content selected previously
			? document.getSelection().getRangeAt(0)     // Store selection if found
			: false;                                    // Mark as false to know no selection existed before
	el.select();                                    // Select the <textarea> content
	document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
	document.body.removeChild(el);                  // Remove the <textarea> element
	if (selected) {                                 // If a selection existed before copying
		document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
		document.getSelection().addRange(selected);   // Restore the original selection
	}
};
