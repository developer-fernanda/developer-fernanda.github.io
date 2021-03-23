const PaginationFormatter = (data) => {
	let currentPage = data?.['x-wp-currentpage'] ? parseInt(data['x-wp-currentpage']) : 1;
	let totalRows = data?.['x-wp-total'] ? parseInt(data['x-wp-total']) : 0;
	let totalPages = data?.['x-wp-totalpages'] ? parseInt(data['x-wp-totalpages']) : 1;
	let prevPage = currentPage === 1 ? false : currentPage - 1
	let nextPage = currentPage === totalPages ? false : currentPage + 1
	let pageSize = data?.['x-wp-perpage'] ? parseInt(data['x-wp-perpage']) : 10;

	const pagination = {
		currentPage,
		totalRows,
		totalPages,
		prevPage,
		nextPage,
		pageSize,
	};

	return { pagination }
}

export default PaginationFormatter;
