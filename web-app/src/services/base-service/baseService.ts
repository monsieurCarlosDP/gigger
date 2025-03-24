import { IGiggerApiClient } from "@/data/infraestructure/IGiggerApiClient";

export class BaseService {
    protected apiClient: IGiggerApiClient;
    constructor(apiClient: IGiggerApiClient) {
        this.apiClient = apiClient;
    }
}