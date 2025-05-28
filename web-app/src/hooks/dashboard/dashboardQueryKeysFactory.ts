import { createQueryKeys } from '@lukemorales/query-key-factory';

import { IDashboardServices } from '../../../services/dashboard-service/IDashboardServices';

const dashboardQueryKeyFactory = createQueryKeys('dashboard',
    {
        getDashboard: (dashboardService: IDashboardServices) => ({
            queryKey: [undefined],
            queryFn: () => dashboardService.getDashboard(),
          }),
    }
)


export default dashboardQueryKeyFactory;