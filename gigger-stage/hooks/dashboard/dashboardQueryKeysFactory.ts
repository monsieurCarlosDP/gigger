import { createQueryKeys } from '@lukemorales/query-key-factory';

import{ IDashboardServices } from '@/src/services/dashboard-service/IDashboardServices';

export const dashboardQueryKeysFactory = createQueryKeys('setlists',
    {


        getDashboard: (setlistService: IDashboardServices) => ({
            queryKey: [undefined],
            queryFn: ()=> setlistService.getDashboard()
        })
    }
)