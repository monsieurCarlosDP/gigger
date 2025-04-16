import {
    DefaultError,
    Mutation,
    MutationCache,
    Query,
    QueryCache,
    QueryClient,
/*     QueryClientConfig,
    QueryOption,
    QueryOptions */
} from '@tanstack/react-query'
import { REACT_QUERY_CLIENT_CONFIG } from './configReactQuery';

export type TReactQueryErrorHandler = (error?:Error) => void;

export type TReactQueryGlobalErrorHandler = (
    error: DefaultError,
    query: Query<unknown, unknown, unknown> | Mutation<unknown, unknown, unknown> | undefined,
) => void;

export interface IReactQuerySetupSingleton {
    queryErrorSubscribers: Map<string, TReactQueryErrorHandler>;
    queryClient: QueryClient;
}

export default class ReactQuerySetupSingleton implements IReactQuerySetupSingleton {
    private static instance: ReactQuerySetupSingleton;
    private _globalErrorHandler?: TReactQueryGlobalErrorHandler;

    public readonly queryErrorSubscribers: Map<string,TReactQueryErrorHandler>
    public queryClient: QueryClient;

    private constructor() {
        console.debug('Initialising React Query Singleton');
        
        this.queryErrorSubscribers = new Map<string, TReactQueryErrorHandler>();

        this.queryClient = new QueryClient(
            {
                queryCache: new QueryCache({/* 
                    onError: this.onErrorQueryCache,    */      
                }),
                mutationCache: new MutationCache({/* 
                    onError: this.onErrorMutationCache, */
                }),

                defaultOptions: {
                    queries: {
                    retry: true, // Revisar del original, typeGuard de errores
                    retryDelay: REACT_QUERY_CLIENT_CONFIG.defaultOptions.queries.retryDelay,
                    staleTime: REACT_QUERY_CLIENT_CONFIG.defaultOptions.queries.staleTime,
                    },
                    mutations: {
                    retry: REACT_QUERY_CLIENT_CONFIG.defaultOptions.mutations?.retry,
                    },
                },
            }
        );
    }

    public static getInstance(): ReactQuerySetupSingleton {
        if (!ReactQuerySetupSingleton.instance) {
          ReactQuerySetupSingleton.instance = new ReactQuerySetupSingleton();
        }
    
        return ReactQuerySetupSingleton.instance;
      }

    public isFetching = () => {
        return this.queryClient.isFetching();
        };

    public isMutating = () => {
    return this.queryClient.isMutating();
    };

    public clear = () => {
    return this.queryClient.clear();
    };

   /*  private onErrorQueryCache: (error: DefaultError, query: Query<unknown, unknown, unknown>) => void = (
        error,
        query,
      ) => {
        // Report to global handler
        this._globalErrorHandler?.(error, query);
    
        // Notify subscribers
        const expectedError = error?.response?.status
          ? query.meta?.expectedErrors?.[error.response?.status as HttpStatusCode]
          : undefined;
        this.queryErrorSubscribers.forEach((subscriber) => subscriber(error, expectedError?.i18nErrorMessage));
      };
    
      private onErrorMutationCache: (
        error: DefaultError,
        variables: unknown,
        context: unknown,
        mutation: Mutation<unknown, unknown, unknown>,
      ) => void = (error, variables, context, mutation) => {
        // Report to global handler
        this._globalErrorHandler?.(error, mutation);
    
        // Notify subscribers
        const expectedError = error?.response?.status
          ? mutation.meta?.expectedErrors?.[error.response.status as HttpStatusCode]
          : undefined;
        this.queryErrorSubscribers.forEach((subscriber) => subscriber(error, expectedError?.i18nErrorMessage));
      }; */
}