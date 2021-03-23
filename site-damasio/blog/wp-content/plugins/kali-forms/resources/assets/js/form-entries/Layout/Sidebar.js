import React, { useContext } from 'react'
import { Layout as AntdLayout, Card } from 'antd';
import { FormEntriesContext } from './../Context/FormEntriesContext';
const { Sider } = AntdLayout;
import Loader from './Loader';
// const Filter = React.lazy(() => import('./../SidebarStuff/Filter'));
import Filter from './../SidebarStuff/Filter';

export default function Sidebar() {
	const context = useContext(FormEntriesContext);
	const [filters] = context.filters;

	return (
		<Sider className="site-layout-background" width={240}>
			<Card loading={filters.length === 0}>
				{/* <React.Suspense fallback={<Loader />}> */}
					<Filter />
				{/* </React.Suspense> */}
			</Card>
		</Sider>
	)
}
