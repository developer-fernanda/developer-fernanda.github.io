import React, { useState, createContext } from 'react'

export const ExportContext = createContext();
export const ExportProvider = props => {
	const [exportOptions, setExportOptions] = useState({
		loading: false,
		status: 'idle',
		form: null,
		fields: [],
		formattedFields: [],
		filters: [],
		fileFormat: 'csv',
		currentStep: 0,
		googleSheet: 'new',
	})
	return (<ExportContext.Provider value={[exportOptions, setExportOptions]}>{props.children}</ExportContext.Provider>)
}
