
import { IApiClient } from "@/src/data/Api";
import { BaseService } from "../base-service";
import { IDashboardServices } from "./IDashboardServices";


export class DashboardService extends BaseService implements IDashboardServices {
    constructor(apiClient: IApiClient){
        super(apiClient);

    }

    getDashboard = async() => {
        return this.apiClient.getDashboard();
    }

}