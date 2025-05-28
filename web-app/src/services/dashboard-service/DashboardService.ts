import { BaseService } from "../base-service/base-service";
import { type IDashboardServices } from "./IDashboardServices";
import { type IGiggerApiClient } from "../../data/infraestructure/IGiggerApiClient";

export class DashboardService extends BaseService implements IDashboardServices {
    constructor(apiClient: IGiggerApiClient){
        super(apiClient);

    }

    getDashboard = async() => {
        return this.apiClient.getDashboard();
    }

}