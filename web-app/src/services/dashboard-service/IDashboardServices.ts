import { type IDashboardItemDTO } from "./IDashboardServiceDTO";

export interface IDashboardServices {
    getDashboard: ()=>Promise<IDashboardItemDTO>;
}