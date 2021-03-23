import React from 'react';
import ReactDOM from 'react-dom';
import theme from './theme/theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import supressNotices from '@/forms/utils/notices';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './containers/App';

KaliFormsObject.notices = supressNotices();
ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<CssBaseline />
		<SnackbarProvider>
			<App />
		</SnackbarProvider>
	</MuiThemeProvider>,
	document.getElementById('kaliforms-container')
);

import '@scss/main.scss';
