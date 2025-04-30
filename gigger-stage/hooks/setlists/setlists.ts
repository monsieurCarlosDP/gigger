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