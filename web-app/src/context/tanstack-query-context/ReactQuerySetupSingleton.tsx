import {
    DefaultError,
    Mutation,
    MutationCache,
    Query,
    QueryCache,
    QueryClient,
    QueryClientConfig,
    QueryOption
} from '@tanstack/react-query'

export type TReactQueryErrorHandler = (error?:Error) => void;

export interface IReactQuerySetupSingleton {
    queryErrorSubscribers: Map<string, TReactQueryErrorHandler>;
    queryClient: QueryClient;
  }

export default class ReactQuerySetupSingleton implements IReactQuerySetupSingleton {
    private static instance: ReactQuerySetupSingleton;
    private _globalErrorHandler?: TReactQueryErrorHandler;

    public readonly queryErrorSubscribers: Map<string,TReactQueryErrorHandler>

    private constructor() {
        console.debug('Initialising React Query Singleton');
        
        this.queryErrorSubscribers = new Map<string, TReactQueryErrorHandler>();
    }

}