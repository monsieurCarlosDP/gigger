import { BaseService } from "../base-service/base-service";
import { IDashboardServices } from "./IDashboardServices";
import { IGiggerApiClient } from "@/data/infraestructure/IGiggerApiClient";

export class DashboardService extends BaseService implements IDashboardServices {
    constructor(apiClient: IGiggerApiClient){
        super(apiClient);

    }

    getDashboard = async() => {
        return this.apiClient.getDashboard();
    }

}