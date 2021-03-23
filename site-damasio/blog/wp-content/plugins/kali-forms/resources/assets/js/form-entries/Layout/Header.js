import React, { useContext } from 'react'
import { Layout as AntdLayout, Menu } from 'antd';
import { UiContext } from './../Context/UiContext';
import {
	Link
} from "react-router-dom";
import { AppPropsContext } from '../Context/AppPropsContext';
const { Header } = AntdLayout;

export default function MyHeader() {
	const [ui, setUi] = useContext(UiContext);
	const appProps = useContext(AppPropsContext);
	const updateUi = ({ item, key, keyPath, selectedKeys, domEvent }) => {
		setUi(prevUi => { return { ...prevUi, selectedNavbar: [key] } });
	}

	return (
		<Header className="header">
			<Menu theme="dark"
				mode="horizontal"
				defaultSelectedKeys={ui.selectedNavbar}
				selectedKeys={ui.selectedNavbar}
				onSelect={updateUi}>
				{ui.navbar.map(el => (
					<Menu.Item key={el.key}>
						<Choose>
							<When condition={el.key === 'exporter' && !appProps.plugins.submissions}>
								<a target="_blank" href="https://www.kaliforms.com/pricing?utm_source=formAnalytics&utm_campaign=userInterests&utm_medium=proBadge">{el.label} <b style={{ color: '#cf1322', position: 'relative', top: -5 }}>PRO</b></a>
							</When>
							<Otherwise>
								<Link to={el.path}>{el.label}</Link>
							</Otherwise>
						</Choose>
					</Menu.Item>
				))}
			</Menu>
		</Header>
	)
}
