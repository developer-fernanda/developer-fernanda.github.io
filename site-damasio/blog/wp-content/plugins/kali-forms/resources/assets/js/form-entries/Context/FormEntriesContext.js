import React, { useState, createContext } from 'react';
import { useParams } from "react-router-dom";
import Api from './../utils/Api';
import DataFormatter from './../utils/DataFormatter';
import PaginationFormatter from './../utils/PaginationFormatter';

export const FormEntriesContext = createContext();
export const FormEntriesProvider = props => {
	const { id } = useParams();
	const [data, setData] = useState([]);
	const [columns, setColumns] = useState([]);
	const [filters, setFilters] = useState([]);
	const [pagination, setPagination] = useState({ totalRows: 0, pageSize: 10 });
	const [loading, setLoading] = useState(true);
	const [tableWidth, setTableWidth] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState([]);

	React.useEffect(() => {
		setLoading(true);
		if (!id) {
			setLoading(false);
			return;
		}

		fetchNewData({ page: 1, pageSize: pagination?.pageSize ? pagination.pageSize : 10 });

		return () => {
			setColumns([])
			setData([])
			setPagination({})
			setSelectedFilter([])
		};
	}, [id])

	const fetchNewData = (params) => {
		setLoading(true);
		setData([]);
		Api.getFormEntries(id, params.page, params.pageSize, params?.filter ? params.filter : false).then(res => {
			if (params?.filter) {
				setSelectedFilter(params.filter);
			}

			if (res.data.length) {
				const { columns, rows, tableWidth, filters } = DataFormatter(res.data)
				const { pagination } = PaginationFormatter(res.headers);

				setFilters(filters);
				setColumns(columns);
				setData(rows.length > params.pageSize ? rows.slice(0, params.pageSize) : rows);
				setPagination(pagination);
				setTableWidth(tableWidth);
			}

			setLoading(false)
		}).catch(err => console.warn(err));
	}

	const deleteEntries = ids => {
		setLoading(true);
		setData([]);

		Api.deleteEntries(ids)
			.then(res => {
				fetchNewData({
					page: pagination?.currentPage ? pagination.currentPage : 1,
					pageSize: pagination?.pageSize ? pagination.pageSize : 10,
					filter: Array.isArray(selectedFilter) ? false : selectedFilter
				})
			})
			.catch(err => console.warn(err))
	}

	return (
		<FormEntriesContext.Provider value={{
			data: [data, setData],
			columns: [columns, setColumns],
			filters: [filters, setFilters],
			selectedFilter: [selectedFilter, setSelectedFilter],
			tableWidth: [tableWidth, setTableWidth],
			pagination: [pagination, setPagination],
			loading: [loading, setLoading],
			fetchData: fetchNewData,
			deleteEntries: deleteEntries,
		}}>
			{props.children}
		</FormEntriesContext.Provider>
	)
}
