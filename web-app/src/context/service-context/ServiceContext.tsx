import { HttpClient } from "@/data/api-client/http-client";
import { GiggerApiClient } from "@/data/infraestructure/GiggerApiClient";
import { SetlistService } from "@/services/setlist-service/SetlistService";
import { ISongServices } from "@/services/song-service/ISongServices";
import { ISetlistServices } from "@/services/setlist-service/ISetlistServices";
import { SongService } from "@/services/song-service/SongService";
import { createContext, useContext } from "react";


const ServiceContext = createContext<IServiceContextProvider|null>(null);

export interface IServiceContextProvider {
    songService: ISongServices;
    setlistService: ISetlistServices;
}

export const ServiceContextProvider = ({children}:{children?: React.ReactNode}) => {

    const httpClient = new HttpClient();
    const apiClient = new GiggerApiClient(httpClient);
    const songService = new SongService(apiClient);
    const setlistService = new SetlistService(apiClient);

    return (
        <ServiceContext.Provider value={{songService,setlistService}}>
            {children}
        </ServiceContext.Provider>
    );
}

export const useServiceContext = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useServiceContext must be used within a ServiceContextProvider');
    }
    return context;
}