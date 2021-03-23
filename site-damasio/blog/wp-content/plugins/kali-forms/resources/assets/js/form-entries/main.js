import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.scss'
import { AppPropsProvider } from './Context/AppPropsContext';

__webpack_public_path__ = KaliFormsFormEntriesObject.publicPath

if (document.getElementById('kaliforms-form-entries-page') !== null) {
	ReactDOM.render(
		<AppPropsProvider>
			<App />
		</AppPropsProvider>,
		document.getElementById('kaliforms-form-entries-page')
	);
}
