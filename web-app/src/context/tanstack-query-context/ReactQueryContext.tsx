import { QueryClientProvider } from "@tanstack/react-query";
import React, { createContext } from "react";

export interface IReactQueryContextProvider {
    children?: React.ReactNode;
}

export const ReactQueryContext = createContext<IReactQueryContextProvider | null>(null);

export const ReactQueryContextProvider = ({
    children,
    
}: IReactQueryContextProvider) => {

    const contextValue = {
        console: console.log("hola")
    }

    return (
        <QueryClientProvider client={}>
            <ReactQueryContext.Provider value={contextValue}>{children}</ReactQueryContext.Provider>
        </QueryClientProvider>
    )

}