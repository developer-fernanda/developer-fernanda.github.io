import React, { createContext } from 'react'

export const AppPropsContext = createContext();

const AppProps = KaliFormsFormEntriesObject;
export const AppPropsProvider = (props) => {
	return (
		<AppPropsContext.Provider value={AppProps}>{props.children}</AppPropsContext.Provider>
	)
}
