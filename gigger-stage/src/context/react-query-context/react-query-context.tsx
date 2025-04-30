import React, { useContext } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IReactQuerySetupSingleton } from './react-query-setup-singleton';

export const ReactQueryContext = React.createContext<IReactQuerySetupSingleton | null>(null);
export interface IReactQueryContextProvider {}

interface IReactQueryContextConfig {
    renderDevTools: boolean;
    renderStatusDispatcher: boolean;
}

interface IReactQueryContextProviderProps {
    children?: React.ReactNode;
    reactQuerySetupSingleton: IReactQuerySetupSingleton;
    config?: IReactQueryContextConfig;
}

export const ReactQueryContextProvider = ({
    children,
    reactQuerySetupSingleton,
    config
}:IReactQueryContextProviderProps) => {
    const {queryClient} = reactQuerySetupSingleton

    return (
        <QueryClientProvider client={queryClient    }>
            <ReactQueryContext.Provider value={{queryClient}}>{children}</ReactQueryContext.Provider>
        </QueryClientProvider>
    )
}
