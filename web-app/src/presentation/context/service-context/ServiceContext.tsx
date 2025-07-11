import { createContext, useContext } from "react";
import { HttpClient } from "../../../data/api-client/http-client";
import { GiggerApiClient } from "../../../data/infraestructure/GiggerApiClient";
import { DashboardService } from "../../../services/dashboard-service/DashboardService";
import type { IDashboardServices } from "../../../services/dashboard-service/IDashboardServices";
import type { ISetlistServices } from "../../../services/setlist-service/ISetlistServices";
import { SetlistService } from "../../../services/setlist-service/setlist-service";
import type { ISongServices } from "../../../services/song-service/ISongServices";
import { SongService } from "../../../services/song-service/song-service";

const ServiceContext = createContext<IServiceContextProvider | null>(null);

export interface IServiceContextProvider {
  songService: ISongServices;
  setlistService: ISetlistServices;
  dashboardService: IDashboardServices;
}

export const ServiceContextProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const httpClient = new HttpClient();
  const apiClient = new GiggerApiClient(httpClient);
  const songService = new SongService(apiClient);
  const setlistService = new SetlistService(apiClient);
  const dashboardService = new DashboardService(apiClient);

  return (
    <ServiceContext.Provider
      value={{ songService, setlistService, dashboardService }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceContext = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error(
      "useServiceContext must be used within a ServiceContextProvider"
    );
  }
  return context;
};
