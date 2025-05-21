import { useServiceContext } from "@/src/context/service-context"
import { useQuery } from "@tanstack/react-query"
import { eventQueryKeyFactory } from "./eventQueryKeyFactory"


export const useEventService = () => {
    const {eventService} = useServiceContext();

    const {
            isLoading: isLoadingEvents,
            data: eventsData,
            error: eventsError
        } = useQuery(eventQueryKeyFactory.getEvents(eventService));
        
        return {isLoadingEvents, eventsData, eventsError}

}


// Crear el metodo para conseguir everntos individuales