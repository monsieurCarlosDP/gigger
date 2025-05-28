import { QueryClientConfig } from "@tanstack/react-query";

export const REACT_QUERY_CLIENT_CONFIG: QueryClientConfig & {
    defaultOptions: QueryClientConfig['defaultOptions'] &
    {
        queries: Required<NonNullable<QueryClientConfig['defaultOptions']>>['queries'] & {
            baseRetryMs: number;
            baseRetryIncrement: number;
            maxRetryIntervalsMs: number;
        }
    }
} = {
    defaultOptions: {
        queries: {
            retry: 3,
            baseRetryMs: 500,
            baseRetryIncrement: 2,
            maxRetryIntervalsMs: 3000,
            staleTime: 20*1000,
            retryDelay: (attemptIndex) => 
                Math.min(REACT_QUERY_CLIENT_CONFIG.defaultOptions.queries.baseRetryMs *
                        REACT_QUERY_CLIENT_CONFIG.defaultOptions.queries.baseRetryIncrement ** attemptIndex, 
                        REACT_QUERY_CLIENT_CONFIG.defaultOptions.queries.maxRetryIntervalsMs),

        },
        mutations: {
            retry: false
        }
    }
}
