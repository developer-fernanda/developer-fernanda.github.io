import './main.scss';
const { __ } = wp.i18n;
import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import App from './containers/App';

const theme = createMuiTheme({
	palette: {
		primary: { main: '#3B88F7' },
		secondary: { main: '#8B8BF9' },
		text: {
			primary: '#46494C'
		},
		overrides: {
			MuiFormControl: {
				root: {
					width: '100%',
					'& #mui-rte-root': {
						marginTop: 25,
					}
				},
			},
			MuiButton: {
				containedSecondary: {
					color: '#fff',
				}
			},
			MuiInputLabel: {
				shrink: {
					fontSize: 14,
					transform: 'scale(1)'
				}
			},
			MuiInputAdornment: {
				positionStart: {
					marginTop: '0 !important'
				},
				positionEnd: {
					position: 'absolute',
					right: 13,
					top: 20,
				},
			},
			MuiInputBase: {
				root: {
					// background: '#fff'
				},
				inputMultiline: {
					height: '3.7em'
				}
			},
			MuiSelect: {
				select: {
					'&:focus': {
						borderRadius: 4,
						backgroundColor: '#fff',
					}
				}
			},
		}
		// type: 'dark',
	},
	typography: {
		useNextVariants: true,
	},
});

const AppProps = KaliFormsEmailSettingsObject;

if (document.getElementById('kaliforms-email-settings-page') !== null) {
	ReactDOM.render(
		<MuiThemeProvider theme={theme}>
			<App
				settings={AppProps.settings}
				providers={AppProps.providers}
				nonce={AppProps.ajax_nonce}
				ajaxurl={AppProps.ajaxurl}
			/>
		</MuiThemeProvider>,
		document.getElementById('kaliforms-email-settings-page')
	);
}
