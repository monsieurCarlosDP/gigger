import {
    DefaultError,
    Mutation,
    MutationCache,
    Query,
    QueryCache,
    QueryClient,
    QueryClientConfig,
    QueryOptions,
  } from '@tanstack/react-query';

  export interface IReactQuerySetupSingleton {
    //TODO: REACT QUERY ERROR SUBSCRIBER
    queryClient: QueryClient;
  }

  export default class ReactQuerySetupSingleton implements IReactQuerySetupSingleton {
    private static instance: ReactQuerySetupSingleton;

    //TODO: REACT QUERY GLOBAL ERROR HANDLERS
    public queryClient: QueryClient;

    private constructor(){
        this.queryClient = new QueryClient({
            queryCache: new QueryCache(),
            mutationCache: new MutationCache(),
            defaultOptions: {
                queries: {
                    retryDelay: 1000,
                    staleTime: 1000,
                },
                mutations: {
                    retry:false
                }
            },
            
        })
    }

    public static getInstance(): ReactQuerySetupSingleton {
        if (!ReactQuerySetupSingleton.instance) {
            ReactQuerySetupSingleton.instance = new ReactQuerySetupSingleton();
        }
    
        return ReactQuerySetupSingleton.instance;
    }

    public setQueryClientConfigDefaultOptions = (
        options: NonNullable<QueryClientConfig['defaultOptions']>,
        ): ReactQuerySetupSingleton => {
        this.queryClient.clear();
        this.queryClient.unmount();
        
        this.queryClient = new QueryClient({
            queryCache: new QueryCache(),
            mutationCache: new MutationCache(),
            defaultOptions: {
            queries: {
                retryDelay: 1000,
                staleTime: 1000,
                ...options.queries,
            },
            mutations: {
                retry: false,
                ...options.mutations,
            },
            },
            });
        return this;
    };

    public isFetching = () => {
    return this.queryClient.isFetching();
    };

    public isMutating = () => {
    return this.queryClient.isMutating();
    };

    public clear = () => {
    return this.queryClient.clear();
    };
}
  