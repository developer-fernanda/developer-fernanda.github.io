import { makeStyles } from '@material-ui/core/styles';
const conditionalLogicItemCountStyles = makeStyles(theme => {
	return {
		root: {
			border: '1px solid #46494C',
			borderRadius: '50%',
			height: 20,
			width: 20,
			position: 'relative',
			fontSize: 14,
			textAlign: 'center',
			lineHeight: '18px',
			'&:before': {
				display: 'block',
				content: props => props.count > 1 ? '""' : '',
				background: '#E8EBF7',
				width: 1,
				height: 36,
				position: 'absolute',
				left: 8,
				top: -37,
			},
			'&:after': {
				display: 'block',
				content: props => props.count < 5 ? '""' : '',
				background: '#E8EBF7',
				width: 1,
				height: 30,
				position: 'absolute',
				left: 8,
				bottom: -31,
			},
		},
	}
});

export default conditionalLogicItemCountStyles;
