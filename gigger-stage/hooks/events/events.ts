import { useServiceContext } from "@/src/context/service-context"
import { useQuery } from "@tanstack/react-query"
import { eventQueryKeyFactory } from "./eventQueryKeyFactory"

export const useEventsService = () => {
    const {eventService} = useServiceContext();

    const {
            isLoading: isLoadingEvents,
            data: eventsData,
            error: eventsError
        } = useQuery(eventQueryKeyFactory.getEvents(eventService));

        
        return {isLoadingEvents, eventsData, eventsError}

}


export const useEventService = (id:string) => {

    const {eventService} = useServiceContext();

    const {
        isLoading: isLoadingEvent,
        data: eventData,
        error: eventError
    } = useQuery(eventQueryKeyFactory.getEvent(eventService,id));

    return {isLoadingEvent, eventData, eventError}
}