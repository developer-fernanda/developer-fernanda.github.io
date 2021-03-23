import { makeStyles } from '@material-ui/core/styles';

const SidebarFieldTypeStyles = makeStyles(theme => {
	return {
		datePickerLabel: {
			transform: 'translate(0, 8px) scale(0.75) !important',
		},
		datePicker: {
			marginBottom: '10px !important',
		},
		timePicker: {
			marginTop: '10px !important',
		},
		colorInput: {
			'& .MuiInputBase-input': {
				padding: 3,
				minHeight: 40,
			}
		}
	}
});

export default SidebarFieldTypeStyles;
