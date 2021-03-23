import { makeStyles } from '@material-ui/core/styles';
import { store } from "./../store/store";

const appStyles = makeStyles(theme => {
	return {
		root: { display: 'flex' },
		toolbar: {
			minHeight: 48,
		},
		appBarSpacer: {
			minHeight: 48,
		},
		content: {
			background: props => { },
		},
		container: {
			position: 'relative',
		},
		drawer: {
			width: props => {
				return store._UI_.templateSelecting
					? 0
					: store._UI_.appBar === 'formSettings'
						? 310
						: 495;
			},
			flexShrink: 0,
			background: '#FAFAFA',
		},
		drawerPaper: {
			background: '#FAFAFA',
			width: props => {
				return store._UI_.templateSelecting
					? 0
					: store._UI_.appBar === 'formSettings'
						? 310
						: 495;
			},
		},
	}
});

export default appStyles;
