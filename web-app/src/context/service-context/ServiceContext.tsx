import { HttpClient } from "@/data/api-client/http-client";
import { GiggerApiClient } from "@/data/infraestructure/GiggerApiClient";
import { ISongServices } from "@/services/song-service/ISongServices";
import { SongService } from "@/services/song-service/SongService";
import { createContext, useContext } from "react";


const ServiceContext = createContext<IServiceContextProvider|null>(null);

export interface IServiceContextProvider {
    songService: ISongServices;
}

export const ServiceContextProvider = ({children}:{children?: React.ReactNode}) => {

    const httpClient = new HttpClient();
    const apiClient = new GiggerApiClient(httpClient);
    const songService = new SongService(apiClient);

    return (
        <ServiceContext.Provider value={{songService}}>
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