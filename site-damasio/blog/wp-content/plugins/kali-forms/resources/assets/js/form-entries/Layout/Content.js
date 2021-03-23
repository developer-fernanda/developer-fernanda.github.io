import React from 'react'
import { Layout as AntdLayout } from 'antd';
// import Loader from './Loader';
import Sidebar from './Sidebar';
import ExporterSidebar from './ExporterSidebar';
import {
	Switch,
	Route,
} from "react-router-dom";

// const Forms = React.lazy(() => import(/* webpackChunkName: "formsPage" */'./../Forms/Forms'));
// const FormEntries = React.lazy(() => import(/* webpackChunkName: "formEntriesPage" */'./../FormEntries/FormEntries'));
// const FormEntry = React.lazy(() => import(/* webpackChunkName: "formEntryPage" */'./../FormEntry/FormEntry'));

// const Exporter = React.lazy(() => import(/* webpackChunkName: "exporter" */'./../Exporter/Exporter'));

import Forms from './../Forms/Forms';
import FormEntries from './../FormEntries/FormEntries';
import FormEntry from './../FormEntry/FormEntry';
import Exporter from './../Exporter/Exporter';

import { FormEntriesProvider } from './../Context/FormEntriesContext';
import { ExportProvider } from './../Context/ExportContext';
import { AppPropsProvider } from '../Context/AppPropsContext';
const { Content } = AntdLayout;

export default function MyContent() {
	const contentStyle = { background: '#fff', padding: '12px 24px 24px', minHeight: 280 }
	return (
		<Content style={{ padding: '0 50px' }}>
			<AntdLayout className="site-layout-background" style={{ padding: '24px 0' }}>
				<Switch>
					<Route exact path='/'>
						<Content className="site-layout-background"
							style={contentStyle}>
							{/* <React.Suspense fallback={<Loader />}> */}
								<Forms />
							{/* </React.Suspense> */}
						</Content>
					</Route>
					<Route path="/form-entries/:id?">
						<FormEntriesProvider>
							<Sidebar />
							<AntdLayout style={{ padding: '0 24px 24px' }}>
								<Content className="site-layout-background"
									style={contentStyle}>
									{/* <React.Suspense fallback={<Loader />}> */}
										<FormEntries />
									{/* </React.Suspense> */}
								</Content>
							</AntdLayout>
						</FormEntriesProvider>
					</Route>
					<Route path="/form-entry/:id">
						<Content className="site-layout-background"
							style={contentStyle}>
							{/* <React.Suspense fallback={<Loader />}> */}
								<FormEntry />
							{/* </React.Suspense> */}
						</Content>
					</Route>
					<Route path="/exporter">
						<ExportProvider>
							<AppPropsProvider>
								<ExporterSidebar />
							</AppPropsProvider>
							<AntdLayout style={{ padding: '0 24px 24px' }}>
								{/* <React.Suspense fallback={<Loader />}> */}
									<Content className="site-layout-background"
										style={contentStyle}>
										<Exporter />
									</Content>
								{/* </React.Suspense> */}
							</AntdLayout>
						</ExportProvider>
					</Route>
				</Switch>
			</AntdLayout>
		</Content>
	)
}

