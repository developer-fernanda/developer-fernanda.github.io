import {
	HashRouter as Router,
} from "react-router-dom";
import React from 'react'
import { Layout as AntdLayout } from 'antd';
import Header from './Layout/Header';
import Content from './Layout/Content';
import { UiProvider } from './Context/UiContext';

export default function App() {
	return (
		<Router>
			<UiProvider>
				<AntdLayout>
					<Header />
					<Content />
				</AntdLayout>
			</UiProvider>
		</Router>
	)
}
