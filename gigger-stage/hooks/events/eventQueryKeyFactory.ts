
import { IEventService } from '@/src/services/event-service/event-service';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const eventQueryKeyFactory = createQueryKeys('events',

    {
        getEvents: (eventService: IEventService) => ({
        queryKey: [undefined],
        queryFn: ()=>eventService.getEvents()
        }),
        getEvent: (eventService: IEventService, id:string) => ({
            queryKey: ['event'],
            queryFn: () => eventService.getEvent(id)
        })
}
);