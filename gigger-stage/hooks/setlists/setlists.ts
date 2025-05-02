import { useServiceContext } from "@/src/context/service-context"
import { useQuery } from "@tanstack/react-query"
import { setlistsQueryKeyFactory } from "./setlistQueryKeysFactory"



export const useSetlistsService = ()=> {
    const { setlistService } = useServiceContext();
    const {
        isLoading: isLoadingSetlists,
        data: setlistsData,
        error: setlistsError
    } = useQuery(setlistsQueryKeyFactory.getSetlists(setlistService));
    
    return {isLoadingSetlists, setlistsData, setlistsError}
}

export const useSetlistService = (id:string) => {
    const { setlistService } = useServiceContext();
    const {
        isLoading: isLoadingSetlist,
        data: setlistData,
        error: setlistError
    } = useQuery(setlistsQueryKeyFactory.getSetlist(setlistService,id));

    return {isLoadingSetlist, setlistData, setlistError}
}