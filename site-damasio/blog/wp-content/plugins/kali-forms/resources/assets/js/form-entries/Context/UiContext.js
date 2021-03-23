import React, { useState, createContext, useMemo } from 'react'
const { __ } = wp.i18n;
import { useLocation } from 'react-router-dom';
export const UiContext = createContext();
export const UiProvider = props => {
	let currentPath = useLocation();
	let navbar = [
		{ label: __('Forms', 'kaliforms'), key: 'forms', path: '/' },
		{ label: __('Form entries', 'kaliforms'), key: 'form-entries', path: `/form-entries` },
		{ label: __('Exporter', 'kaliforms'), key: 'exporter', path: '/exporter' }
	]

	const [ui, setUi] = useState({
		navbar,
		selectedNavbar: [currentPath.pathname !== '/' ? currentPath.pathname.substring(1) : 'forms'],
	})


	return (<UiContext.Provider value={[ui, setUi]}>{props.children}</UiContext.Provider>)
}
