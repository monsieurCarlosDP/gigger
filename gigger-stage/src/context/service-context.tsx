import { createContext, useContext } from "react";
import { ISongService, SongService } from "../services/song-service/song-service";
import { ISetlistService, SetlistService } from "../services/setlist-service/setlist-service";
import { HttpClient } from "../data/http-client";
import { Api } from "../data/Api";

const ServiceContext = createContext<IServiceContextProvider|null>(null);

export interface IServiceContextProvider {
    songService: ISongService;
    setlistService: ISetlistService;
}

export const ServiceContexProvider = ({children}:{children?:React.ReactNode}) => {
    const httpClient = new HttpClient();
    const apiClient = new Api(httpClient);
    const songService = new SongService(apiClient);
    const setlistService = new SetlistService(apiClient);

    return (
        <ServiceContext.Provider value={{songService,setlistService}}>
            {children}
        </ServiceContext.Provider>
    )
}

export const useServiceContext = () => {
    const context = useContext(ServiceContext);
    if(!context)
    {
        throw new Error('useServiceContext must be used within a ServiceContextProvider');
    }
    return context;
}