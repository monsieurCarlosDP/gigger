import { QueryClientProvider } from "@tanstack/react-query";
import React, { createContext } from "react";
import { IReactQuerySetupSingleton } from "./ReactQuerySetupSingleton";

export interface IReactQueryContextProviderProps {
    children?: React.ReactNode;
    reactQuerySetupSingleton: IReactQuerySetupSingleton
}

export interface IReactQueryContextProvider {
    console: ()=>void
}

export const ReactQueryContext = createContext<IReactQueryContextProvider | null>(null);

export const ReactQueryContextProvider = ({
    children,
    reactQuerySetupSingleton,
    
}: IReactQueryContextProviderProps) => {


    const { queryClient } = reactQuerySetupSingleton;
    const contextValue = {
        console: ()=>console.log("hola")
    }

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryContext.Provider value={contextValue}>{children}</ReactQueryContext.Provider>
        </QueryClientProvider>
    )

}