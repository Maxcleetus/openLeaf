import { createContext , useContext , useState } from "react";
import {details} from '../assets/assets.js'
const AppContext = createContext()


export const AppProvider = ({children})=>{

    const value = {details}

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}

export const useAppContext = ()=> useContext(AppContext)