import { Api, IApiClient } from "../data/Api";


export class BaseService {
    protected apiClient: IApiClient;
    constructor(apiClient:IApiClient){
        this.apiClient = apiClient;
    }
}