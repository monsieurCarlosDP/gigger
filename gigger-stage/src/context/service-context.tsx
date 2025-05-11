import { createContext, useContext } from "react";
import { ISongService, SongService } from "../services/song-service/song-service";
import { ISetlistService, SetlistService } from "../services/setlist-service/setlist-service";
import { HttpClient } from "../data/http-client";
import { Api } from "../data/Api";
import { DashboardService } from "../services/dashboard-service/DashboardService";
import { IDashboardServices } from "../services/dashboard-service/IDashboardServices";
import { EventService, IEventService } from "../services/event-service/event-service";
import { AuthService, IAuthService } from "../services/auth-service/auth-service";

const ServiceContext = createContext<IServiceContextProvider|null>(null);

export interface IServiceContextProvider {
    songService: ISongService;
    setlistService: ISetlistService;
    dashboardService: IDashboardServices;
    eventService: IEventService;
    authService: IAuthService;
}

export const ServiceContexProvider = ({children}:{children?:React.ReactNode}) => {
    const httpClient = new HttpClient();
    const apiClient = new Api(httpClient);
    const songService = new SongService(apiClient);
    const setlistService = new SetlistService(apiClient);
    const dashboardService = new DashboardService(apiClient);
    const eventService = new EventService(apiClient);
    const authService = new AuthService(apiClient);

    return (
        <ServiceContext.Provider value={{songService, setlistService, dashboardService, eventService, authService}}>
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