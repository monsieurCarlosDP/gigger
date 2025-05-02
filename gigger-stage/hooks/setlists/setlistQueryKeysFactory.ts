import { createQueryKeys } from '@lukemorales/query-key-factory';

import { ISetlistService, SetlistService } from '@/src/services/setlist-service/setlist-service';

export const setlistsQueryKeyFactory = createQueryKeys('setlists',
    {
        getSetlists: (setlistService: ISetlistService) => ({
            queryKey: [undefined],
            queryFn: ()=>setlistService.getSetlists()
        }),

        getSetlist: (setlistService: ISetlistService, id:string) => ({
            queryKey: [id],
            queryFn: ()=> setlistService.getSetlist(id)
        })
    }
)